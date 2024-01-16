module.exports = (Sequelize,sequelize) => {
    const ItemPlayerRole = Sequelize.define('ItemPlayerRole',{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ItemId: {
            type: Sequelize.INTEGER,
        },
        PlayerRoleId: {
            type: Sequelize.INTEGER,
        }
    })
    return ItemPlayerRole;
}