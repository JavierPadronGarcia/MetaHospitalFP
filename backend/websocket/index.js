const userController = require('../controllers/user.controller');

module.exports = webSocketServer => {

  const groupSockets = {};

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

    userController.getUserById(userId).then(user => {
      sendMessage(groupId, JSON.stringify({ type: 'userConnected', user }));
    });

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === 'chatMessage') {
        userController.getUserById(parsedMessage.userId).then(user => {
          sendMessage(groupId, JSON.stringify({ type: 'chatMessage', user: user, message: parsedMessage.message }));
        });
      }
    });

    ws.on('close', () => {
      groupSockets[groupId] = groupSockets[groupId].filter(user => user.ws !== ws);
      sendConnectedUsersCount(groupId);
      userController.getUserById(userId).then(user => {
        sendMessage(groupId, JSON.stringify({ type: 'userDisconnected', user }));
      });
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
    const message = JSON.stringify({ type: 'connectedUsersCount', count });
    sendMessage(groupId, message);
  }
}
