'use strict';

const bcrypt = require('bcryptjs');
const { fakerES } = require('@faker-js/faker');

function replacePunctuationMarks(str) {
  const punctuationWods = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
  };

  return str.replace(/[áéíóúÁÉÍÓÚ]/g, function (wordWithPunctuation) {
    return punctuationWods[wordWithPunctuation];
  });
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const allusers = [];

    allusers.push({ id: 1, username: 'admin', password: bcrypt.hashSync('test'), name: fakerES.person.fullName(), role: 'admin', createdAt: new Date(), updatedAt: new Date() });

    for (let i = 2; i < 7; i++) {
      const firstName = fakerES.person.firstName();
      const lastName = fakerES.person.lastName();
      const username = replacePunctuationMarks((firstName + lastName + '@metahospital.com')).replace(/\s/g, '').toLowerCase();
      allusers.push(
        { id: i, username: username, password: bcrypt.hashSync('test'), name: firstName + " " + lastName, role: 'teacher', createdAt: new Date(), updatedAt: new Date() },
      )
    }

    for (let i = 7; i < 21; i++) {
      const firstName = fakerES.person.firstName();
      const lastName = fakerES.person.lastName();
      const username = replacePunctuationMarks((firstName + lastName + '@metahospital.com')).replace(/\s/g, '').toLowerCase();
      allusers.push(
        { id: i, username: username, password: bcrypt.hashSync('test'), name: firstName + " " + lastName, role: 'student', createdAt: new Date(), updatedAt: new Date() },
      )
    }
    await queryInterface.bulkInsert('users', allusers, {});

    await queryInterface.bulkInsert('courses', [
      { id: 1, name: 'Técnicos Cuidados Auxiliares de Enfermería', acronyms: 'CAE', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Técnicos de emergencias sanitarias', acronyms: 'TES', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Técnicos de Imagen para el Diagnóstico', acronyms: 'IMD', createdAt: new Date(), updatedAt: new Date() },
    ])

    await queryInterface.bulkInsert('groups', [
      { id: 1, name: '1ºCAE', date: '2023-2024', createdAt: new Date(), updatedAt: new Date(), CourseId: 1 },
      { id: 2, name: '2ºCAE', date: '2023-2024', createdAt: new Date(), updatedAt: new Date(), CourseId: 1 },
      { id: 3, name: '1ºTES', date: '2023-2024', createdAt: new Date(), updatedAt: new Date(), CourseId: 2 },
      { id: 4, name: '2ºTES', date: '2023-2024', createdAt: new Date(), updatedAt: new Date(), CourseId: 2 },
      { id: 5, name: '1ºIMD', date: '2023-2024', createdAt: new Date(), updatedAt: new Date(), CourseId: 3 },
      { id: 6, name: '2ºIMD', date: '2023-2024', createdAt: new Date(), updatedAt: new Date(), CourseId: 3 }
    ], {})

    let groupEnrolements = []

    for (let i = 1; i <= 14; i++) {
      groupEnrolements.push(
        { id: 1, UserID: i + 7, GroupID: i % 7, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      );
    }

    await queryInterface.bulkInsert('groupenrolements', [
      { id: 1, UserID: 7, GroupID: 1, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      { id: 2, UserID: 8, GroupID: 1, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      { id: 3, UserID: 9, GroupID: 2, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      { id: 4, UserID: 10, GroupID: 2, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      { id: 5, UserID: 11, GroupID: 3, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      { id: 6, UserID: 12, GroupID: 3, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      { id: 7, UserID: 13, GroupID: 4, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      { id: 8, UserID: 14, GroupID: 4, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      { id: 9, UserID: 15, GroupID: 5, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
      { id: 10, UserID: 16, GroupID: 5, Date: new Date('2023-09-06'), createdAt: new Date(), updatedAt: new Date() },
    ], {})

    await queryInterface.bulkInsert('teachercourses', [
      { UserID: 2, GroupID: 1, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 2, GroupID: 2, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 3, GroupID: 2, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 3, GroupID: 3, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 4, GroupID: 3, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 4, GroupID: 4, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 5, GroupID: 4, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 5, GroupID: 5, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 6, GroupID: 6, createdAt: new Date(), updatedAt: new Date() },
    ])

    await queryInterface.bulkInsert('schools', [
      { id: 1, name: 'IES Los Gladiolos', createdAt: new Date(), updatedAt: new Date() },
    ])

    await queryInterface.bulkInsert('teacherschools', [
      { UserID: 2, SchoolID: 1, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 3, SchoolID: 1, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 4, SchoolID: 1, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 5, SchoolID: 1, createdAt: new Date(), updatedAt: new Date() },
      { UserID: 6, SchoolID: 1, createdAt: new Date(), updatedAt: new Date() },
    ])

    const studentSchools = [];

    for (let i = 7; i < 21; i++) {
      studentSchools.push({ UserID: i, SchoolID: 1, createdAt: new Date(), updatedAt: new Date() },)
    }

    await queryInterface.bulkInsert('studentschools', studentSchools);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulckDelete('groupenrolements', null, {});
    await queryInterface.bulkDelete('teachercourses', null, {});
    await queryInterface.bulkDelete('teacherschools', null, {});
    await queryInterface.bulkDelete('studentschools', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('groups', null, {});
    await queryInterface.bulckDelete('courses', null, {});
    await queryInterface.bulckDelete('schools', null, {});
  }
};

// npm install -g sequelize-cli
// sequelize seed:generate --name initial-data
// sequelize db:seed:all