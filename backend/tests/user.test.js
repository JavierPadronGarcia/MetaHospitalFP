const { api, faker, db } = require('./testSetup');
const User = db.users;
const UserController = require('../controllers/user.controller');

describe('USERS ENDPOINTS', () => {

  describe('CREATE', () => {
    let token;
    let userId;

    it('Should return code 200 with a valid token and user is propperly created', async () => {
      const userToCreate = {
        username: faker.internet.userName(),
        password: faker.internet.password()
      }

      const basicAuth = `Basic ${Buffer.from(`${userToCreate.username}:${userToCreate.password}`).toString('base64')}`;

      const createResponse = await api.post('/api/users').set('Authorization', basicAuth);
      expect(createResponse.status).toBe(200);

      expect(createResponse.body).toBeDefined();
      expect(createResponse.body.user).toBeDefined();

      token = createResponse.body.access_token;

      const createdUser = createResponse.body.user;

      expect(createdUser).toHaveProperty('id');
      expect(createdUser).toHaveProperty('username');
      expect(createdUser).toHaveProperty('password');
      expect(createdUser.username).toBe(userToCreate.username);

      userId = createdUser.id;
    });

    it('Should return code 400', async () => {
      const response = await api.post('/api/users');
      expect(response.status).toBe(400);
    });

    afterAll(async () => {
      if (userId) {
        await api.delete(`/api/users/${userId}`).set({ Authorization: `Bearer ${token}` })
      }
    })
  });


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

  describe('GET ALL BY ROLE', () => {
    let userIds = [];
    let user;

    beforeAll(async () => {
      const defaultUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: 'admin'
      }
      const basicAuthDefaultUser = `Basic ${Buffer.from(`${defaultUser.username}:${defaultUser.password}`).toString('base64')}`;

      const response = await api.post('/api/users').set('Authorization', basicAuthDefaultUser).send({ role: 'admin' })
      expect(response.body.user.role).toBe('admin')
      user = response.body.user;
      token = response.body.access_token;
    })

    afterAll(async () => {
      if (userIds.length != 0) {
        userIds.forEach(async (id) => {
          await api.delete(`/api/users/${id}`).set('Authorization', `Bearer ${token}`).expect(200);
        })
      }

      if (user && user.id) {
        await api.delete(`/api/users/${user.id}`).set('Authorization', `Bearer ${token}`).expect(200);
      }
    });

    it.each([
      ['directors'],
      ['students'],
      ['teachers'],
    ])('Should return code 401 (Unauthorized) with %s call', async (userType) => {
      await api.get(`/api/users/${userType}`).set('Authorization', `Bearer errorToken`).expect(401);
    });

    it.each([
      ['directors', 'director'],
      ['students', 'student'],
      ['teachers', 'teacher'],
    ])('Should return code 200 with all %s', async (userType, requiredRole) => {
      const user = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: requiredRole
      };
      const basicAuth = `Basic ${Buffer.from(`${user.username}:${user.password}`).toString('base64')}`;

      const userResponse = await api.post('/api/users').set('Authorization', basicAuth).send({ role: user.role });

      expect(userResponse.body.user.role).toBe(requiredRole);

      const allUsersResponse = await api.get(`/api/users/${userType}`).set('Authorization', `Bearer ${token}`).expect(200);

      expect(allUsersResponse.body.length).toBeGreaterThanOrEqual(1);

      allUsersResponse.body.forEach(user => {
        expect(user.role).toBe(requiredRole);
      });

      userIds.push(userResponse.body.user.id);
    })
  });

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