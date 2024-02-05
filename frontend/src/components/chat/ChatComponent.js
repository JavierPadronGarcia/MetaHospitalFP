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

  const ws = useRef();

  useEffect(() => {
    const SERVER_URL = `${webSocketEndpoint}?&groupId=${groupId}&userId=${user.id}`;
    ws.current = new WebSocket(SERVER_URL);

    ws.current.onopen = () => {
      console.log('Connection opened')
    }

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'chatMessage') {
        setChatMessages(prevMessages => [
          ...prevMessages,
          { user: message.user.username, text: message.message }
        ]);
      } else if (message.type === 'connectedUsersCount') {
        setConnectedUsers(parseInt(message.count));
      } else if (message.type === 'userConnected') {
        console.log(`${message.user.username} se ha unido al chat`);
      } else if (message.type === 'userDisconnected') {
        console.log(`${message.user.username} se ha desconectado del chat`);
      }
    }

    return () => {
      console.log("Cleaning up...");
      ws.current.close();
    }
  }, [groupId, user.id]);

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
        <div key={index}>{message.user}: {message.text}</div>
      ))}
      <form onSubmit={(e) => handleSendMessage(e)}>
        <Input placeholder="mensaje..." id="messageField" value={messageField} onChange={(e) => setMessageField(e.target.value)} />
        <Button htmlType="submit" onClick={handleSendMessage} disabled={messageField === ''}>Enviar Mensaje de Prueba</Button>
      </form>
    </div>
  );
}

export default ChatComponent;
