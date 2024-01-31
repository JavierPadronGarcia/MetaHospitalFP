module.exports = (sequelize, Sequelize) => {
  const Participation = sequelize.define("participation", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ExerciseID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    StudentID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    FinalGrade: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    SubmittedAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    Role: {
      type: Sequelize.STRING,
      allowNull: true
    }
  })
  return Participation;
}