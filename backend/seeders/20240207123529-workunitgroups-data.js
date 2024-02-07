'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('workunits', [
      { id: 1, name: 'UT1 - prueba', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    await queryInterface.bulkInsert('colors', [
      { id: 1, primaryColor: '#279EFF', secondaryColor: '#2F96C4', text: '#FFFFFF', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, primaryColor: '#279EFF8A', secondaryColor: '#2F96C48A', text: '#000000', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, primaryColor: '#E25E3E', secondaryColor: '#D0411E', text: '#FFFFFF', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, primaryColor: '#E25E3E8A', secondaryColor: '#D0411E8A', text: '#000000', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, primaryColor: '#F4E869', secondaryColor: '#DACC38', text: '#000000', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, primaryColor: '#F4E8698A', secondaryColor: '#DACC388A', text: '#000000', createdAt: new Date(), updatedAt: new Date() },
    ])

    await queryInterface.bulkInsert('workunitcolors', [
      { WorkUnitId: 1, ColorId: 1, visibility: 1, createdAt: new Date(), updatedAt: new Date() },
      { WorkUnitId: 1, ColorId: 2, visibility: 0, createdAt: new Date(), updatedAt: new Date() },
    ])

    await queryInterface.bulkInsert('workunitgroups', [
      { GroupID: 1, WorkUnitID: 1, visibility: 0, createdAt: new Date(), updatedAt: new Date() }
    ])

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('workunitcolors', null, {});
    await queryInterface.bulkDelete('workunitgroups', null, {});
    await queryInterface.bulkDelete('workunits', null, {});
    await queryInterface.bulkDelete('colors', null, {});
  }
};
