'use strict';

const CONSTRAINT_NAME = 'exercises_ibfk_2';
const FIELD_NAME = 'WorkUnitGroupID';
const TABLE_NAME = 'exercises';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        TABLE_NAME,
        FIELD_NAME,
        {
          type: Sequelize.INTEGER,
        },
        { transaction }
      );

      await queryInterface.addConstraint(
        TABLE_NAME,
        {
          fields: [FIELD_NAME],
          name: CONSTRAINT_NAME,
          type: 'foreign key',
          references: {
            table: 'workUnitGroups',
            field: 'id'
          },
          onUpdate: 'cascade'
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(TABLE_NAME, CONSTRAINT_NAME, { transaction });
      await queryInterface.removeColumn(TABLE_NAME, FIELD_NAME, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }

  }
};
