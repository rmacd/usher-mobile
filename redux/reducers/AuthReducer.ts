import {createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
    token: string
}

const initialState: AuthState = {
    token: "",
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken: {
            reducer: (state, action: PayloadAction<{v: string}>) => {
                state.token = action.payload.v;
            },
            prepare: (v: string) => {
                return {payload: {v}};
            },
        },
    },
});

export const {setAuthToken} = authSlice.actions;

export default authSlice.reducer;
