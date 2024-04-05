'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    const seeder = require('../seeders/20240207152140-dataFromExcel');
    const db = require('../models');
    const Exercise = db.exercise;

    try {
      await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;', { transaction });

      await seeder.down(queryInterface, Sequelize);

      const exercisesData = await Exercise.findAll({
        attributes: ['CaseID'],
        raw: true,
        transaction
      })

      console.log(exercisesData)

      transaction.rollback();

      // await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;', { transaction });
    } catch (err) {

    }

    // await queryInterface.addColumn('items', 'itemNumber', {
    //   type: Sequelize.STRING,
    //   allowNull: false
    // });
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('items', 'itemNumber');
  }
};
