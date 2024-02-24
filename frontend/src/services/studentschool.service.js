import axios from 'axios';
import { backendSchoolsEndpoint } from '../constants/backendEndpoints';

export const getStudentsBySchool = async (id) => {
    try {
        const response = await axios.get(backendSchoolsEndpoint+ '/' +id +'/students',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error geting students in a school: ', error);
        throw error;
    }
};

export const createNewStudent = async (id, idStudent) => {
    try {
        const response = await axios.post(backendSchoolsEndpoint+ '/' + id +'/students', idStudent,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error ceate students: ', error);
        throw error;
    }
};

export const deleteStudentFromSchool = async (schoolId, userId) => {
    try {
        const response = await axios.delete(backendSchoolsEndpoint + `/${schoolId}/students/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        return response.data;
        
    } catch (error) {
        console.error('Error deleting student: ', error);
        throw error;
    }
};

const StudentSchoolsService = {
    getStudentsBySchool,
    createNewStudent,
    deleteStudentFromSchool
}

export default StudentSchoolsService;