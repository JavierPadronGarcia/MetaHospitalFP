'use strict';

const tableName = 'Token_jwts';
const CONSTRAINT_NAME = 'Token_jwts_ibfk_1';

async function getForeignKeys(queryInterface) {
  const foreignKeys = await queryInterface.getForeignKeyReferencesForTable(tableName);
  const foreignKeyInfo = foreignKeys.find(fk => fk.columnName === 'UserID');

  return foreignKeyInfo;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const foreignKeyInfo = await getForeignKeys(queryInterface);

    if (foreignKeyInfo) {
      await queryInterface.removeConstraint(tableName, CONSTRAINT_NAME);

      await queryInterface.addConstraint(tableName, {
        fields: [foreignKeyInfo.columnName],
        type: 'foreign key',
        name: CONSTRAINT_NAME,
        references: {
          table: foreignKeyInfo.referencedTableName,
          field: foreignKeyInfo.referencedColumnName
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', //add cascade to the constraint
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const foreignKeyInfo = await getForeignKeys(queryInterface);
    if (foreignKeyInfo) {
      await queryInterface.removeConstraint(tableName, CONSTRAINT_NAME);

      await queryInterface.addConstraint(tableName, {
        fields: [foreignKeyInfo.columnName],
        type: 'foreign key',
        name: CONSTRAINT_NAME,
        references: {
          table: foreignKeyInfo.referencedTableName,
          field: foreignKeyInfo.referencedColumnName
        },
        onUpdate: 'CASCADE',
        // onDelete reverted
      });
    }
  }
};
