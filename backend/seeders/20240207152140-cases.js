'use strict';

const { addCases } = require("../utils/seederUtils");

function setupData() {
  const cases = addCases([
    {
      cases: [
        'Valoración inicial de un neonato de bajo peso y ubicación en incubadora',
      ],
      workUnitID: 1
    }, {
      cases: [
        'Valoración inicial de un neonato con peso normal y ubicación en cuna',
      ],
      workUnitID: 2
    }, {
      cases: [
        'Valoración inicial de un neonato prematuro y ubicación en incubadora',
        'Valoración inicial de un neonato con sobrepeso y ubicación en cuna'
      ],
      workUnitID: 3
    },
  ]);

  return { cases };
}

module.exports = {
  async up(queryInterface, Sequelize) {

    const { cases } = setupData();

    console.log('\ndata setup completed...\n');

    await queryInterface.bulkInsert('cases', cases);

    console.log('first stage completed...\n');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cases', null, {});
  }
};
