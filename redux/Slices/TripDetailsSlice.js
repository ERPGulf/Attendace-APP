const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    started: false,
    startTime: null,
    endTime: null
}


export const TripDetailsSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setStartTrip: (state, action) => {
            state.started = true
            state.startTime = action.payload
        },
        setEndTrip: (state, action) => {
            state.started = false
            state.endTime = action.payload
        }
    }
})

export const { setEndTrip, setStartTrip } = TripDetailsSlice.actions

// selector
export const startTimeSelect = state => state.tripDetails.startTime
export const endTimeSelect = state => state.tripDetails.endTime
export const startedSelect = state => state.tripDetails.started


export default TripDetailsSlice.reducer

