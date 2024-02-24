'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('cases', [
      { id: 1, WorkUnitId: 3, name: 'Valoración inicial de un neonato de bajo peso y ubicación en incubadora', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, WorkUnitId: 3, name: 'Valoración inicial de un neonato con peso normal y ubicación en cuna', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, WorkUnitId: 3, name: 'Valoración inicial de un neonato prematuro y ubicación en incubadora', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, WorkUnitId: 3, name: 'Valoración inicial de un neonato con sobrepeso y ubicación en cuna', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cases', null, {});
  }
};
