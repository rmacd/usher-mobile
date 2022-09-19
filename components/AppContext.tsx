import React from "react";
import {AuthResponse} from '../generated/UsherTypes';

const AppContext = React.createContext({
    enrolled: false,
    setEnrolled: (val: boolean) => {},
    network: false,
    isDarkMode: false,
    auth: {} as AuthResponse,
    refreshAuthCB: () => {},
});

export default AppContext;
