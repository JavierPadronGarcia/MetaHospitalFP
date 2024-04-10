
'use strict';
const {
  addWorkUnits,
  addColors,
  addWorkUnitColors,
  addWorkUnitGroups
} = require("../utils/seederUtils");

function setUpData() {

  const workUnitGroups = addWorkUnitGroups([
    { GroupID: 1, WorkUnitID: 7, visibility: 1 },
    { GroupID: 2, WorkUnitID: 7, visibility: 1 },
    { GroupID: 3, WorkUnitID: 7, visibility: 1 },
    { GroupID: 4, WorkUnitID: 7, visibility: 1 },
    { GroupID: 5, WorkUnitID: 7, visibility: 1 },
    { GroupID: 6, WorkUnitID: 7, visibility: 1 },
  ]);

  const workUnitColors = addWorkUnitColors([
    { WorkUnitGroupID: 13, ColorID: 5, visibility: 1 },
    { WorkUnitGroupID: 13, ColorID: 6, visibility: 0 },
    { WorkUnitGroupID: 14, ColorID: 5, visibility: 1 },
    { WorkUnitGroupID: 14, ColorID: 6, visibility: 0 },
    { WorkUnitGroupID: 15, ColorID: 5, visibility: 1 },
    { WorkUnitGroupID: 15, ColorID: 6, visibility: 0 },
    { WorkUnitGroupID: 16, ColorID: 5, visibility: 1 },
    { WorkUnitGroupID: 16, ColorID: 6, visibility: 0 },
    { WorkUnitGroupID: 17, ColorID: 5, visibility: 1 },
    { WorkUnitGroupID: 17, ColorID: 6, visibility: 0 },
    { WorkUnitGroupID: 18, ColorID: 5, visibility: 1 },
    { WorkUnitGroupID: 18, ColorID: 6, visibility: 0 },
  ])

  return {
    workUnitGroups,
    workUnitColors,
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const {
        workUnitColors,
        workUnitGroups
      } = setUpData();

      console.log('first stage completed...\n');

      await queryInterface.bulkInsert('workUnitGroups', workUnitGroups);

      console.log('second stage completed...\n');

      await queryInterface.bulkInsert('workUnitColors', workUnitColors);

      console.log('third stage completed...\n');

    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
  }
};

