import axios from 'axios';

import { backendCoursesEndpoint } from '../constants/backendEndpoints';

export const getCourses = async () => {
    try {
        const response = await axios.get(backendCoursesEndpoint + '/' + localStorage.getItem("schoolId") , {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(` getting Course: ${error.message}`);
    }
};

export const deleteCourse = async (id) => {
    try {
        const response = await axios.delete(backendCoursesEndpoint + '/' + id, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        });

        if (response.data) {
            return response.data;
        } else {
            throw new Error('Empty response data after deleting Course');
        }
    } catch (error) {
        throw new Error(` deleting Course: ${error.message}`);
    }
};

export const updateCourse = async ( id, updatedCoursesData) => {
    try {
        const response = await axios.put(backendCoursesEndpoint + '/' + id, updatedCoursesData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        });

        if (response.data) {
            return response.data;
        } else {
            throw new Error('Empty response data after updating Course');
        }
    } catch (error) {
        throw new Error(` updating Course: ${error.message}`);
    }
};

export const createNewCourse = async (postCourse) => {
    try {
        const response = await axios.post(backendCoursesEndpoint + '/add', postCourse, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        });

        if (response.data) {
            return response.data;
        } else {
            throw new Error('Empty response data after creating Course');
        }
    } catch (error) {
        throw new Error(` creating Course: ${error.message}`);
    }
};


const CoursesService = {
    getCourses,
    deleteCourse,
    updateCourse,
    createNewCourse
}

export default CoursesService;