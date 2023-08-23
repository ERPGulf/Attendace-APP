import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeButtons: [null] // Initialize as an empty array
}

const QuickAccessSlice = createSlice({
    name: 'quickAccess',
    initialState,
    reducers: {
        setAdd: (state, action) => {
            if (state.activeButtons) {
                state.activeButtons = [...state.activeButtons, action.payload]; // Push the payload to the array
            }
            else {
                state.activeButtons = [action.payload]
            }
        },
        setRemove: (state, action) => {
            state.activeButtons = state.activeButtons.filter(item => item.id !== action.payload.id);
        }
    }
})

export const { setAdd, setRemove } = QuickAccessSlice.actions;

// selectors
export const activeButtonsSelector = (state) => state.quickAccess.activeButtons;

export default QuickAccessSlice.reducer;
