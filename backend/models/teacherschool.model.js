module.exports = (sequelize, Sequelize) => {
    const TeacherSchool = sequelize.define("TeacherSchool", {});

    TeacherSchool.associate = (models) => {
        TeacherSchool.belongsTo(models.School);
        TeacherSchool.belongsTo(models.User);
    };

    return TeacherSchool;
};