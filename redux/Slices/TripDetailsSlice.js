const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  started: false,
  startTime: null,
  endTime: null,
  tripType: null,
  tripId: null,
  vehicleId: null,
};

export const TripDetailsSlice = createSlice({
  name: 'userAuth',
  initialState,
  extraReducers: builder => builder.addCase('REVERT_ALL', () => initialState),
  reducers: {
    setStartTrip: (state, action) => {
      state.started = true;
      state.startTime = action.payload.startTime;
      state.tripType = action.payload.tripType;
    },
    setEndTrip: state => {
      state.started = false;
      state.tripType = null;
    },
    setStarted: state => {
      state.started = true;
    },
    setTripId: (state, action) => {
      state.tripId = action.payload;
    },
    setVehicleId: (state, action) => {
      state.vehicleId = action.payload;
    },
  },
});

export const { setEndTrip, setStartTrip, setStarted, setTripId, setVehicleId } =
  TripDetailsSlice.actions;

// selector
export const startTimeSelect = state => state.tripDetails.startTime;
export const endTimeSelect = state => state.tripDetails.endTime;
export const startedSelect = state => state.tripDetails.started;
export const tripIdSelect = state => state.tripDetails.tripId;
export const vehicleIdSelect = state => state.tripDetails.vehicleId;

export default TripDetailsSlice.reducer;
