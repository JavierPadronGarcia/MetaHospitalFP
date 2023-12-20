module.exports = (Sequelize, sequelize) => {
    const User_role = Sequelize.define('User_role', {
        UserId: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        AppId: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        RolId: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        StartDate: {
            type: Sequelize.DATE,
        },
        ExpireDate: {
            type: Sequelize.DATE,
        }
    })
    return User_role;
}