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
            const tareas = response.data.tareas || [];
            // Normalizamos valores de status que pueda devolver el backend
            const normalizeStatus = (s) => {
                if (s === null || s === undefined) return s;
                const raw = String(s).toLowerCase();
                if (raw === 'in-progress' || raw === 'in progress' || raw === 'en-proceso' || raw === 'en proceso' || raw === 'en_proceso') return 'in_progress';
                if (raw === 'backlog') return 'backlog';
                if (raw === 'testing' || raw === 'test') return 'testing';
                if (raw === 'done' || raw === 'completada' || raw === 'completado' || raw === 'completed') return 'done';
                return s;
            }

            const mapped = tareas.map(t => ({ ...t, status: normalizeStatus(t.status) }));
            return mapped;
        })
        .catch(error => {
            console.error('Error in getTasksService:', error);
            throw error;
        });
}
export const addTaskService = (title, projectId) => {
    const token = localStorage.getItem('token');

    return fetch(`${urlBase}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: title, projectId: projectId})
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
    // Convertimos la clave interna 'in_progress' -> 'in-progress' antes de enviar
    const mapToBackendStatus = (s) => {
        if (s === 'in_progress') return 'in-progress';
        
        return s;
    }

    const statusToSend = mapToBackendStatus(newStatus);

    return fetch(`${urlBase}/tasks/${idTask}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: statusToSend })
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