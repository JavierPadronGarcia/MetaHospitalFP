'use strict';

const {
  addExercises,
  addParticipations,
  addPlayerRoles,
  addItems,
  addGrades,
  addItemPlayerRoles,
} = require('../utils/seederUtils');

function setupData() {
  const exercises = addExercises([
    { assigned: 1, CaseID: 3 }
  ]);
  const participations = addParticipations([
    { ExerciseId: 1, StudentID: 7, FinalGrade: 5, Role: 'auxiliar' },
    { ExerciseId: 1, StudentID: 8, FinalGrade: 10, Role: 'enfermero' },
  ]);
  const items = addItems([
    {
      items: [
        'Revisar que el cubículo o puesto tiene todo el material necesario',
        'Poner agua destilada en el depósito para el suministro de humedad de la incubadora y programarla según el peso del neonato.',
        'Conectar la incubadora a la toma de oxígeno en caso necesario',
        'Encender incubadora',
        'Lavado de manos'
      ],
      CaseId: 3,
    },
  ]);

  const playerRoles = addPlayerRoles(['Auxiliar', 'Enfermero', 'Médico']);

  const itemPlayerRoles = addItemPlayerRoles([
    {
      playerRoles: [1],
      ItemID: 1
    },
    {
      playerRoles: [1],
      ItemID: 2
    },
    {
      playerRoles: [1],
      ItemID: 3
    },
    {
      playerRoles: [1],
      ItemID: 4
    },
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

  return { exercises, participations, items, grades, playerRoles, itemPlayerRoles };
}

module.exports = {
  async up(queryInterface, Sequelize) {

    const {
      exercises,
      grades,
      items,
      participations,
      playerRoles,
      itemPlayerRoles,
    } = setupData();

    console.log('\ndata setup completed...\n');

    await Promise.all([
      queryInterface.bulkInsert('exercises', exercises),
      queryInterface.bulkInsert('items', items),
      queryInterface.bulkInsert('PlayerRoles', playerRoles),
    ]);

    console.log('first stage completed...\n');

    await Promise.all([
      queryInterface.bulkInsert('participations', participations),
      queryInterface.bulkInsert('ItemPlayerRoles', itemPlayerRoles),
    ]);

    console.log('second stage completed...\n');

    await queryInterface.bulkInsert('grades', grades);

    console.log('third stage completed...\n');
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('grades', null, {});

    await Promise.all([
      queryInterface.bulkDelete('participations', null, {}),
      queryInterface.bulkDelete('ItemPlayerRoles', null, {}),
    ]);

    await Promise.all([
      queryInterface.bulkDelete('items', null, {}),
      queryInterface.bulkDelete('exercises', null, {}),
      queryInterface.bulkDelete('PlayerRoles', null, {}),
    ]);
  }
};