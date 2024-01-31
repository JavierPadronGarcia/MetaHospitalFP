module.exports = (sequelize, Sequelize) => {
  const StudentGroup = sequelize.define("StudentGroup", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    StudentID: {
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
  return StudentGroup;
}