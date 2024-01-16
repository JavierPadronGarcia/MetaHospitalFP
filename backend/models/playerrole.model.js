module.exports=(Sequelize,sequelize) => {
    const PlayerRole = Sequelize.define('PlayerRole',{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        }
    })
    return PlayerRole;
}