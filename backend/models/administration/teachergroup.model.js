module.exports = (sequelize, Sequelize) => {
  const TeacherGroup = sequelize.define("TeacherGroup", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TeacherID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    GroupID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Date: {
      type: Sequelize.DATE,
      allowNull: false,
    }
  })
  return TeacherGroup;
}