import {createSlice} from '@reduxjs/toolkit';

interface ModalState {
    showSettings: boolean,
    showResetApp: boolean,
    showDatabase: boolean,
}

const initialState: ModalState = {
    showSettings: false,
    showResetApp: false,
    showDatabase: false,
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showSettings: (state) => {
            state.showSettings = true;
        },
        hideSettings: (state) => {
            state.showSettings = false;
        },
        showResetApp: (state) => {
            state.showSettings = false;
            state.showResetApp = true;
        },
        hideResetApp: (state) => {
            state.showResetApp = false;
        },
        showDatabase: (state) => {
            state.showSettings = false;
            state.showDatabase = true;
        },
        hideDatabase: (state) => {
            state.showDatabase = false;
        },
    },
});

export const {
    showSettings, hideSettings,
    showResetApp, hideResetApp,
    showDatabase, hideDatabase,
} = modalSlice.actions;

export default modalSlice.reducer;
