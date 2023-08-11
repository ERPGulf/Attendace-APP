import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './Slices/UserSlice'
import AuthSlice from './Slices/AuthSlice'
import AttendenceSlice from './Slices/AttendenceSlice'
export const store = configureStore({
    reducer: {
        user: UserSlice,
        userAuth: AuthSlice,
        attendence: AttendenceSlice
    },
})