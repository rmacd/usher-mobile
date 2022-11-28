import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from './reducers/AuthReducer';
import ModalReducer from './reducers/ModalReducer';
import ProjectsReducer from './reducers/ProjectsReducer';
import PermissionsReducer from './reducers/PermissionsReducer';

export const store = configureStore({
    reducer: {
        modal: ModalReducer,
        auth: AuthReducer,
        projects: ProjectsReducer,
        permissions: PermissionsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
