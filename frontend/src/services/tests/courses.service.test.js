import axios from 'axios';
import CoursesService from '../courses.service';
import { backendCoursesEndpoint } from '../../constants/backendEndpoints';

jest.mock('axios');

describe('CoursesService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getCourses success', async () => {
    const mockData = [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    localStorage.setItem('token', 'token');
    localStorage.setItem('schoolId', 'schoolId');

    const result = await CoursesService.getCourses();

    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${backendCoursesEndpoint}/schoolId`,
      {
        headers: {
          Authorization: `Bearer token`,
        },
      }
    );
  });

  test('deleteCourse success', async () => {
    const courseId = 'courseId';
    axios.delete.mockResolvedValueOnce({ data: 'Course deleted' });

    localStorage.setItem('token', 'token');

    const result = await CoursesService.deleteCourse(courseId);

    expect(result).toEqual('Course deleted');
    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      `${backendCoursesEndpoint}/${courseId}`,
      {
        headers: {
          Authorization: `Bearer token`,
        },
      }
    );
  });

  test('updateCourse success', async () => {
    const courseId = 'courseId';
    const updatedCoursesData = { name: 'Updated Course' };
    axios.put.mockResolvedValueOnce({ data: 'Course updated' });

    localStorage.setItem('token', 'token');

    const result = await CoursesService.updateCourse(courseId, updatedCoursesData);

    expect(result).toEqual('Course updated');
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(
      `${backendCoursesEndpoint}/${courseId}`,
      updatedCoursesData,
      {
        headers: {
          Authorization: `Bearer token`,
        },
      }
    );
  });

  test('createNewCourse success', async () => {
    const postCourse = { name: 'New Course' };
    axios.post.mockResolvedValueOnce({ data: 'New Course created' });

    localStorage.setItem('token', 'token');
    localStorage.setItem('schoolId', 'schoolId');

    const result = await CoursesService.createNewCourse(postCourse);

    expect(result).toEqual('New Course created');
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${backendCoursesEndpoint}/schoolId`,
      postCourse,
      {
        headers: {
          Authorization: `Bearer token`,
        },
      }
    );
  });
});
