const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    username: null,
    baseUrl: null,
    fullname: null,
    userDetails: null
}


export const UserSlice = createSlice({
    name: 'Nav',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload
        },
        setBaseUrl: (state, action) => {
            state.baseUrl = action.payload
        },
        setFullname: (state, action) => {
            state.fullname = action.payload
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload
        }
    }
})

export const { setBaseUrl, setUsername, setFullname, setUserDetails } = UserSlice.actions

// selector
export const selectusername = (state) => state.UserSlice.username
export const selectbaseUrl = (state) => state.UserSlice.baseUrl
export const selectTravelTime = (state) => state.UserSlice.fullname


// 
export default UserSlice.reducer