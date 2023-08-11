const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    checkin: false,
    checkinTime: null,
    checkoutTime: null,
    location:null
}


export const AttendenceSlice = createSlice({
    name: 'attendence',
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
        }
    }
})

export const { setCheckin, setCheckout } = AttendenceSlice.actions

// selector
export const selectCheckin = (state) => state.attendence.checkin;
export const selectCheckinTime = (state) => state.attendence.checkinTime;
export const selectCheckoutTime = (state) => state.attendence.checkoutTime;
export const selectLocation = (state) => state.attendence.location;



export default AttendenceSlice.reducer

