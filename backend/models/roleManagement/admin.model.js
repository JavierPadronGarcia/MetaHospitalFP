module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
    },
    age: {
      type: Sequelize.INTEGER
    },
  })
  return Admin;
}