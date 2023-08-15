const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    username: null,
    fullname: null,
    userDetails: null,
    baseUrl: null,
    fileId: null
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
        setFileid: (state, action) => {
            state.fileId = action.payload
        },

    }
})

export const { setUsername, setFullname, setUserDetails, setBaseUrl,setFileid } = UserSlice.actions

// selector
export const selectBaseUrl = state => state.user.baseUrl
export const selectFileid = state => state.user.fileId

export default UserSlice.reducer