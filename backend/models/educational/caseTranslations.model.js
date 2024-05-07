module.exports = (sequelize, Sequelize) => {
  const Translations = sequelize.define("caseTranslation", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    LanguageID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    CaseID: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  })
  return Translations;
}