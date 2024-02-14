const { faker } = require('@faker-js/faker');
const supertest = require('supertest');
const app = require('../http-server');
const db = require('../models/index');

const api = supertest(app);

beforeAll(async () => {
  await db.sequelize.sync();
});

afterAll(async () => {
  await db.sequelize.close();
})

module.exports = { api, faker, db };