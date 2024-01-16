module.exports = (Sequelize, sequelize) => {
    const Application = sequelize.define('Aplication', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        app_name: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.STRING,
        }
    })

    return Application;
}