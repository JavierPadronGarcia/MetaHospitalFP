'use strict';

const {
  addExercises,
  addParticipations,
  addGrades,
} = require('../utils/seederUtils');

function setupData() {
  const exercises = addExercises([
    { assigned: 1, CaseID: 3 }
  ]);

  const participations = addParticipations([
    { ExerciseId: 1, StudentID: 7, FinalGrade: 5, Role: 'auxiliar' },
    { ExerciseId: 1, StudentID: 8, FinalGrade: 10, Role: 'enfermero' },
  ]);

  const grades = addGrades([
    {
      allGrades: [
        { correct: 1, grade: '10', ItemID: 1, ItemPlayerRoleID: 1 },
        { correct: 1, grade: '7', ItemID: 2, ItemPlayerRoleID: 2 },
        { correct: 1, grade: '5', ItemID: 3, ItemPlayerRoleID: 3 },
        { correct: 0, grade: '0', ItemID: 4, ItemPlayerRoleID: 4 }
      ],
      participationId: 1
    },
    {
      allGrades: [
        { correct: 1, grade: '8', ItemID: 1, ItemPlayerRoleID: 1 },
        { correct: 1, grade: '9', ItemID: 2, ItemPlayerRoleID: 2 },
        { correct: 1, grade: '10', ItemID: 3, ItemPlayerRoleID: 3 },
        { correct: 1, grade: '5', ItemID: 4, ItemPlayerRoleID: 4 }
      ],
      participationId: 2
    }
  ]);

  return { exercises, participations, grades };
}

module.exports = {
  async up(queryInterface, Sequelize) {

    // const {
    //   exercises,
    //   grades,
    //   participations
    // } = setupData();

    // console.log('\ndata setup completed...\n');

    // await queryInterface.bulkInsert('exercises', exercises);
    // await queryInterface.bulkInsert('participations', participations);
    // await queryInterface.bulkInsert('grades', grades);

    // console.log('\nseeder completed...\n');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('grades', null, {});
    await queryInterface.bulkDelete('participations', null, {});
    await queryInterface.bulkDelete('exercises', null, {});
  }
};