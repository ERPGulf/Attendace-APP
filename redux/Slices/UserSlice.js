const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    username: null,
    fullname: null,
    userDetails: null,
    baseUrl: null
}


export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload
        },
        setFullname: (state, action) => {
            state.fullname = action.payload
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload
        },
        setBaseUrl: (state, action) => {
            state.baseUrl = action.payload
        },

    }
})

export const { setUsername, setFullname, setUserDetails, setBaseUrl } = UserSlice.actions

// selector
export const selectBaseUrl = state => state.user.baseUrl
export default UserSlice.reducer