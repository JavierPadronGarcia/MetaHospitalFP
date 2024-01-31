module.exports = (sequelize, Sequelize) => {
  const UserAccounts = sequelize.define('UserAccounts', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING
    },
    code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    codeExpirationDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  })

  return UserAccounts;
}