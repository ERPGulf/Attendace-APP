const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  username: null,
  fullname: null,
  userDetails: null,
  baseUrl: null,
  fileId: null,
  isWfh: false,
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: builder => builder.addCase('REVERT_ALL', () => initialState),
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setFullname: (state, action) => {
      state.fullname = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setBaseUrl: (state, action) => {
      state.baseUrl = action.payload;
    },
    setFileid: (state, action) => {
      state.fileId = action.payload;
    },
    setIsWfh: (state, action) => {
      state.isWfh = action.payload;
    },
  },
});

export const {
  setUsername,
  setFullname,
  setUserDetails,
  setBaseUrl,
  setFileid,
  setIsWfh,
} = UserSlice.actions;

// selector
export const selectBaseUrl = state => state.user.baseUrl;
export const selectFileid = state => state.user.fileId;
export const selectIsWfh = state => state.user.isWfh;
export const selectName = state => state.user.fullname;
export const selectUserDetails = state => state.user.userDetails;
export const selectEmployeeCode = state => state.user.userDetails.employeeCode;
export default UserSlice.reducer;
