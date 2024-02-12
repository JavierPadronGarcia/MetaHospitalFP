const { faker } = require('@faker-js/faker');
const supertest = require('supertest');
const app = require('../index');
const db = require('../models/index');
const { response } = require('../http-server');
const User = db.users;

const api = supertest(app);

beforeAll(async () => {
  await db.sequelize.sync();
});

describe('USERS ENDPOINTS', () => {

  describe('GET ALL', () => {
    let token;
    let userId;

    it('Should return code 400 (token is required)', async () => {
      const response = await api.get('/api/users').expect(400);
      expect(response.body.message).toBe("Token is required.");
    });

    it('Should return code 401 (Unauthorized)', async () => {
      await api.get('/api/users').set('Authorization', 'Bearer wrong_token').expect(401);
    })

    it('Should return code 200 with a valid token', async () => {
      const userData = {
        username: faker.internet.userName(),
        password: faker.internet.password()
      }

      const basicAuth = `Basic ${Buffer.from(`${userData.username}:${userData.password}`).toString('base64')}`;

      const createUserResponse = await api.post('/api/users').set('Authorization', basicAuth);

      expect(createUserResponse.body.user).toHaveProperty('id')
      expect(typeof createUserResponse.body.access_token).toEqual('string')

      userId = createUserResponse.body.user.id;
      token = createUserResponse.body.access_token;

      const loginResponse = await api.get('/api/users').set('Authorization', `Bearer ${token}`).expect(200);

      expect(Array.isArray(loginResponse.body)).toBeTruthy();
      expect(loginResponse.body.length).toBeGreaterThan(0);

    });

    afterAll(async () => {
      if (userId && token) {
        await api.delete(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`).expect(200);
      }
    });
  })

  describe('GET ONE', () => {
    let user;
    let token;
    beforeAll(async () => {
      const userToCreate = {
        username: faker.internet.userName(),
        password: faker.internet.password()
      }

      const basicAuth = `Basic ${Buffer.from(`${userToCreate.username}:${userToCreate.password}`).toString('base64')}`;

      const response = await api.post('/api/users').set('Authorization', basicAuth);

      user = response.body.user;
      token = response.body.access_token;

      expect(user).toBeDefined();
    });

    it('Should return code 400 (token is required)', async () => {
      const response = await api.get(`/api/users/${user.id}`).expect(400);
      expect(response.body.message).toBe("Token is required.");
    });

    it('Should return code 401 (Unauthorized)', async () => {
      await api.get(`/api/users/${user.id}`).set('Authorization', 'Bearer wrong_token').expect(401);
    })

    it('Should return code 200 and the correct user', async () => {
      const response = await api.get(`/api/users/${user.id}`).set('Authorization', `Bearer ${token}`).expect(200);
      const requestedUser = response.body;
      expect(requestedUser).toBeDefined();
      expect(requestedUser.username).toEqual(user.username);
      expect(requestedUser.id).toEqual(user.id);
    })

    afterAll(async () => {
      if (user && token) {
        await api.delete(`/api/users/${user.id}`).set('Authorization', `Bearer ${token}`).expect(200);
      }
    });
  });

});