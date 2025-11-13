import { getUserServices } from "../../../services/userServices"
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUsersSlice = createAsyncThunk(
    'users/getUsersSlice',
    async (_, thunkAPI) => {
        const controller = new AbortController();
        const { signal } = thunkAPI;

        signal.addEventListener('abort', () => {
            controller.abort();
        });

        try {
            const result = await getUserServices(controller);
            const data = result.data;
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                return thunkAPI.rejectWithValue('Petición cancelada');
            }
            return thunkAPI.rejectWithValue('Error al obtener usuarios');
        }
    }
)