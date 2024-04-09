'use strict';

const {
  addWorkUnits,
  addColors,
  addWorkUnitColors,
  addWorkUnitGroups
} = require("../utils/seederUtils");

function setUpData() {
  const workUnits = addWorkUnits([{ id: 6, name: 'UT6 Cardio' }, { id: 7, name: 'UT7 Neumología' }, { id: 10, name: 'UT10 Neonatología' }]);

  const colors = addColors([
    { primaryColor: '#279EFF', secondaryColor: '#2F96C4', text: '#FFFFFF' },
    { primaryColor: '#279EFF8A', secondaryColor: '#2F96C48A', text: '#000000' },
    { primaryColor: '#E25E3E', secondaryColor: '#D0411E', text: '#FFFFFF' },
    { primaryColor: '#E25E3E8A', secondaryColor: '#D0411E8A', text: '#000000' },
    { primaryColor: '#F4E869', secondaryColor: '#DACC38', text: '#000000' },
    { primaryColor: '#F4E8698A', secondaryColor: '#DACC388A', text: '#000000' },
  ]);

  const workUnitGroups = addWorkUnitGroups([

    { GroupID: 1, WorkUnitID: 10, visibility: 1 },
    { GroupID: 2, WorkUnitID: 10, visibility: 1 },
    { GroupID: 3, WorkUnitID: 10, visibility: 1 },
    { GroupID: 4, WorkUnitID: 10, visibility: 1 },
    { GroupID: 5, WorkUnitID: 10, visibility: 1 },
    { GroupID: 6, WorkUnitID: 10, visibility: 1 },

    { GroupID: 1, WorkUnitID: 6, visibility: 1 },
    { GroupID: 2, WorkUnitID: 6, visibility: 1 },
    { GroupID: 3, WorkUnitID: 6, visibility: 1 },
    { GroupID: 4, WorkUnitID: 6, visibility: 1 },
    { GroupID: 5, WorkUnitID: 6, visibility: 1 },
    { GroupID: 6, WorkUnitID: 6, visibility: 1 },
  ]);

  const workUnitColors = addWorkUnitColors([
    // ut10
    { WorkUnitGroupID: 1, ColorID: 1, visibility: 1 },
    { WorkUnitGroupID: 1, ColorID: 2, visibility: 0 },
    { WorkUnitGroupID: 2, ColorID: 1, visibility: 1 },
    { WorkUnitGroupID: 2, ColorID: 2, visibility: 0 },
    { WorkUnitGroupID: 3, ColorID: 1, visibility: 1 },
    { WorkUnitGroupID: 3, ColorID: 2, visibility: 0 },
    { WorkUnitGroupID: 4, ColorID: 1, visibility: 1 },
    { WorkUnitGroupID: 4, ColorID: 2, visibility: 0 },
    { WorkUnitGroupID: 5, ColorID: 1, visibility: 1 },
    { WorkUnitGroupID: 5, ColorID: 2, visibility: 0 },
    { WorkUnitGroupID: 6, ColorID: 1, visibility: 1 },
    { WorkUnitGroupID: 6, ColorID: 2, visibility: 0 },

    // ut6
    { WorkUnitGroupID: 7, ColorID: 3, visibility: 1 },
    { WorkUnitGroupID: 7, ColorID: 4, visibility: 0 },
    { WorkUnitGroupID: 8, ColorID: 3, visibility: 1 },
    { WorkUnitGroupID: 8, ColorID: 4, visibility: 0 },
    { WorkUnitGroupID: 9, ColorID: 3, visibility: 1 },
    { WorkUnitGroupID: 9, ColorID: 4, visibility: 0 },
    { WorkUnitGroupID: 10, ColorID: 3, visibility: 1 },
    { WorkUnitGroupID: 10, ColorID: 4, visibility: 0 },
    { WorkUnitGroupID: 11, ColorID: 3, visibility: 1 },
    { WorkUnitGroupID: 11, ColorID: 4, visibility: 0 },
    { WorkUnitGroupID: 12, ColorID: 3, visibility: 1 },
    { WorkUnitGroupID: 12, ColorID: 4, visibility: 0 },
  ])

  return {
    workUnits,
    colors,
    workUnitGroups,
    workUnitColors,
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const {
        workUnits,
        colors,
        workUnitColors,
        workUnitGroups
      } = setUpData();

      console.log('\ndata setup completed...\n');

      await Promise.all([
        queryInterface.bulkInsert('workUnits', workUnits),
        queryInterface.bulkInsert('colors', colors),
      ]);

      console.log('first stage completed...\n');

      await Promise.all([
        queryInterface.bulkInsert('workUnitGroups', workUnitGroups),
      ]);

      console.log('second stage completed...\n');

      await Promise.all([
        queryInterface.bulkInsert('workUnitColors', workUnitColors),
      ]);

      console.log('third stage completed...\n');
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await Promise.all([
        queryInterface.bulkDelete('workUnitColors', null, {}),
      ]);

      await Promise.all([
        queryInterface.bulkDelete('workUnitGroups', null, {}),
      ]);

      await Promise.all([
        queryInterface.bulkDelete('workUnits', null, {}),
        queryInterface.bulkDelete('colors', null, {}),
      ]);
    } catch (error) {
      console.error('Error during rollback:', error);
      throw error;
    }
  }
};
