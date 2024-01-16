module.exports = (Sequelize,sequelize) => {
    const Student = Sequelize.define('Student',{
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
    return Student
}