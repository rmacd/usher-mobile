import SettingsModalReducer from './reducers/SettingsModalReducer';
import {configureStore} from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        settingsModal: SettingsModalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
