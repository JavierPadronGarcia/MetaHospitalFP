'use strict';

const { getLanguages } = require('../translations/translationsHandler');
const db = require('../models/index');
const dayjs = require('dayjs');
const TranslationLanguage = db.translationLanguage;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const languages = getLanguages();
    const languageInsertion = [];
    languages.forEach((shortLang, longLang) => {
      languageInsertion.push({
        languageShort: shortLang,
        languageLong: longLang,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
    });

    await queryInterface.bulkInsert(TranslationLanguage.tableName, languageInsertion);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(TranslationLanguage.tableName, null, {});
  }
};