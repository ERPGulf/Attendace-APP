const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    username: null,
    fullname: null,
    userDetails: null,
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

    }
})

export const { setUsername, setFullname, setUserDetails } = UserSlice.actions

// selector

export default UserSlice.reducer