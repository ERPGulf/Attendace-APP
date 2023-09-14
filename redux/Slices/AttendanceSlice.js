const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    checkin: false,
    checkinTime: null,
    checkoutTime: null,
    location: null,
    hasPhoto: false,
}


export const AttendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        setCheckin: (state, action) => {
            state.checkin = true
            state.checkinTime = action.payload.checkinTime
            state.location = action.payload.location
        },
        setCheckout: (state, action) => {
            state.checkin = false
            state.checkoutTime = action.payload.checkoutTime
        },
        setOnlyCheckIn: (state, action) => {
            state.checkin = action.payload

        },
        setHasPhoto: (state, action) => {
            state.hasPhoto = action.payload
        }
    }
})

export const { setCheckin, setCheckout, setOnlyCheckIn,setHasPhoto } = AttendanceSlice.actions

// selector
export const selectCheckin = (state) => state.attendance.checkin;
export const selectCheckinTime = (state) => state.attendance.checkinTime;
export const selectCheckoutTime = (state) => state.attendance.checkoutTime;
export const selectLocation = (state) => state.attendance.location;
export const selectHasPhoto = (state) => state.attendance.hasPhoto;

export default AttendanceSlice.reducer

