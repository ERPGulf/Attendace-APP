const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  checkin: false,
  checkinTime: null,
  checkoutTime: null,
  location: null,
  mediaLocation: null,
  hasTakenPhoto: false,
};

export const AttendanceSlice = createSlice({
  name: "attendance",
  initialState,
  extraReducers: (builder) => builder.addCase("REVERT_ALL", () => initialState),
  reducers: {
    setCheckin: (state, action) => {
      state.checkin = true;
      state.checkinTime = action.payload.checkinTime;
      state.location = action.payload.location;
    },
    setCheckout: (state, action) => {
      state.checkin = false;
      state.checkoutTime = action.payload.checkoutTime;
    },
    setOnlyCheckIn: (state, action) => {
      state.checkin = action.payload;
    },
    setMediaLocation: (state, action) => {
      state.mediaLocation = action.payload;
    },
    setHasTakenPhoto: (state, action) => {
      state.hasTakenPhoto = action.payload;
    },
  },
});

export const {
  setCheckin,
  setCheckout,
  setOnlyCheckIn,
  setMediaLocation,
  setHasTakenPhoto,
} = AttendanceSlice.actions;

// selector
export const selectCheckin = (state) => state.attendance.checkin;
export const selectCheckinTime = (state) => state.attendance.checkinTime;
export const selectCheckoutTime = (state) => state.attendance.checkoutTime;
export const selectLocation = (state) => state.attendance.location;
export const selectMediaLocation = (state) => state.attendance.mediaLocation;
export const selectHasTakenPhoto = (state) => state.attendance.hasTakenPhoto;

export default AttendanceSlice.reducer;
