import { combineReducers } from '@reduxjs/toolkit';


// Import other reducers
import UserSlice from './Slices/UserSlice'
import AuthSlice from './Slices/AuthSlice'
import AttendenceSlice from './Slices/AttendenceSlice'

const RootReducer = combineReducers({
    user: UserSlice,
    userAuth: AuthSlice,
    attendence: AttendenceSlice
    // Other individual reducers

});

export default RootReducer;