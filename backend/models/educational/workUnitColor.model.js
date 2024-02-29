module.exports = (sequelize, Sequelize) => {
  const WorkUnitColor = sequelize.define("workUnitColor", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ColorID: {
      type: Sequelize.INTEGER,
    },
    WorkUnitGroupID: {
      type: Sequelize.INTEGER
    },
    visibility: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })
  return WorkUnitColor;
}