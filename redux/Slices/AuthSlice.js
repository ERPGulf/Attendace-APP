const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    isLoggedIn: false,
    token: null
}


export const AuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setSignIn: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.token = action.payload.token
        },
        setSignOut: (state) => {
            state.token = null;
            state.isLoggedIn = false;
        }
    }
})

export const { setSignIn, setSignOut } = AuthSlice.actions

// selector
export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectEmail = (state) => state.userAuth.token;

export default AuthSlice.reducer

