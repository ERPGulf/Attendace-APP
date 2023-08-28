const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    started: false,
    startTime: null,
    endTime: null,
    tripType: null
}


export const TripDetailsSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setStartTrip: (state, action) => {
            state.started = true
            state.startTime = action.payload.startTime
            state.tripType = action.payload.tripType
        },
        setEndTrip: (state, action) => {
            state.started = false
            state.endTime = action.payload
            state.tripType=null
        }
    }
})

export const { setEndTrip, setStartTrip } = TripDetailsSlice.actions

// selector
export const startTimeSelect = state => state.tripDetails.startTime
export const endTimeSelect = state => state.tripDetails.endTime
export const startedSelect = state => state.tripDetails.started


export default TripDetailsSlice.reducer

