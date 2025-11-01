import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const taskSlice = createSlice({
    name: "taskSlice",
    initialState,
    reducers: {

        cargarTareasIniciales: (state, action) => {
            const tareasIniciales = action.payload;
            return tareasIniciales;
        },

        //funcion para agregar tareas
        addTaskSlice: (state, action) => {
            const newTask = action.payload;
            state.push(newTask);
            console.log("state en redux", state);
        },

        //funcion para borrar tarea
        deleteTaskSlice: (state, action) => {
            const idDelete = action.payload;
            const taskFiltered = state.filter((task) => (task._id || task.id) != idDelete);
            return taskFiltered;
        },


        //funcion check tarea
        checkTaskSlice: (state, action) => {
            const { id, completed } = action.payload;
            const task = state.find((task) => (task._id || task.id) === id);
            if (task) {
                task.completed = completed;
            }
        },

        //funcion para actualizar status de tarea
        updateTaskStatusSlice: (state, action) => {
            const { id, status } = action.payload;
            const task = state.find((task) => (task._id || task.id) === id);
            if (task) {
                task.status = status;
            }
        },

        //funcion para actualizar tarea completa
        updateTaskSlice: (state, action) => {
            const { id, title, description } = action.payload;
            const task = state.find((task) => (task._id || task.id) === id);
            if (task) {
                if (title !== undefined) task.title = title;
                if (description !== undefined) task.description = description;
            }
        }






    }
})


export const { cargarTareasIniciales, addTaskSlice, deleteTaskSlice, checkTaskSlice, updateTaskStatusSlice, updateTaskSlice } = taskSlice.actions;
export default taskSlice.reducer;