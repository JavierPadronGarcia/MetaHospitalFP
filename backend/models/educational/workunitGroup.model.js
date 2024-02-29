module.exports = (sequelize, Sequelize) => {
  const WorkUnitGroup = sequelize.define("workUnitGroup", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    GroupID: {
      type: Sequelize.INTEGER
    },
    WorkUnitID: {
      type: Sequelize.INTEGER
    },
    visibility: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })
  return WorkUnitGroup;
}