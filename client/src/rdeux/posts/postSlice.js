import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    post: null,
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        createPost: (state, action) => {
            state.post = action.payload;
        },
        deletePost: (state, action) => {
            state.post = null;
        },
        updatePost: (state, action) => {
            state.post = action.payload;
        },
    },
});

export const { createPost,deletePost,updatePost } = postSlice.actions;

export default postSlice.reducer;