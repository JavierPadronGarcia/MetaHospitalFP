'use strict';

const db = require('../models');
const Item = db.item;
const Case = db.case;
const WorkUnit = db.workUnit;
const Op = db.Sequelize.Op;

const {
  addCases,
  addItems,
  addItemNumberCaseNumbers,
  addPlayerRoles,
  addItemPlayerRoles,
} = require("../utils/seederUtils");

function setupData() {
  const cases = [...addCases(10), ...addCases(6)];
  const items = [...addItems(10), ...addItems(6)];
  const playerRoles = addPlayerRoles(['Auxiliar', 'Enfermero', 'Médico']);
  const itemPlayerRoles = addItemPlayerRoles();
  return { cases, items, playerRoles, itemPlayerRoles };
}

async function getCasesAndItemsByWorkUnit() {
  const casesAndItemsByWorkUnit = await WorkUnit.findAll({
    include: [
      { model: Case, required: true },
      { model: Item, required: true }
    ]
  });
  return casesAndItemsByWorkUnit.map(result => result.get({ plain: true }));
}

async function buildItemCases() {
  const itemCases = [];

  const itemNumberCaseNumbers = [
    { workUnit: 10, content: addItemNumberCaseNumbers(10) },
    { workUnit: 6, content: addItemNumberCaseNumbers(6) }
  ];

  const itemsAndCasesByWorkUnit = await getCasesAndItemsByWorkUnit();
  let testDAta = [];

  itemNumberCaseNumbers.forEach(data => {
    const itemAndCasesFound = itemsAndCasesByWorkUnit.find(element => element.id === data.workUnit);
    const itemCasesNumbers = data.content;

    if (itemAndCasesFound) {
      itemCasesNumbers.forEach(({ caseNumber, itemNumber }) => {
        const itemFound = itemAndCasesFound.items.find(itemToFind => itemNumber === itemToFind.itemNumber);
        const caseFound = itemAndCasesFound.cases.find(caseToFind => caseNumber === caseToFind.caseNumber);
        testDAta.push({ itemFound, caseFound });
        if (itemFound && caseFound) {
          itemCases.push({
            ItemID: itemFound.id,
            CaseID: caseFound.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      })
    }
  });
  return itemCases;
}

module.exports = {
  async up(queryInterface, Sequelize) {

    const {
      cases,
      items,
      playerRoles,
      itemPlayerRoles
    } = setupData();

    console.log('\ndata setup completed...\n');
    
    await Promise.all([
      queryInterface.bulkInsert('items', items),
      queryInterface.bulkInsert('cases', cases),
      queryInterface.bulkInsert('PlayerRoles', playerRoles),
    ]);

    console.log('first stage completed...\n');

    const itemCases = await buildItemCases();
    await queryInterface.bulkInsert('itemCases', itemCases)

    // await Promise.all([
    //   queryInterface.bulkInsert('itemCases', itemCases),
    //   queryInterface.bulkInsert('ItemPlayerRoles', itemPlayerRoles)
    // ]);

    console.log('migration completed...\n');

  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.bulkDelete('itemCases'),
      queryInterface.bulkDelete('ItemPlayerRoles'),
    ]);

    await Promise.all([
      queryInterface.bulkDelete('items'),
      queryInterface.bulkDelete('cases'),
      queryInterface.bulkDelete('PlayerRoles'),
    ]);
  }
};
