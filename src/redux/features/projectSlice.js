import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const projectSlice = createSlice({
    name: "projectSlice",
    initialState,
    reducers: {

        //funcion carga inicial de proyectos
        cargarProyectosIniciales: (state, action) => {
            const proyectosIniciales = action.payload;
            return proyectosIniciales;
        },

        //funcion para agregar proyectos
        addProjectSlice: (state, action) => {
            const newProject = action.payload;
            state.push(newProject);
            console.log("state en redux", state);
        },

        //funcion para borrar proyecto
        deleteProjectSlice: (state, action) => {
            const idDelete = action.payload;
            const projectFiltered = state.filter((project) => (project._id || project.id) != idDelete);
            return projectFiltered;
        },

        //funcion para actualizar proyecto
        updateProjectSlice: (state, action) => {
            const { id, ...updatedData } = action.payload;
            const project = state.find((project) => (project._id || project.id) === id);
            if (project) {
                Object.assign(project, updatedData);
            }
        }






    }
})


export const { cargarProyectosIniciales, addProjectSlice, deleteProjectSlice, updateProjectSlice } = projectSlice.actions;
export default projectSlice.reducer;