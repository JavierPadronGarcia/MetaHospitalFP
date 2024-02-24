const db = require("../models");
const Message = db.messages;
const Op = db.Sequelize.Op;

exports.create = (groupId, userId, username, message) => {
  return new Promise((resolve, reject) => {
    if (!groupId || !userId || !message) {
      reject(new Error('content cannot be empty'));
    }
    let msg = {
      GroupID: groupId,
      userID: userId,
      username: username,
      message: message
    };
    Message.create(msg).then((createdMsg) => {
      resolve(createdMsg);
    }).catch((error) => { reject(error) });
  });
}

exports.createMany = (req, res) => {
  const { messages } = req.body;

  messages.forEach(message => {
    if (typeof message.groupId == 'string') {
      message.GroupID = parseInt(message.groupId)
    } else {
      message.GroupID = message.groupId
    }

    message.userID = req.user.id;
    message.username = req.user.name;

  });

  Message.bulkCreate(messages).then(createdMessages => {
    return res.send(createdMessages);
  }).catch(err => {
    return res.status(500).send({
      error: true,
      message: err.message || 'Error creating new messages'
    })
  })

}

exports.getAllMessagesInGroup = (groupId) => {
  return new Promise((resolve, reject) => {
    if (!groupId) {
      reject(new Error('content cannot be empty'));
    }

    Message.findAll({ where: { GroupID: groupId } }).then(messages => {
      resolve(messages);
    }).catch(err => {
      reject(err)
    });
  })
}

exports.getLastMessagesInGroup = (groupId, lastId) => {
  return new Promise((resolve, reject) => {
    if (!groupId || !lastId) {
      reject(new Error('content cannot be empty'));
    }

    Message.findAll({
      where: {
        GroupID: groupId,
        id: {
          [Op.gt]: lastId
        }
      }
    }).then(lastMessages => {
      resolve(lastMessages);
    }).catch(err => {
      reject(err);
    })
  })
}