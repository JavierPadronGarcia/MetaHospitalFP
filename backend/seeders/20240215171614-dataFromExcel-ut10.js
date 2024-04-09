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
// , ...addCases(6) , ...addItems(6)
function setupData() {
  const cases = [...addCases(10)];
  const items = [...addItems(10)];
  return { cases, items };
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
// { workUnit: 6, content: addItemNumberCaseNumbers(6) }
async function getRoles() {
  const roles = await Role.findAll();
  return roles.map(result => result.get({ plain: true }));
}

async function buildItemCases() {
  const itemCases = [];

  const itemNumberCaseNumbers = [
    { workUnit: 10, content: addItemNumberCaseNumbers(10) },
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
    { workUnit: 10, content: addItemPlayerRolesNumbers(10) }
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
    const workUnitIdToDelete = 10;

    const transaction = await queryInterface.sequelize.transaction();

    try {
      await Promise.all([
        queryInterface.bulkDelete('ItemPlayerRoles', {
          ItemID: {
            [Sequelize.Op.in]: Sequelize.literal(`(SELECT id FROM items WHERE WorkUnitID = ${workUnitIdToDelete})`)
          }
        }, { transaction }),
        queryInterface.bulkDelete('itemCases', {
          ItemID: {
            [Sequelize.Op.in]: Sequelize.literal(`(SELECT id FROM items WHERE WorkUnitID = ${workUnitIdToDelete})`)
          }
        }, { transaction })
      ]);

      await Promise.all([
        queryInterface.bulkDelete('items', { WorkUnitID: workUnitIdToDelete }, { transaction }),
        queryInterface.bulkDelete('cases', { WorkUnitID: workUnitIdToDelete }, { transaction }),
      ]);

      await transaction.commit();
      console.log("Revert successfull");
    } catch (error) {
      await transaction.rollback();
      console.error("Rollback error:", error);
    }
  }
};
