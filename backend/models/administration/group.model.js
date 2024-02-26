module.exports = (sequelize, Sequelize) => {
  const Group = sequelize.define("group", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    date: {
      type: Sequelize.STRING
    },
    CourseID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    SchoolID: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
  return Group;
}