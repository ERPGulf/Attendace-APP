import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    QuickAccessStack: []
}

const QuickAccessSlice = createSlice({
    name:'quickAccess',
    initialState,
    reducers: {
        setAdd: (state, action) => {
            state.QuickAccessStack.push(action.payload)
        },
        setRemove: (state, action) => {
            state.QuickAccessStack = state.QuickAccessStack.filter(item => item !== action.payload)
        }
    }
})


export const { setAdd, setRemove } = QuickAccessSlice.actions


// selectors

export const QuickAccessSelector = (state) => state.QuickAccess.QuickAccessStack

export default QuickAccessSlice.reducer