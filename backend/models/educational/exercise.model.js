module.exports = (sequelize, Sequelize) => {
  const Exercise = sequelize.define("exercise", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    finishDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    CaseID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    WorkUnitGroupID: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  })
  return Exercise;
}