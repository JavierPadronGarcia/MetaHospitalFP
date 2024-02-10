import axios from 'axios';
import { backendSchoolsEndpoint } from '../consts/backendEndpoints';

export const getSchools = async () => {
    try {
        const response = await axios.get(backendSchoolsEndpoint,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error geting school: ', error);
        throw new Error(`Error geting school: ${error.message}`);
    }
};

export const deleteSchool = async (id) => {
    try {
        const response = await axios.delete(backendSchoolsEndpoint + '/'+ id,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        return response.data;
        
    } catch (error) {
        console.error('Error delete school: ', error);
        throw new Error(`Error delete school: ${error.message}`);
    }
};

export const updateSchool = async (id,updatedSchoolsData) => {
    try {
        const response = await axios.put(backendSchoolsEndpoint + '/'+id, updatedSchoolsData,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error update school: ', error);
        throw new Error(`Error update school: ${error.message}`);
    }
};

export const createNewSchool = async (postSchool) => {
    try {
        const response = await axios.post(backendSchoolsEndpoint, postSchool,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error create school: ', error);
        throw new Error(`Error create school: ${error.message}`);
    }
};

const SchoolsService = {
    getSchools,
    deleteSchool,
    updateSchool,
    createNewSchool
}

export default SchoolsService;