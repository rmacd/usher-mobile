import {ReduxTypes} from '../ReduxTypes';
import {createSlice} from '@reduxjs/toolkit';

interface SettingsModalState {
    showSettings: boolean
}

const initialState: SettingsModalState = {
    showSettings: true,
};

export const settingsSlice = createSlice({
    name: 'settingsModal',
    initialState,
    reducers: {
        showSettings: (state) => {
            state.showSettings = true
        },
        hideSettings: (state) => {
            state.showSettings = false;
        }
    }
})

export default (state = initialState, action: { type: string; }) => {
    switch (action.type) {
        case ReduxTypes.SHOW_MODAL_SETTINGS:
            return {
                ...state,
                showSettings: true,
            };
        case ReduxTypes.HIDE_MODAL_SETTINGS:
            return {
                ...state,
                showSettings: false,
            };
        default:
            return state;
    }
};
