module.exports = (sequelize, Sequelize) => {
  const TeacherSchool = sequelize.define("TeacherSchool", {
    TeacherID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    SchoolID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    }
  });

  return TeacherSchool;
};