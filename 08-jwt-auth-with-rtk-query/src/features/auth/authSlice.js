import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, token: null },
    reducers: {
        setCredentials: (state, action) => {
            const { username, accessToken } = action.payload;
            state.user = username;
            state.token = accessToken;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    }
});

export const {
    setCredentials,
    logout
} = authSlice.actions;

export const selectCurrentUser = state => state.auth.user;
export const selectCurrentToken = state => state.auth.token;

export default authSlice.reducer;