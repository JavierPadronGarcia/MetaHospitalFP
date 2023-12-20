module.exports = (sequelize, Sequelize) => {
  const Participation = sequelize.define("participation", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ExerciseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    UserId: {
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