module.exports = (sequelize, Sequelize) => {
  const Messages = sequelize.define('Messages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    GroupID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userID: {
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING
    },
    message: {
      type: Sequelize.STRING,
    }
  })

  return Messages;
}