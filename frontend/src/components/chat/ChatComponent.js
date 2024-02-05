import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { decodeToken } from '../../utils/shared/globalFunctions';
import { webSocketEndpoint } from "../../consts/backendEndpoints";
import { Button, Input } from "antd";

function ChatComponent() {
  const params = useParams();
  const groupId = params.groupId;
  const user = decodeToken();
  const [chatMessages, setChatMessages] = useState([]);
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
        // setChatMessages(messages);
      } else {
        getAllMessages();
      }

      console.log('Connection opened');
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
      console.log("Cleaning up...");
      ws.current.close();
    }
  }, [groupId, user.id]);

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

    ws.current.send(JSON.stringify(message));
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
        <div key={index}>{message.username}: {message.message}</div>
      ))}
      <form onSubmit={(e) => handleSendMessage(e)}>
        <Input placeholder="mensaje..." id="messageField" value={messageField} onChange={(e) => setMessageField(e.target.value)} />
        <Button htmlType="submit" onClick={handleSendMessage} disabled={messageField === ''}>Enviar Mensaje de Prueba</Button>
      </form>
    </div>
  );
}

export default ChatComponent;
