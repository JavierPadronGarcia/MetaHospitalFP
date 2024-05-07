module.exports = (sequelize, Sequelize) => {
  const TranslationLanguage = sequelize.define("translationLanguage", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    languageShort: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    languageLong: {
      type: Sequelize.STRING,
    },
  })
  return TranslationLanguage;
}