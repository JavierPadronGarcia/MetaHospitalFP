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
      type: Sequelize.STRING,
    },
    expireDate: {
      type: Sequelize.STRING,
    }
  })
  return Token_jwt
}