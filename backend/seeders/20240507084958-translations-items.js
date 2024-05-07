'use strict';

const db = require('../models/index');
const dayjs = require('dayjs')
const { getTranslations, getLanguages } = require('../translations/translationsHandler');
const ItemTranslation = db.itemTranslation;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const WorkUnit = db.workUnit;
      const TranslationLanguage = db.translationLanguage;
      const Item = db.item;
      const translationsToInsert = [];

      const languagesMap = getLanguages();

      const [translationLanguages, workUnits] = await Promise.all([
        TranslationLanguage.findAll({ raw: true }),
        WorkUnit.findAll({ raw: true })
      ]);

      for (const { id } of workUnits) {

        const { translations } = getTranslations(id, "Interacciones");
        const items = await Item.findAll({
          attributes: ['id', 'itemNumber'],
          where: { WorkUnitID: id }
        });

        for (const itemTranslations of translations) {

          const key = itemTranslations.Keys.replace('int', '');

          const foundItem = items.find(({ itemNumber }) => itemNumber === Number(key) + 1);
          if (foundItem != null) {
            languagesMap.forEach((languageValue, tKey) => {
              const languageText = itemTranslations[tKey];
              const LanguageID = translationLanguages.find(({ languageShort }) => languageShort == languageValue).id;
              const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
              translationsToInsert.push({
                LanguageID,
                ItemID: foundItem.id,
                name: languageText,
                createdAt: date,
                updatedAt: date,
              });
            });
          }
        }
      }

      await queryInterface.bulkInsert(ItemTranslation.tableName, translationsToInsert);
    } catch (err) {
      console.log(err.message)
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(ItemTranslation.tableName, null, {});
  }
};
