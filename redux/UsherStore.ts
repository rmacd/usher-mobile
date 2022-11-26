import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from './reducers/AuthReducer';
import ModalReducer from './reducers/ModalReducer';

export const store = configureStore({
    reducer: {
        modal: ModalReducer,
        auth: AuthReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
