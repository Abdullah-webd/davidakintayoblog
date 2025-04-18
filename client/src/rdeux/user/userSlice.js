import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error:null,
    loading: false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading = true
            state.error = null
        },
        signInSuccess:(state, action)=>{
            state.loading = false
            state.currentUser = action.payload
            state.error = null
        },
        signInFailure:(state, action)=>{
            state.loading = false
            state.error = action.payload
        },
        updateStart:(state,action)=>{
            state.loading = true
            state.error = null
        },
        updateSuccess:(state,action)=>{
            state.loading = false
            state.currentUser = action.payload
            state.error = null
        },
        updateFailure:(state,action)=>{
            state.loading = false
            state.error = action.payload
        },
        deleteStart:(state,action)=>{
            state.loading = true
            state.error = null
        },
        deleteSuccess:(state,action)=>{
            state.loading = false
            state.currentUser = null
            state.error = null
        },
        deleteFailure:(state,action)=>{
            state.loading = false
            state.error = action.payload
        },
        signOutSuccess:(state,action)=>{
            state.loading = false
            state.currentUser = null
            state.error = null
        },
    }
})


export const { signInStart, signInSuccess, signInFailure,updateStart,updateSuccess,updateFailure,deleteStart,deleteSuccess,deleteFailure,signOutSuccess } = userSlice.actions

export default userSlice.reducer













