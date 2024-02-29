module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('Roles', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    }
  })

  return Role;
}