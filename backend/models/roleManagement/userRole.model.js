module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define('UserRoles', {
    UserID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    AppID: {
      type: Sequelize.INTEGER,
    },
    RoleID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  })

  return UserRole;
}