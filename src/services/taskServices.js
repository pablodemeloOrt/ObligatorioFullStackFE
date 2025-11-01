import axios from 'axios';
import  { urlBase } from '../constants/constants.js';



export const getTasksService = (projectId) => {
    const token = localStorage.getItem('token');

    return axios.get(`${urlBase}/tasks/project/${projectId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            console.log('Response data:', response.data);
            // La API devuelve { tareas: [...] }, extraemos solo el array
            return response.data.tareas || [];
        })
        .catch(error => {
            console.error('Error in getTasksService:', error);
            throw error;
        });
}
export const addTaskService = (title) => {
    const token = localStorage.getItem('token');

    return fetch(`${urlBase}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: title })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(json => {
            console.log(json)
            return json;
        })
}


export const deleteTaskService = (id) => {
    const token = localStorage.getItem('token');
    
    return fetch(`${urlBase}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(json => {
            console.log(json)
            return json;
        })
}

export const updateTaskStatusService = (idTask, newStatus) => {
    const token = localStorage.getItem('token');
    
    return fetch(`${urlBase}/tasks/${idTask}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(json => {
            console.log(json)
            return json;
        })
}

export const updateTaskService = (idTask, taskData) => {
    const token = localStorage.getItem('token');
    
    return fetch(`${urlBase}/tasks/${idTask}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(json => {
            console.log(json)
            return json;
        })
}