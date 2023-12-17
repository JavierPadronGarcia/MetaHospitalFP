module.exports = (sequelize, Sequelize) => {
    const StudentSchool = sequelize.define("StudentSchool", {});

    StudentSchool.associate = (models) => {
        StudentSchool.belongsTo(models.School);
        StudentSchool.belongsTo(models.User);
    };

    return StudentSchool;
};