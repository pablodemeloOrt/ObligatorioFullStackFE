import { configureStore } from '@reduxjs/toolkit'
import taskSlice from "./features/taskSlice"
import projectSlice from "./features/projectSlice"
import userSlice from "./features/user/userSlice"

export const store = configureStore({
    reducer: {
        taskSlice,
        projectSlice,
        userSlice
    }
})