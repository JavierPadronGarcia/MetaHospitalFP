module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.ENUM('admin', 'teacher', 'student', 'director'),
    },
    isDirector: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    codeExpirationDate: {
      type: Sequelize.DATE,
      allowNull: true
    }
  })


  return User;
}