'use strict';

const FIELD_NAME = 'assigned';
const TABLE_NAME = 'exercises';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(TABLE_NAME, FIELD_NAME);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      TABLE_NAME,
      FIELD_NAME,
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
  }
};
