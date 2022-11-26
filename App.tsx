import React, {useEffect, useState} from 'react';
import AppContext from './components/AppContext';
import {useColorScheme} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {UsherStack} from './utils/UsherStack';
import Toast from 'react-native-toast-message';
import {Footer} from './components/Footer';
import {ModalSettings} from './components/ModalSettings';
import {Provider} from 'react-redux';
import {store} from './redux/UsherStore';
import {UsherMenu} from './components/UsherMenu';
import ContextWrapper from './components/ContextWrapper';

const App = () => {
    // application startup:
    //  1. check network connectivity
    //     i) display network infobox
    //    ii) check remote validity/pinning
    //  2. check whether enroled on project
    //     i) check project remains valid (if on network)
    //    ii) display project details, permit upload, etc.
    //   iii) check/update keypair
    //  3. display global details (regardless of whether enroled)

    const netInfo = useNetInfo();
    const [hasNetwork, setHasNetwork] = useState(false);
    const isDarkMode = useColorScheme() === 'dark';

    const debugFlags = {
        debugNetwork: false,
        debugPersistence: false,
        debugDB: false,
        debugGeo: true,
    };

    const applicationSettings = {
        network: hasNetwork,
        isDarkMode: isDarkMode,
        debugFlags: debugFlags,
    };

    useEffect(() => {
        setHasNetwork((netInfo.isConnected) ? netInfo.isConnected : false);
    }, [netInfo.isConnected]);

    return (
        <AppContext.Provider value={applicationSettings}>
            <Provider store={store}>
                <ContextWrapper>
                    <UsherMenu/>
                    <UsherStack/>
                    <Footer/>
                    <Toast/>
                    <ModalSettings/>
                </ContextWrapper>
            </Provider>
        </AppContext.Provider>
    );
};

export default App;
