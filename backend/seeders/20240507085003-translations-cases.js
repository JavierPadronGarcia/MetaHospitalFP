'use strict';

const db = require('../models/index');
const dayjs = require('dayjs')
const { getTranslations, getLanguages } = require('../translations/translationsHandler');
const CaseTranslation = db.caseTranslation;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const WorkUnit = db.workUnit;
      const TranslationLanguage = db.translationLanguage;
      const Case = db.case;
      const translationsToInsert = [];

      const languagesMap = getLanguages();

      const [translationLanguages, workUnits] = await Promise.all([
        TranslationLanguage.findAll({ raw: true }),
        WorkUnit.findAll({ raw: true })
      ]);

      for (const { id } of workUnits) {

        const { translations } = getTranslations(id, "Ejercicios");
        const cases = await Case.findAll({
          attributes: ['id', 'caseNumber'],
          where: { WorkUnitID: id }
        });

        for (const itemTranslations of translations) {

          const key = itemTranslations.Keys;

          const foundItem = cases.find(({ caseNumber }) => caseNumber === Number(key) + 1);

          if (foundItem != null) {
            languagesMap.forEach((languageValue, tKey) => {
              const languageText = itemTranslations[tKey];
              const LanguageID = translationLanguages.find(({ languageShort }) => languageShort == languageValue).id;
              const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
              translationsToInsert.push({
                LanguageID,
                CaseID: foundItem.id,
                name: languageText,
                createdAt: date,
                updatedAt: date,
              });
            });
          }
        }
      }

      await queryInterface.bulkInsert(CaseTranslation.tableName, translationsToInsert);
    } catch (err) {
      console.log(err)
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(CaseTranslation.tableName, null, {});
  }
};
