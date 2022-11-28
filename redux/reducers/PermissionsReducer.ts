import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {ProjectPermission} from '../../generated/UsherTypes';

export interface Permissions {
    requested: ProjectPermission[],
    granted: ProjectPermission[]
}

const initialState: Permissions = {
    requested: [] as ProjectPermission[],
    granted: [] as ProjectPermission[],
};

export const permissionsSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        requestPermission: {
            reducer: (state, action: PayloadAction<{ p: ProjectPermission }>) => {
                state.requested = Array.from(new Set<ProjectPermission>([...state.requested, action.payload.p]));
            },
            prepare: (p: ProjectPermission) => {
                return {payload: {p}};
            },
        },
        requestPermissions: {
            reducer: (state, action: PayloadAction<{ p: ProjectPermission[] }>) => {
                state.requested = Array.from(new Set<ProjectPermission>([...state.requested, ...action.payload.p]));
            },
            prepare: (p: ProjectPermission[]) => {
                return {payload: {p}};
            },
        },
        grantPermission: {
            reducer: (state, action: PayloadAction<{ p: ProjectPermission }>) => {
                state.granted = Array.from(new Set<ProjectPermission>([...state.granted, action.payload.p]));
            },
            prepare: (p: ProjectPermission) => {
                return {payload: {p}};
            },
        },
        refusePermission: {
            reducer: (state, action: PayloadAction<{ p: ProjectPermission }>) => {
                state.granted = Array.from(new Set<ProjectPermission>([...state.granted]))
                    .filter((a) => {
                        return a !== action.payload.p;
                    });
            },
            prepare: (p: ProjectPermission) => {
                return {payload: {p}};
            },
        },
        refusePermissions: {
            reducer: (state, action: PayloadAction<{ p: ProjectPermission[] }>) => {
                state.granted = Array.from(new Set<ProjectPermission>([...state.granted]))
                    .filter((a) => {
                        return !(action.payload.p.includes(a));
                    });
            },
            prepare: (p: ProjectPermission[]) => {
                return {payload: {p}};
            },
        },
    },
});

export const {
    requestPermission,
    grantPermission,
    requestPermissions,
    refusePermission,
    refusePermissions,
} = permissionsSlice.actions;

export default permissionsSlice.reducer;
