import React from "react";
import {AuthResponse} from '../generated/UsherTypes';

const AppContext = React.createContext({
    enrolled: false,
    network: false,
    isDarkMode: false,
    auth: {} as AuthResponse,
});

export default AppContext;
