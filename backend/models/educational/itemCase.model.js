module.exports = (sequelize, Sequelize) => {
  const ItemCase = sequelize.define("itemCase", {
    CaseID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    ItemID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  })
  return ItemCase;
}