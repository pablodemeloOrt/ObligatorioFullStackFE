import axios from 'axios';
import { urlBase } from '../constants/constants.js';

/**
 * Subir imagen a Cloudinary a través del backend
 * @param {string} base64Image - Imagen en formato base64 (data:image/png;base64,...)
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
export const uploadImageService = async (base64Image) => {
  try {
    const response = await axios.post(
      `${urlBase}/images`,
      {
        file: base64Image
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }
};
