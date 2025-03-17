import { combineReducers } from '@reduxjs/toolkit';

// Import other reducers
import UserSlice from './Slices/UserSlice';
import AuthSlice from './Slices/AuthSlice';
import AttendanceSlice from './Slices/AttendanceSlice';
import QuickAccessSlice from './Slices/QuickAccessSlice';
import TripDetailsSlice from './Slices/TripDetailsSlice';

const RootReducer = combineReducers({
  user: UserSlice,
  userAuth: AuthSlice,
  attendance: AttendanceSlice,
  quickAccess: QuickAccessSlice,
  tripDetails: TripDetailsSlice,
  // Other individual reducers
});

export default RootReducer;
