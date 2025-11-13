import axios from 'axios';
import  { urlBase } from '../constants/constants.js';


export const getUserServices = (controller, token) => {
    return axios.get(
        `${urlBase}/users`,
        {
            signal: controller.signal,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        }
    )
}

export const loginService = async (email, password) => {
    try {
        const response = await axios.post(
            `${urlBase}/login`,
            {
                email: email,
                password: password
            },
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const registerService = async (name, email, password, profileImage = null) => {
    try {
        const requestBody = {
            name: name,
            email: email,
            password: password
        };

        // Si se proporciona una imagen de perfil, la incluimos
        if (profileImage) {
            requestBody.profileImage = profileImage;
        }

        const response = await axios.post(
            `${urlBase}/signup`,
            requestBody,
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const upgradePlanService = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.patch(
            `${urlBase}/users/plan/upgrade/${userId}`,
            {
                
            },
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCurrentUserService = async (userId) => {
    const token = localStorage.getItem('token');
    
    try {
        // Primero intentar obtener todos los usuarios y filtrar por el ID
        const response = await axios.get(
            `${urlBase}/users`,
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        
        // Buscar el usuario actual en la lista
        const users = response.data.users || response.data;
        const currentUser = users.find(user => user._id === userId || user.id === userId);
        
        return currentUser || { plan: 'plus' }; // Retornar plan plus por defecto si no se encuentra
    } catch (error) {
        throw error;
    }
}