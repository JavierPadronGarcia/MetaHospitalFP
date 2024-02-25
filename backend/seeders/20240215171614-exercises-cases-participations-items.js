'use strict';

const {
  addExercises,
  addParticipations,
  addItems,
  addGrades
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
        'Encender incubadora'
      ],
      CaseId: 3,
    },
  ]);

  const grades = addGrades([
    {
      allGrades: [
        { correct: 1, grade: '10', itemId: 1 },
        { correct: 1, grade: '7', itemId: 2 },
        { correct: 1, grade: '5', itemId: 3 },
        { correct: 0, grade: '0', itemId: 4 }
      ],
      participationId: 1
    },
    {
      allGrades: [
        { correct: 1, grade: '8', itemId: 1 },
        { correct: 1, grade: '9', itemId: 2 },
        { correct: 1, grade: '10', itemId: 3 },
        { correct: 1, grade: '5', itemId: 4 }
      ],
      participationId: 2
    }
  ]);

  return { exercises, participations, items, grades };
}

module.exports = {
  async up(queryInterface, Sequelize) {

    const { exercises, grades, items, participations } = setupData();

    console.log('\ndata setup completed...\n');

    await Promise.all([
      queryInterface.bulkInsert('exercises', exercises),
      queryInterface.bulkInsert('items', items),
    ]);

    console.log('first stage completed...\n');

    await queryInterface.bulkInsert('participations', participations);

    console.log('second stage completed...\n');

    await queryInterface.bulkInsert('grades', grades);

    console.log('third stage completed...\n');
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('grades', null, {});
    await queryInterface.bulkDelete('participations', null, {});

    await Promise.all([
      queryInterface.bulkDelete('items', null, {}),
      queryInterface.bulkDelete('exercises', null, {}),
    ]);
  }
};