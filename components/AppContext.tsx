import React from "react";

const AppContext = React.createContext({
    enrolled: false,
    network: false,
    isDarkMode: false,
});

export default AppContext;
