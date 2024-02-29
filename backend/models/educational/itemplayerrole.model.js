module.exports = (sequelize, Sequelize) => {
  const ItemPlayerRole = sequelize.define('ItemPlayerRole', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ItemID: {
      type: Sequelize.INTEGER,
    },
    PlayerRoleID: {
      type: Sequelize.INTEGER,
    }
  })
  return ItemPlayerRole;
}