import React from 'react';

export interface DebugFlags {
    debugNetwork?: boolean,
    debugPersistence?: boolean,
    debugDB?: boolean,
    debugGeo?: boolean,
    debugCrypt?: boolean,
}

const AppContext = React.createContext({
    network: false,
    isDarkMode: false,
    debugFlags: {} as DebugFlags,
});

export default AppContext;
