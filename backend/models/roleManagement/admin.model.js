module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    age: {
      type: Sequelize.INTEGER
    },
    SchoolID: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  })
  return Admin;
}