'use strict';

const { addPlayerRoles } = require('../utils/seederUtils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const playerRoles = addPlayerRoles(['Assistant', 'Nurse', 'Medic']);
    await queryInterface.bulkInsert('PlayerRoles', playerRoles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PlayerRoles');
  }
};
