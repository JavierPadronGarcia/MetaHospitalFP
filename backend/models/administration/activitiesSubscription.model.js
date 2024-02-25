module.exports = (sequelize, Sequelize) => {
  const ActivitySubscription = sequelize.define('ActivitySubscription', {
    endpoint: {
      type: Sequelize.TEXT
    },
    expirationTime: {
      type: Sequelize.INTEGER
    },
    keys: {
      type: Sequelize.STRING
    },
    subscriptionName: {
      type: Sequelize.STRING
    },
    UserID: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
  return ActivitySubscription;
}