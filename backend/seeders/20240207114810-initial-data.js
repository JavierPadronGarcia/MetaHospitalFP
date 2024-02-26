'use strict';

const bcrypt = require('bcryptjs');
const { fakerES } = require('@faker-js/faker');

const {
  addRoles,
  addGroups,
  addSchools,
  addCourses,
  addUserRoles,
  addApplications,
  addStudentGroups,
  addTeacherGroups,
  replacePunctuationMarks,
  getUserAccountsAndUserForRoles,
  addTeacherSchools,
  addStudentSchools,
} = require('../utils/seederUtils');


function setAllUsers() {
  const allUsers = [];
  allUsers.push({ id: 1, username: 'admin', password: bcrypt.hashSync('test'), name: fakerES.person.fullName(), role: 'admin', createdAt: new Date(), updatedAt: new Date() });

  for (let i = 2; i < 7; i++) {
    const firstName = fakerES.person.firstName();
    const lastName = fakerES.person.lastName();
    const username = replacePunctuationMarks((firstName + lastName + '@metahospital.com')).replace(/\s/g, '').toLowerCase();
    allUsers.push(
      { id: i, username: username, password: bcrypt.hashSync('test'), name: firstName + " " + lastName, role: 'teacher', createdAt: new Date(), updatedAt: new Date() },
    )
  }

  for (let i = 7; i < 21; i++) {
    const firstName = fakerES.person.firstName();
    const lastName = fakerES.person.lastName();
    const username = replacePunctuationMarks((firstName + lastName + '@metahospital.com')).replace(/\s/g, '').toLowerCase();
    allUsers.push(
      { id: i, username: username, password: bcrypt.hashSync('test'), name: firstName + " " + lastName, role: 'student', createdAt: new Date(), updatedAt: new Date() },
    )
  }

  return allUsers;
}

function setupData() {
  const roles = addRoles(['admin', 'teacher', 'student']);

  const applications = addApplications(['Metahospital']);

  const schools = addSchools(['IES Los Gladiolos']);

  const allusers = setAllUsers();

  const { users, admins, teachers, students } = getUserAccountsAndUserForRoles(allusers);

  const userRoles = addUserRoles({ admins, teachers, students });

  const courses = addCourses([
    { name: 'Técnicos Cuidados Auxiliares de Enfermería', acronyms: 'CAE', schoolId: 1 },
    { name: 'Técnicos de emergencias sanitarias', acronyms: 'TES', schoolId: 1 },
    { name: 'Técnicos de Imagen para el Diagnóstico', acronyms: 'IMD', schoolId: 1 }
  ]);

  const groups = addGroups([
    { name: '1ºCAE', date: '2023-2024', SchoolID: 1, CourseId: 1 },
    { name: '2ºCAE', date: '2023-2024', SchoolID: 1, CourseId: 1 },
    { name: '1ºTES', date: '2023-2024', SchoolID: 1, CourseId: 2 },
    { name: '2ºTES', date: '2023-2024', SchoolID: 1, CourseId: 2 },
    { name: '1ºIMD', date: '2023-2024', SchoolID: 1, CourseId: 3 },
    { name: '2ºIMD', date: '2023-2024', SchoolID: 1, CourseId: 3 }
  ])

  const studentGroups = addStudentGroups([
    { StudentID: 7, GroupID: 1 },
    { StudentID: 8, GroupID: 1 },
    { StudentID: 9, GroupID: 2 },
    { StudentID: 10, GroupID: 2 },
    { StudentID: 11, GroupID: 3 },
    { StudentID: 12, GroupID: 3 },
    { StudentID: 13, GroupID: 4 },
    { StudentID: 14, GroupID: 4 },
    { StudentID: 15, GroupID: 5 },
    { StudentID: 16, GroupID: 5 }
  ], '2023-09-06');

  const teacherGroups = addTeacherGroups([
    { TeacherID: 2, GroupID: 1 },
    { TeacherID: 2, GroupID: 2 },
    { TeacherID: 3, GroupID: 2 },
    { TeacherID: 3, GroupID: 3 },
    { TeacherID: 4, GroupID: 3 },
    { TeacherID: 4, GroupID: 4 },
    { TeacherID: 5, GroupID: 4 },
    { TeacherID: 5, GroupID: 5 },
    { TeacherID: 6, GroupID: 6 },
  ], '2023-09-06');

  const teacherSchools = addTeacherSchools([
    { TeacherID: 2, SchoolID: 1 },
    { TeacherID: 3, SchoolID: 1 },
    { TeacherID: 4, SchoolID: 1 },
    { TeacherID: 5, SchoolID: 1 },
    { TeacherID: 6, SchoolID: 1 },
  ])

  const studentSchools = addStudentSchools([
    { startStudentId: 7, endStudentId: 20, schoolId: 1 }
  ]);

  return {
    roles,
    applications,
    schools,
    users,
    admins,
    teachers,
    students,
    userRoles,
    courses,
    groups,
    studentGroups,
    teacherGroups,
    teacherSchools,
    studentSchools,
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const {
        roles,
        applications,
        schools,
        users,
        admins,
        teachers,
        students,
        userRoles,
        courses,
        groups,
        studentGroups,
        teacherGroups,
        teacherSchools,
        studentSchools,
      } = setupData();

      console.log('\ndata setup completed...\n');

      await Promise.all([
        queryInterface.bulkInsert('Roles', roles),
        queryInterface.bulkInsert('Applications', applications),
        queryInterface.bulkInsert('UserAccounts', users),
        queryInterface.bulkInsert('Schools', schools),
      ]);

      console.log('first stage completed...\n');

      await Promise.all([
        queryInterface.bulkInsert('Admins', admins),
        queryInterface.bulkInsert('Teachers', teachers),
        queryInterface.bulkInsert('Students', students),
        queryInterface.bulkInsert('Courses', courses),
        queryInterface.bulkInsert('UserRoles', userRoles),
      ]);

      console.log('second stage completed...\n');

      await Promise.all([
        queryInterface.bulkInsert('groups', groups),
        queryInterface.bulkInsert('TeacherSchools', teacherSchools),
        queryInterface.bulkInsert('StudentSchools', studentSchools),
      ]);

      console.log('third stage completed...\n');

      await Promise.all([
        queryInterface.bulkInsert('StudentGroups', studentGroups),
        queryInterface.bulkInsert('TeacherGroups', teacherGroups),
      ]);

      console.log('fourth stage completed...\n');
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await Promise.all([
        queryInterface.bulkDelete('StudentGroups', null, {}),
        queryInterface.bulkDelete('TeacherGroups', null, {}),
      ]);
      await Promise.all([
        queryInterface.bulkDelete('TeacherSchools', null, {}),
        queryInterface.bulkDelete('StudentSchools', null, {}),
        queryInterface.bulkDelete('groups', null, {}),
      ]);
      await Promise.all([
        queryInterface.bulkDelete('UserRoles', null, {}),
        queryInterface.bulkDelete('Courses', null, {}),
        queryInterface.bulkDelete('Students', null, {}),
        queryInterface.bulkDelete('Teachers', null, {}),
        queryInterface.bulkDelete('Admins', null, {}),
      ]);
      await Promise.all([
        queryInterface.bulkDelete('Roles', null, {}),
        queryInterface.bulkDelete('Applications', null, {}),
        queryInterface.bulkDelete('UserAccounts', null, {}),
        queryInterface.bulkDelete('Schools', null, {}),
      ]);
    } catch (error) {
      console.error('Error al revertir la migración:', error);
      throw error;
    }
  }
};

// npm install -g sequelize-cli
// sequelize seed:generate --name initial-data
// sequelize db:seed:all