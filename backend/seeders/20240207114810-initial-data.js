'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      { id: 1, username: 'test', password: bcrypt.hashSync('test'), name: 'Test' ,role: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, username: 'teacher', password: bcrypt.hashSync('test'), name: 'teacher' ,role: 'teacher', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, username: 'student1', password: bcrypt.hashSync('test'), name: 'student1' ,role: 'student', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, username: 'student2', password: bcrypt.hashSync('test'), name: 'student2' ,role: 'student', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, username: 'student3', password: bcrypt.hashSync('test'), name: 'student3' ,role: 'student', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    await queryInterface.bulkInsert('groups', [
      { id: 1, name: '2ºDAM-T', date:'2023-2024', createdAt: new Date(), updatedAt: new Date() }
    ], {})

    await queryInterface.bulkInsert('groupenrolements', [
      { id: 1, UserID: 3, GroupID: 1, Date: new Date('2024-09-15'), createdAt: new Date(), updatedAt: new Date() },
      { id: 2, UserID: 4, GroupID: 1, Date: new Date('2024-09-15'), createdAt: new Date(), updatedAt: new Date() },
      { id: 3, UserID: 5, GroupID: 1, Date: new Date('2024-09-15'), createdAt: new Date(), updatedAt: new Date() },
    ], {})

    await queryInterface.bulkInsert('teachercourses', [
      { UserID: 2, GroupID: 1, createdAt: new Date(), updatedAt: new Date() },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulickDelete('groupenrolements', null, {});
    await queryInterface.bulkDelete('teachercourses', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('groups', null, {});
  }
};

// npm install -g sequelize-cli
// sequelize seed:generate --name initial-data
// sequelize db:seed:all