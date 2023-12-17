module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("Course", {
        name: {
            type: Sequelize.STRING
        },
        acronyms: {
            type: Sequelize.STRING
        }
    });

    Course.associate = (models) => {
        Course.belongsTo(models.Group, { through: 'GroupId' });
    };

    return Course;
};
