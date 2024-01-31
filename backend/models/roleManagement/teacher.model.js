module.exports = (sequelize, Sequelize) => {
  const Teacher = sequelize.define('Teacher', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    isDirector: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    name: {
      type: Sequelize.STRING,
    },
    age: {
      type: Sequelize.INTEGER
    },
  })
  return Teacher
}