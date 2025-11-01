import axios from 'axios';
import  { urlBase } from '../constants/constants.js';


    
export const getProjectsService = () => {
    const token = localStorage.getItem('token');

    return axios.get(`${urlBase}/projects`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            console.log('Response data:', response.data);
            // La API devuelve { projects: [...] }, extraemos solo el array
            return response.data.projects || [];
        })
        .catch(error => {
            console.error('Error in getProjectsService:', error);
            throw error;
        });
}

export const deleteProjectService = (id) => {
    const token = localStorage.getItem('token');
    
    return axios.delete(`${urlBase}/projects/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            console.log('Delete project response:', response.data);
            return response.data;
        })
        .catch(error => {
            console.error('Error in deleteProjectService:', error);
            throw error;
        });
}

export const addProjectService = (name, description) => {
    const token = localStorage.getItem('token');
    
    return axios.post(`${urlBase}/projects`, {
        name: name,
        description: description
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            console.log('Add project response:', response.data);
            return response.data;
        })
        .catch(error => {
            console.error('Error in addProjectService:', error);
            throw error;
        });
}
