module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("item", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    itemNumber: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
    },
    value: {
      type: Sequelize.FLOAT,
      default: 0
    },
    WorkUnitID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  })
  return Item;
}