import axios from 'axios';

import { backendSchoolsEndpoint } from '../consts/backendEndpoints';

export const getTeachersBySchool = async (id) => {
    try {
        const response = await axios.get(backendSchoolsEndpoint+ '/' + id +'/teachers',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error geting school: ', error);
        return null;
    }
};

export const createNewTeacher = async ( id, updatedteacherschoolsData) => {
    try {
        const response = await axios.post(backendSchoolsEndpoint + '/'+ id +'/teachers', updatedteacherschoolsData,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error ceate teachers: ', error);
        return null;
    }
};

export const deleteTeacherFromSchool = async ( schoolId, userId) => {
    try {
        const response = await axios.delete(backendSchoolsEndpoint + `/${schoolId}/teachers/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        return response.data;
        
    } catch (error) {
        console.error('Error deleting teacher: ', error);
        return null;
    }
};

const TeacherSchoolsService = {
    getTeachersBySchool,
    createNewTeacher,
    deleteTeacherFromSchool
}

export default TeacherSchoolsService;