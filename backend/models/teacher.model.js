module.exports = (Sequelize,sequelize) => {
    const Teacher = Sequelize.define('Teacher',{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        }
    })
    return Teacher
}