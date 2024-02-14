import axios from 'axios';
import authService from '../auth.service';

jest.mock('axios');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Login function', () => {
    it('Should set token in localStorage on successful login', async () => {
      const user = { username: 'testUser', password: 'testPassword' };
      const responseMock = {
        data: { access_token: 'mockedAccessToken', user: { role: 'admin' } }
      };
      axios.post.mockResolvedValue(responseMock);

      await authService.login(user);

      expect(localStorage.getItem('token')).toEqual('mockedAccessToken');
    });

    it('Should throw error on unsuccessful login', async () => {
      const user = { username: 'testUser', password: 'testPassword' };
      axios.post.mockRejectedValue(new Error('Unauthorized'));

      await expect(authService.login(user)).rejects.toThrow('Unauthorized');
    });
  });

  it('Logout function should remove token from localStorage', async () => {
    localStorage.setItem('token', 'mockedAccessToken');

    await authService.logout();

    expect(localStorage.getItem('token')).toBeNull();
  });

  describe('IsLoggedIn function', () => {
    it.each([
      ['when there is a token in localStorage', true],
      ['when there is no token in localStorage', false],
    ])('should return %s', (_, expected) => {
      if (expected) {
        localStorage.setItem('token', 'mockedAccessToken');
      } else {
        localStorage.removeItem('token');
      }

      const result = authService.isLoggedIn();
      expect(result).toEqual(expected);
    });
  });

  describe('GetMyRole function', () => {
    afterEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
    });

    it('Should return user role when axios post request succeeds', async () => {
      axios.post.mockResolvedValueOnce({ data: { role: 'admin' } });

      const role = await authService.getMyRole();

      expect(role).toBe('admin');
    });

    it('Should remove token from localStorage and redirect to homepage when axios post fails', async () => {
      axios.post.mockRejectedValueOnce(new Error('Unauthorized'));
      await expect(authService.getMyRole()).rejects.toThrowError('Unauthorized');

      expect(localStorage.getItem('token')).toBeNull();

      expect(window.location.href.endsWith('/')).toBeTruthy();
    });
  });

  describe('NavigateByRole function', () => {
    const navigateMock = jest.fn();
    it.each([
      ['admin', '/admin/control-panel'],
      ['teacher', '/teacher/main'],
      ['student', '/student-groups'],
      ['director', '/director-panel'],
    ])('Should navigate to %s page', (role, expectedRoute) => {
      authService.navigateByRole(role, navigateMock);
      expect(navigateMock).toHaveBeenCalledWith(expectedRoute);
    });
  });
});