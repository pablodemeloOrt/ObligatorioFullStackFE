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
            return response.data;
        })
        .catch(error => {
            throw error;
        });
}

export const addProjectService = (name, description) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    return axios.post(`${urlBase}/projects`, {
        name: name,
        description: description,
        owner: userId
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw error;
        });
}

export const addMemberToProjectService = (projectId, userId) => {
    const token = localStorage.getItem('token');
    
    return axios.post(`${urlBase}/projects/${projectId}/members`, {
        userId: userId
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error in addMemberToProjectService:', error);
            throw error;
        });
}

export const getAllUsersService = () => {
    const token = localStorage.getItem('token');
    
    return axios.get(`${urlBase}/users`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            return response.data.users || response.data || [];
        })
        .catch(error => {
            console.error('Error in getAllUsersService:', error);
            throw error;
        });
}
