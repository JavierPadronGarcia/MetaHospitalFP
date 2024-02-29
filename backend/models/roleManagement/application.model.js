module.exports = (sequelize, Sequelize) => {
  const Application = sequelize.define('Application', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    app_name: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    }
  })

  return Application;
}