'use strict';

const {
  addCases,
  addItems,
  addItemCases,
  addPlayerRoles,
  addItemPlayerRoles
} = require("../utils/seederUtils");

function setupData() {
  const cases = addCases(10);
  const items = addItems();
  const itemCases = addItemCases();
  const playerRoles = addPlayerRoles(['Auxiliar', 'Enfermero', 'Médico']);
  const itemPlayerRoles = addItemPlayerRoles();
  return { cases, items, itemCases, playerRoles, itemPlayerRoles };
}

module.exports = {
  async up(queryInterface, Sequelize) {

    const {
      cases,
      items,
      itemCases,
      playerRoles,
      itemPlayerRoles
    } = setupData();

    console.log('\ndata setup completed...\n');

    await queryInterface.bulkInsert('items', items)
    await queryInterface.bulkInsert('cases', cases)
    await queryInterface.bulkInsert('PlayerRoles', playerRoles)

    console.log('first stage completed...\n');

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
