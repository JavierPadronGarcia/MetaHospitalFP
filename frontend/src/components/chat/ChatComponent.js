import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { decodeToken } from '../../utils/shared/globalFunctions';
import { webSocketEndpoint } from "../../consts/backendEndpoints";
import { Button, Input, message } from "antd";
import { backendMessagesEndpoint } from "../../consts/backendEndpoints";
import './ChatComponent.css';
import Headers from "../headers/headers";
import { CaretRightOutlined } from "@ant-design/icons";

function ChatComponent() {
  const params = useParams();
  const groupId = params.groupId;
  const user = decodeToken();
  const [chatMessages, setChatMessages] = useState([]);
  const [offlineChatMessages, setOfflineMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [messageField, setMessageField] = useState('');

  const group = JSON.parse(localStorage.getItem('studentGroup'));

  const CHAT_MESSAGE = 'chatMessage';
  const CONNECTED_USERS_COUNT = 'connectedUsersCount';
  const GET_ALL_MESSAGES = 'getAllMessages';
  const GET_LAST_MESSAGE = 'getLastMessages';

  const ws = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const SERVER_URL = `${webSocketEndpoint}?&groupId=${groupId}&userId=${user.id}`;
    ws.current = new WebSocket(SERVER_URL);

    ws.current.onopen = () => {

      const messages = JSON.parse(localStorage.getItem('chatMessages'));

      if (messages && messages.length !== 0) {
        updateMessages(messages[messages.length - 1].id);
      } else {
        getAllMessages();
      }

    }

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === CHAT_MESSAGE) {
        chatMessageRecieved(message);
      }

      if (message.type === CONNECTED_USERS_COUNT) {
        updateCountMessageReceived(message);
      }

      if (message.type === GET_ALL_MESSAGES) {
        handleAllMessagesReceived(message);
      }

      if (message.type === GET_LAST_MESSAGE) {
        handleLastMessagesReceived(message.messages);
      }

    }

    return () => {
      ws.current.close();
    }
  }, [groupId, user.id]);

  useEffect(() => {

    if (!navigator.onLine) {
      const offlineMessages = JSON.parse(localStorage.getItem('offline-messages'));
      setOfflineMessages(offlineMessages || []);
    }

    const handleMessageFromServiceWorker = (event) => {
      if (event.data.type === 'sync-message') {
        message.loading('Vuelves a tener conexión, actualizando mensajes...', 1);
        const messages = JSON.parse(localStorage.getItem('chatMessages'));
        updateMessages(messages[messages.length - 1].id);
        setOfflineMessages([]);
        localStorage.setItem('offlineMessages', JSON.stringify([]));
      }
    }
    navigator.serviceWorker.addEventListener('message', handleMessageFromServiceWorker);
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, offlineChatMessages]);


  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const chatMessageRecieved = (message) => {
    const allMessages = JSON.parse(localStorage.getItem('chatMessages'));
    const msg = {
      id: message.id,
      GroupID: message.GroupID,
      userID: message.userID,
      username: message.username,
      message: message.message,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    }
    allMessages.push(msg);
    localStorage.setItem('chatMessages', JSON.stringify(allMessages));

    setChatMessages(prevMessages => [
      ...prevMessages,
      message
    ]);
  }

  const updateCountMessageReceived = (message) => {
    setConnectedUsers(parseInt(message.count));
  }

  const handleAllMessagesReceived = (message) => {
    localStorage.setItem('chatMessages', message.messages);
    setChatMessages(JSON.parse(message.messages));
  }

  const handleLastMessagesReceived = (message) => {
    const messages = JSON.parse(localStorage.getItem('chatMessages'));

    message = JSON.parse(message);

    message.forEach(data => {
      messages.push(data);
    });

    localStorage.setItem('chatMessages', JSON.stringify(messages));
    setChatMessages(messages);
  }

  const sendMessage = (text) => {
    const message = {
      type: 'chatMessage',
      groupId,
      userId: user.id,
      message: text
    };

    if (navigator.onLine) {
      ws.current.send(JSON.stringify(message));
    } else {
      registerBackgroundSync(message);
    }
    setMessageField('');
  };

  const getAllMessages = () => {
    const message = {
      type: 'getAllMessages',
      groupId,
      userId: user.id
    }
    ws.current.send(JSON.stringify(message));
  }

  const registerBackgroundSync = (message) => {
    navigator.serviceWorker.ready.then(swRegistration => {
      swRegistration.sync.register("message-sync");
    }).catch(err => console.log(err))

    navigator.serviceWorker.ready.then(swRegistration => {
      const token = localStorage.getItem('token');
      swRegistration.active.postMessage({
        action: 'offlineMessage',
        message: message,
        token: token,
        backendEndpoint: backendMessagesEndpoint
      });
    })

    let offlineMessages = JSON.parse(localStorage.getItem('offlineMessages'));
    if (!offlineMessages) offlineMessages = [];

    offlineMessages.push(message);

    localStorage.setItem('offlineMessages', JSON.stringify(offlineMessages));
    setOfflineMessages(prevState => [...prevState, message]);
  }

  const updateMessages = (lastId) => {
    const message = {
      type: GET_LAST_MESSAGE,
      groupId,
      userId: user.id,
      lastId
    }
    ws.current.send(JSON.stringify(message));
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageField !== '') {
      sendMessage(messageField);
    }
  };

  return (
    <>
      <Headers title={`${group.name} - Chat de grupo`} groupId={groupId} />
      <div className="chat-component">
        <div className="connected-users">En línea: {connectedUsers}</div>
        <div className="messages">
          {chatMessages.map((message, index) => {
            if (message.username === user.name) {
              return (
                <div key={index} className="personal-message">
                  <div className="text">{message.message}</div>
                </div>
              )
            }
            return (
              <div key={index} className="normal-message">
                <div className="user-name">{message.username}</div>
                <div className="text">{message.message}</div>
              </div>
            )
          })}
          {offlineChatMessages.map((message, index) => (
            <div key={index}>{(message.username)}: {message.message} <span>...OFFLINE...</span></div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <form onSubmit={(e) => handleSendMessage(e)} className="message-form">
          <Input placeholder="mensaje..." id="messageField" value={messageField} onChange={(e) => setMessageField(e.target.value)} />
          <Button
            id="buttonField"
            htmlType="submit"
            shape="circle"
            onClick={handleSendMessage}
            disabled={messageField === ''}
            icon={<CaretRightOutlined />}
          />
        </form>
      </div>
    </>
  );
}

export default ChatComponent;
