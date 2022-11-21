import React from 'react';
import {AuthResponse} from '../generated/UsherTypes';

const AppContext = React.createContext({
    enroled: false,
    setEnroled: (_val: boolean) => {
    },
    network: false,
    isDarkMode: false,
    auth: {} as AuthResponse,
    refreshAuthCB: () => {
    },
});

export default AppContext;
