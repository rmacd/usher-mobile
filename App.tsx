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
import {BASE_API_URL} from '@env';
import {ConfirmResetApp} from './components/ConfirmResetApp';
import {InspectData} from './components/InspectData';
import {createTables, getDBConnection} from './utils/DAO';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

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
    const [hasRunInitialHooks, setHasRunInitialHooks] = useState(false);

    const debugFlags = {
        debugNetwork: true,
        debugPersistence: true,
        debugDB: false,
        debugGeo: true,
        debugCrypt: false,
    };

    const applicationSettings = {
        network: hasNetwork,
        isDarkMode: isDarkMode,
        debugFlags: debugFlags,
    };

    useEffect(() => {
        setHasNetwork((netInfo.isConnected) ? netInfo.isConnected : false);
    }, [netInfo.isConnected]);

    useEffect(() => {
        console.debug(`Using endpoint ${BASE_API_URL}`);
    }, []);

    useEffect(() => {
        if (debugFlags?.debugDB) {console.log('Running setup hooks');}
        getDBConnection().then(
            (conn: SQLiteDatabase) => {
                return createTables(conn);
            },
        ).then(() => {
            if (debugFlags?.debugDB) {console.debug('DB available');}
            setHasRunInitialHooks(true);
        });
    }, [debugFlags?.debugDB]);

    if (!hasRunInitialHooks) {
        return (<></>);
    }

    return (
        <AppContext.Provider value={applicationSettings}>
            <Provider store={store}>
                <ContextWrapper>
                    <UsherMenu/>
                    <UsherStack/>
                    <Footer/>
                    <Toast/>

                    {/*any modals*/}
                    <ModalSettings/>
                    <InspectData/>
                    <ConfirmResetApp/>
                </ContextWrapper>
            </Provider>
        </AppContext.Provider>
    );
};

export default App;
