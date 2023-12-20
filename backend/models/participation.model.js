module.exports = (sequelize, Sequelize) => {
  const Participation = sequelize.define("participation", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ExerciseId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  })
  return Participation;
}