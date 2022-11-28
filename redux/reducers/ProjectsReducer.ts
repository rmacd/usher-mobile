import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Project} from '../../components/EnrolmentManager';

export interface ProjectState {
    projects: Project[];
}

const initialState: ProjectState = {
    projects: [] as Project[],
};

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        addProject: {
            reducer: (state, action: PayloadAction<{ p: Project }>) => {
                state.projects = Array.from(new Set<Project>([...state.projects, action.payload.p]));
            },
            prepare: (p: Project) => {
                return {payload: {p}};
            },
        },
    },
});

export const {addProject} = projectsSlice.actions;

export default projectsSlice.reducer;
