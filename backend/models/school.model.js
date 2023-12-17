module.exports = (sequelize, Sequelize) => {
    const School = sequelize.define("School", {
        name: {
            type: Sequelize.STRING
        }
    });

    School.associate = (models) => {
        School.belongsToMany(models.User, { through: models.StudentSchool });
        School.belongsToMany(models.User, { through: models.TeacherSchool });
    };

    return School;
};
