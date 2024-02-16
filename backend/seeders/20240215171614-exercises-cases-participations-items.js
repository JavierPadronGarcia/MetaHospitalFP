'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('exercises', [
      { id: 1, assigned: 1, finishDate: new Date(), CaseID: 1, createdAt: new Date(), updatedAt: new Date() }
    ]);

    await queryInterface.bulkInsert('participations', [
      { id: 1, ExerciseId: 1, UserId: 7, FinalGrade: 5, SubmittedAt: new Date(), Role: 'auxiliar', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, ExerciseId: 1, UserId: 8, FinalGrade: 10, SubmittedAt: new Date(), Role: 'enfermero', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    await queryInterface.bulkInsert('items', [
      { id: 1, CaseId: 1, name: 'Revisar que el cubículo o puesto tiene todo el material necesario', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, CaseId: 1, name: 'Poner agua destilada en el depósito para el suministro de humedad de la incubadora y programarla según el peso del neonato.', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, CaseId: 1, name: 'Conectarla incubadora a la toma de oxígeno en caso necesario', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, CaseId: 1, name: 'Encender incubadora', createdAt: new Date(), updatedAt: new Date() },
    ])

    await queryInterface.bulkInsert('grades', [
      { id: 1, correct: 1, grade: '10', ItemID: 1, ParticipationID: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, correct: 1, grade: '7', ItemID: 2, ParticipationID: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, correct: 1, grade: '5', ItemID: 3, ParticipationID: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, correct: 0, grade: '0', ItemID: 4, ParticipationID: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, correct: 1, grade: '8', ItemID: 1, ParticipationID: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, correct: 1, grade: '9', ItemID: 2, ParticipationID: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, correct: 1, grade: '10', ItemID: 3, ParticipationID: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, correct: 1, grade: '5', ItemID: 4, ParticipationID: 2, createdAt: new Date(), updatedAt: new Date() },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('grades', null, {});
    await queryInterface.bulkDelete('items', null, {});
    await queryInterface.bulkDelete('participations', null, {});
    await queryInterface.bulkDelete('exercises', null, {});
  }
};