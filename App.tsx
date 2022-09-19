import React, {useEffect, useState} from 'react';
import AppContext from './components/AppContext';
import {useColorScheme} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {UsherStack} from './utils/UsherStack';
import Icon from 'react-native-vector-icons/FontAwesome';

Icon.loadFont();

const App = () => {
    // application startup:
    //  1. check network connectivity
    //     i) display network infobox
    //    ii) check remote validity/pinning
    //  2. check whether enrolled on project
    //     i) check project remains valid (if on network)
    //    ii) display project details, permit upload, etc.
    //   iii) check/update keypair
    //  3. display global details (regardless of whether enrolled)

    const [enrolled, setEnrolled] = useState(false);
    const netInfo = useNetInfo();
    const isDarkMode = useColorScheme() === 'dark';

    const applicationSettings = {
        enrolled: enrolled,
        network: (netInfo.isConnected) ? netInfo.isConnected : false,
        isDarkMode: isDarkMode,
    };

    return (
        <AppContext.Provider value={applicationSettings}>
            <UsherStack/>
        </AppContext.Provider>
    );
};

export default App;
