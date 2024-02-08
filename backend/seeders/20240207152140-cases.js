'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('cases', [
      { id: 1, WorkUnitId: 1, name: 'Caso numero 1', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, WorkUnitId: 1, name: 'Caso numero 2', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, WorkUnitId: 1, name: 'Caso numero 3', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, WorkUnitId: 1, name: 'Caso numero 4', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cases', null, {});
  }
};
