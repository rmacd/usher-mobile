import {createSlice} from '@reduxjs/toolkit';

interface ModalState {
    showSettings: boolean
}

const initialState: ModalState = {
    showSettings: false,
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
    },
});

export const {showSettings, hideSettings} = modalSlice.actions;

export default modalSlice.reducer;
