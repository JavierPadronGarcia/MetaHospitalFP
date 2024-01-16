module.exports = (Sequelize, sequelize) => {
    const Role = Sequelize.define('Role', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_name: {
            type: Sequelize.STRING,
        },
        Permissions: {
            type: Sequelize.STRING,
        }
    })

    return Role;
}