module.exports = (sequelize, Sequelize) => {
  const StudentSchool = sequelize.define("StudentSchool", {
    StudentID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    SchoolID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    }
  });

  return StudentSchool;
};