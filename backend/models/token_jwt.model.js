module.exports = (Sequelize,sequelize) => {
    const Token_jwt = Sequelize.define('Teacher',{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.STRING,
        },
        token: {
            type: Sequelize.STRING,
        },
        expireDate: {
            type: Sequelize.STRING,
        }
    })
    return Token_jwt
}