const userController = require('../controllers/user.controller');
const messageController = require('../controllers/messages.controller');

module.exports = webSocketServer => {

  const groupSockets = {};

  const GET_ALL_MESSAGES = 'getAllMessages';
  const CHAT_MESSAGE = 'chatMessage';
  const CONECTED_USERS_COUNT = 'connectedUsersCount';
  const GET_LAST_MESSAGES = 'getLastMessages';
  const SYNC_MESSAGES = 'sync-messages';

  webSocketServer.on('connection', (ws, incoming_request) => {
    const url = new URLSearchParams(incoming_request.url);

    const userId = url.get('userId');
    const groupId = url.get('groupId');

    if (!groupSockets[groupId]) {
      groupSockets[groupId] = [];
    }

    const userRef = { ws, userId, groupId };
    groupSockets[groupId].push(userRef);

    sendConnectedUsersCount(groupId);

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      console.log('---------------------------------------------------------------')
      console.log(parsedMessage)
      console.log('---------------------------------------------------------------')
      if (parsedMessage.type === CHAT_MESSAGE) {
        console.log(parsedMessage);
        userController.getUserById(parsedMessage.userId).then(user => {
          messageController.create(groupId, user.id, user.name, parsedMessage.message).then(response => {

            const message = {
              type: CHAT_MESSAGE,
              GroupID: groupId,
              createdAt: response.createdAt,
              updatedAt: response.updatedAt,
              id: response.id,
              userId: user.id,
              username: user.name,
              message: response.message,
            }

            sendMessage(groupId, JSON.stringify(message));
          }).catch(err => {
            console.log(err);
          });
        });
      }

      if (parsedMessage.type === GET_ALL_MESSAGES) {
        messageController.getAllMessagesInGroup(groupId).then(response => {
          userRef.ws.send(JSON.stringify({ type: GET_ALL_MESSAGES, messages: JSON.stringify(response) }));
        });
      }

      if (parsedMessage.type === GET_LAST_MESSAGES) {
        messageController.getLastMessagesInGroup(groupId, parsedMessage.lastId).then(response => {
          userRef.ws.send(JSON.stringify({ type: GET_LAST_MESSAGES, messages: JSON.stringify(response) }));
        })
      }

      if (parsedMessage.type === SYNC_MESSAGES) {
        messageController.getLastMessagesInGroup(groupId, parsedMessage.lastId).then(response => {
          sendMessage(userRef.groupId, JSON.stringify({ type: GET_LAST_MESSAGES, messages: JSON.stringify(response) }));
        })
      }

    });

    ws.on('close', () => {
      groupSockets[groupId] = groupSockets[groupId].filter(user => user.ws !== ws);
      sendConnectedUsersCount(groupId);
    });
  });

  function sendMessage(groupId, message) {
    if (groupSockets[groupId]) {
      groupSockets[groupId].forEach((user) => {
        user.ws.send(message);
      });
    }
  }

  function sendConnectedUsersCount(groupId) {
    const count = groupSockets[groupId] ? groupSockets[groupId].length : 0;
    const message = JSON.stringify({ type: CONECTED_USERS_COUNT, count });
    sendMessage(groupId, message);
  }
}
