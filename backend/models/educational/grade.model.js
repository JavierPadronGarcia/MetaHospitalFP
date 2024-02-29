module.exports = (sequelize, Sequelize) => {
  const Grade = sequelize.define("grade", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    correct: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    grade: {
      type: Sequelize.STRING,
      allowNull: false
    },
    ItemID: {
      type: Sequelize.INTEGER,
    },
    ItemPlayerRoleID: {
      type: Sequelize.INTEGER,
    },
    ParticipationID: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
  return Grade;
}