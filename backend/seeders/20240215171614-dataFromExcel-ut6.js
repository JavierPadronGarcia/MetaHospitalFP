'use strict';

const db = require('../models');
const Item = db.item;
const Case = db.case;
const WorkUnit = db.workUnit;
const Role = db.role;
const Op = db.Sequelize.Op;

const {
  addCases,
  addItems,
  addItemNumberCaseNumbers,
  addItemPlayerRolesNumbers,
  addItemPlayerRoles,
} = require("../utils/seederUtils");

function setupData() {
  const cases = [...addCases(6)];
  const items = [...addItems(6)];
  const itemPlayerRoles = addItemPlayerRoles();
  return { cases, items, itemPlayerRoles };
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

async function getItemsByWorkUnit() {
  const itemsByWorkUnit = await WorkUnit.findAll({
    include: [
      { model: Item, required: true }
    ]
  })
  return itemsByWorkUnit.map(result => result.get({ plain: true }));
}

async function getRoles() {
  const roles = await Role.findAll();
  return roles.map(result => result.get({ plain: true }));
}

async function buildItemCases() {
  const itemCases = [];

  const itemNumberCaseNumbers = [
    { workUnit: 6, content: addItemNumberCaseNumbers(6) },
  ];

  const itemsAndCasesByWorkUnit = await getCasesAndItemsByWorkUnit();

  itemNumberCaseNumbers.forEach(data => {
    const itemAndCasesFound = itemsAndCasesByWorkUnit.find(element => element.id === data.workUnit);
    const itemCasesNumbers = data.content;

    if (itemAndCasesFound) {
      itemCasesNumbers.forEach(({ caseNumber, itemNumber }) => {
        const itemFound = itemAndCasesFound.items.find(itemToFind => itemNumber === itemToFind.itemNumber);
        const caseFound = itemAndCasesFound.cases.find(caseToFind => caseNumber === caseToFind.caseNumber);
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

async function buildItemPlayerRoles() {
  const itemPlayerRoles = [];
  const itemPlayerRolesNumbers = [
    { workUnit: 6, content: addItemPlayerRolesNumbers(6) }
  ]

  const itemsByWorkUnit = await getItemsByWorkUnit();
  const allRoles = await getRoles();

  itemPlayerRolesNumbers.forEach(data => {
    const itemsFound = itemsByWorkUnit.find(element => element.id === data.workUnit);
    const itemRolesNumbers = data.content;

    if (itemsFound) {
      itemRolesNumbers.forEach(({ itemNumber, roleNumber }) => {
        const itemFound = itemsFound.items.find(itemToFind => itemNumber === itemToFind.itemNumber);
        const roleFound = allRoles.find(role => role.id === roleNumber);

        if (itemFound && roleFound) {
          itemPlayerRoles.push({
            ItemID: itemFound.id,
            PlayerRoleID: roleFound.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      })
    }
  })
  return itemPlayerRoles;
}

module.exports = {
  async up(queryInterface, Sequelize) {

    const {
      cases,
      items,
    } = setupData();

    console.log('\ndata setup completed...\n');

    await Promise.all([
      queryInterface.bulkInsert('items', items),
      queryInterface.bulkInsert('cases', cases),
    ]);

    console.log('first stage completed...\n');

    const itemCases = await buildItemCases();
    const itemPlayerRoles = await buildItemPlayerRoles();

    // await queryInterface.bulkInsert('itemCases', itemCases);


    await Promise.all([
      queryInterface.bulkInsert('itemCases', itemCases),
      queryInterface.bulkInsert('ItemPlayerRoles', itemPlayerRoles)
    ]);

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
