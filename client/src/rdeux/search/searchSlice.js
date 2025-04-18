import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    search: null,
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        searchPost: (state, action) => {
            state.search = action.payload;
        }
    },
});

export const {searchPost } = searchSlice.actions;

export default searchSlice.reducer;