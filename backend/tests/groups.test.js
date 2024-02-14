const { api, db, faker } = require('./testSetup');
const Group = db.groups;

describe('GROUP API', () => {
  let token;
  let user;
  let groupId;

  beforeAll(async () => {
    user = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    }
    const basicAuth = `Basic ${Buffer.from(`${user.username}:${user.password}`).toString('base64')}`;

    const response = await api.post('/api/users').set('Authorization', basicAuth);

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user).toBeDefined();
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.username).toBe(user.username);

    token = response.body.access_token;
    user = response.body.user;
  })

  test('should return status 200 for Groups get all with valid token', async () => {
    await api.get('/api/groups').set('Authorization', `Bearer ${token}`).expect(200);
  });

  test('should return status 401 (Unauthorized) for Groups get all without valid token', async () => {
    await api.get('/api/groups').set('Authorization', 'Bearer testToken').expect(401);
  });

  test('should create propperly a group and saves it correctly in the database', async () => {
    const testGroupName = faker.company.name();

    const response = await api.post('/api/groups').set('Authorization', `Bearer ${token}`).send({ name: testGroupName }).expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');

    groupId = response.body.id;

    const createdGroup = await Group.findByPk(groupId);

    expect(createdGroup).toBeTruthy();
    expect(createdGroup.name).toEqual(testGroupName);
  });

  test('should fail on the creation of the groups when there is no name (err 400: Bad request)', async () => {
    await api.post('/api/groups').set('Authorization', `Bearer ${token}`).send({ name: '' }).expect(400);
    await api.post('/api/groups').set('Authorization', `Bearer ${token}`).send({ name: null }).expect(400);
  });

  afterAll(async () => {

    if (groupId) {
      await api.delete(`/api/groups/${user.id}`).set('Authorization', `Bearer ${token}`).expect(200);
    }

    if (user && user.id) {
      await api.delete(`/api/users/${user.id}`).set('Authorization', `Bearer ${token}`).expect(200);
    }
  })

});