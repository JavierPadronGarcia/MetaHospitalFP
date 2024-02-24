import axios from 'axios';
import CasesService from '../cases.service';
import { backendCasesEndpoint } from '../../constants/backendEndpoints';

jest.mock('axios');

describe('CasesService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllCasesOfTheGroup success', async () => {
    const mockData = [{ id: 1, name: 'Case 1' }, { id: 2, name: 'Case 2' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const groupId = 'groupId';
    const workUnitId = 'workUnitId';
    const token = 'token';

    localStorage.setItem('token', token);

    const result = await CasesService.getAllCasesOfTheGroup(groupId, workUnitId);

    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${backendCasesEndpoint}/byGroup/${groupId}/${workUnitId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  });

  test('getAllCasesOfTheGroup failure', async () => {
    const errorMessage = 'Error fetching cases';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const groupId = 'groupId';
    const workUnitId = 'workUnitId';
    const token = 'token';

    localStorage.setItem('token', token);

    await expect(CasesService.getAllCasesOfTheGroup(groupId, workUnitId)).rejects.toThrow(errorMessage);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${backendCasesEndpoint}/byGroup/${groupId}/${workUnitId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  });
});
