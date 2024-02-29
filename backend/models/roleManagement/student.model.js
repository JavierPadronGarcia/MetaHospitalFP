module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define('Student', {
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
  return Student
}