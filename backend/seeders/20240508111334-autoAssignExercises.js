'use strict';

const dayjs = require('dayjs');
const db = require('../models');
const Exercise = db.exercise;
const WorkUnitGroup = db.workUnitGroup;
const Case = db.case;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let workUnit;
    const exercisesArray = [];
    const transaction = await db.sequelize.transaction();
    const creationDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    try {
      const workUnitGroups = await WorkUnitGroup.findAll({ transaction });
      const parsedWorkUnitGroups = workUnitGroups.map((workUnitGroup) => workUnitGroup.get({ plain: true }));

      for (const workUnitGroup of parsedWorkUnitGroups) {

        if (!workUnit || workUnitGroup.WorkUnitID !== workUnit)
          workUnit = workUnitGroup.WorkUnitID;

        const casesInWorkUnit = await Case.findAll({
          where: {
            WorkUnitID: workUnit,
          },
          raw: true,
          transaction
        });

        casesInWorkUnit.forEach((caseItem) => {
          exercisesArray.push({
            finishDate: null,
            CaseID: caseItem.id,
            WorkUnitGroupID: workUnitGroup.id,
            createdAt: creationDate,
            updatedAt: creationDate
          });
        });

      }

      await queryInterface.bulkInsert(Exercise.tableName, exercisesArray, { transaction });
      await transaction.commit();
    } catch (error) {
      console.log(error.message);
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await db.sequelize.transaction();
    try {
      await queryInterface.bulkDelete(Exercise.tableName, null, { transaction });
      await transaction.commit();
    } catch (error) {
      console.log(error.message);
      await transaction.rollback();
    }
  }
};
