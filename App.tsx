import React, {useCallback, useEffect, useState} from 'react';
import AppContext from "./components/AppContext";
import {useColorScheme} from 'react-native';
import {useNetInfo} from "@react-native-community/netinfo";
import {UsherStack} from "./utils/UsherStack";
import {AuthResponse} from "./generated/UsherTypes";
import {request} from "./utils/Request";
import Toast from "react-native-toast-message";
import {BASE_API_URL} from "@env";
import {Footer} from './components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aes from 'react-native-aes-crypto';

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

    const [enroled, setEnroled] = useState(false);
    const netInfo = useNetInfo();
    const [hasNetwork, setHasNetwork] = useState(false);
    const isDarkMode = useColorScheme() === "dark";
    const [auth, setAuth] = useState({} as AuthResponse);

    useEffect(() => {
        setHasNetwork((netInfo.isConnected) ? netInfo.isConnected : false);
    }, [netInfo.isConnected]);

    const refreshCsrfToken = useCallback(() => {
        if (hasNetwork) {
            console.debug('Requesting CSRF token at', BASE_API_URL + '/auth');
            request<AuthResponse>(BASE_API_URL + '/auth', {method: 'POST'})
                .then((response) => {
                    setAuth(response);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [hasNetwork]);

    const applicationSettings = {
        enroled: enroled,
        setEnroled: setEnroled,
        network: hasNetwork,
        isDarkMode: isDarkMode,
        auth: auth,
        refreshAuthCB: refreshCsrfToken,
    };

    useEffect(() => {
        refreshCsrfToken();
    }, [applicationSettings.network, refreshCsrfToken]);

    useEffect(() => {
        if (auth) {
            console.debug("Updated CSRF token:", auth);
        }
    }, [auth]);

    // todo fixme
    // useEffect(() => {
    //     console.debug("Checking whether we are currently registered on any projects");
    //     getProjects().then((projects) => {
    //         console.debug("Projects:", projects);
    //         for (const project of projects || []) {
    //             console.debug("Project:", project);
    //         }
    //     });
    // }, []);
    // fixme - debug only
    useEffect(() => {
        AsyncStorage.getAllKeys()
            .then((input: readonly string[]) => {
                for (const key of input) {
                    AsyncStorage.getItem(key)
                        .then((val) => {
                            console.debug(`\n>> key: ${key}: ${JSON.stringify(JSON.parse(val || ""), null, ' ')}`);
                        });
                }
            });
    }, []);

    return (
        <AppContext.Provider value={applicationSettings}>
            <UsherStack/>
            <Footer/>
            <Toast/>
        </AppContext.Provider>
    );
};

export default App;
