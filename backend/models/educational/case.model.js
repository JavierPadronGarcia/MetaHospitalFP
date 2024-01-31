module.exports = (sequelize, Sequelize) => {
  const Case = sequelize.define("case", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    WorkUnitID: {
      type: Sequelize.INTEGER,
    },
    caseNumber: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
  })
  return Case;
}