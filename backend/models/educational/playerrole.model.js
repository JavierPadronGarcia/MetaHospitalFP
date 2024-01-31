module.exports = (sequelize, Sequelize) => {
  const PlayerRole = sequelize.define('PlayerRole', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
    }
  })
  return PlayerRole;
}