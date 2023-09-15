const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    checkin: false,
    checkinTime: null,
    checkoutTime: null,
    location: null,
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
       
    }
})

export const { setCheckin, setCheckout, setOnlyCheckIn } = AttendanceSlice.actions

// selector
export const selectCheckin = (state) => state.attendance.checkin;
export const selectCheckinTime = (state) => state.attendance.checkinTime;
export const selectCheckoutTime = (state) => state.attendance.checkoutTime;
export const selectLocation = (state) => state.attendance.location;

export default AttendanceSlice.reducer

