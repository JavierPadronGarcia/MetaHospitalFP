module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define("item", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CaseID: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
  })
  return Item;
}