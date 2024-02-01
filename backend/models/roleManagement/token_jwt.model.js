module.exports = (sequelize, Sequelize) => {
  const Token_jwt = sequelize.define('Token_jwt', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserID: {
      type: Sequelize.INTEGER,
    },
    token: {
      type: Sequelize.TEXT,
    },
    expireDate: {
      type: Sequelize.DATE,
    }
  })
  return Token_jwt
}