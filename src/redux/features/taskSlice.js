import { createSlice } from "@reduxjs/toolkit";
//const initialState = [];
const taskSlice = createSlice({
    name: "taskSlice",
    initialState: {
        tasks: [],
        loading: false,
        error: null
    },
    reducers: {

        cargarTareasIniciales: (state, action) => {
            const tareasIniciales = action.payload;
            state.tasks = tareasIniciales;
        },


        //funcion para agregar tareas
        addTaskSlice: (state, action) => {
            const newTask = action.payload.tarea || action.payload;
            state.tasks.unshift(newTask);
        },

        //funcion para borrar tarea
        deleteTaskSlice: (state, action) => {
            state.tasks = state.tasks.filter(t => t._id !== action.payload);
        },


        //funcion check tarea
        checkTaskSlice: (state, action) => {
            const { id, completed } = action.payload;
            const task = state.tasks.find((task) => (task._id || task.id) === id);
            if (task) {
                task.completed = completed;
            }
        },

        //funcion para actualizar status de tarea
        updateTaskStatusSlice: (state, action) => {
            const { id, status } = action.payload;
            const task = state.tasks.find((task) => (task._id || task.id) === id);
            if (task) {
                task.status = status;
            }
        },

        //funcion para actualizar tarea completa
        updateTaskSlice: (state, action) => {
            const { id, title, description } = action.payload;
            if (Array.isArray(state.tasks)) {
                const task = state.tasks.find((t) => (t._id || t.id) === id);
                if (task) {
                    task.title = title;
                    task.description = description;
                }
            }
        }


    }
})


export const { cargarTareasIniciales, addTaskSlice, deleteTaskSlice, checkTaskSlice, updateTaskStatusSlice, updateTaskSlice } = taskSlice.actions;
export default taskSlice.reducer;