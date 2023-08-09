import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './Slices/UserSlice'
export const store = configureStore({
    reducer: {
        user: UserReducer
    },
})