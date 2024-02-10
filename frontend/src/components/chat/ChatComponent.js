import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { decodeToken } from '../../utils/shared/globalFunctions';
import { webSocketEndpoint } from "../../consts/backendEndpoints";
import { Button, Input, message } from "antd";
import { backendMessagesEndpoint } from "../../consts/backendEndpoints";

function ChatComponent() {
  const params = useParams();
  const groupId = params.groupId;
  const user = decodeToken();
  const [chatMessages, setChatMessages] = useState([]);
  const [offlineChatMessages, setOfflineMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [messageField, setMessageField] = useState('');

  const CHAT_MESSAGE = 'chatMessage';
  const CONNECTED_USERS_COUNT = 'connectedUsersCount';
  const GET_ALL_MESSAGES = 'getAllMessages';
  const GET_LAST_MESSAGE = 'getLastMessages';

  const ws = useRef();

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

    message.username = 'TU';

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
    <div className="chat-component">
      <h2>En línea: {connectedUsers}</h2>
      {chatMessages.map((message, index) => (
        <div key={index}>{(message.username == user.username) ? 'TU' : message.username}: {message.message}</div>
      ))}
      {offlineChatMessages.map((message, index) => (
        <div key={index}>{(message.username)}: {message.message} <span>...OFFLINE...</span></div>
      ))}
      <form onSubmit={(e) => handleSendMessage(e)}>
        <Input placeholder="mensaje..." id="messageField" value={messageField} onChange={(e) => setMessageField(e.target.value)} />
        <Button htmlType="submit" onClick={handleSendMessage} disabled={messageField === ''}>Enviar Mensaje de Prueba</Button>
      </form>
    </div>
  );
}

export default ChatComponent;
