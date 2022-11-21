import React, {useCallback, useEffect, useState} from 'react';
import AppContext from './components/AppContext';
import {useColorScheme} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {UsherStack} from './utils/UsherStack';
import {AuthResponse} from './generated/UsherTypes';
import {request} from './utils/Request';
import Toast from 'react-native-toast-message';
import {BASE_API_URL} from '@env';
import {Footer} from './components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {createTables, getDBConnection} from './utils/DbSetup';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {persistLocation} from './utils/LocationPersistence';
import {Project} from './components/EnrolmentManager';
import {ASYNC_DB_PROJ_BASE} from './utils/Const';

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

    const debugPersistence = false;
    const debugDB = false;
    const debugNetwork = false;
    const debugGeo = true;

    const [enroled, setEnroled] = useState(false);
    const netInfo = useNetInfo();
    const [hasNetwork, setHasNetwork] = useState(false);
    const isDarkMode = useColorScheme() === 'dark';
    const [auth, setAuth] = useState({} as AuthResponse);

    useEffect(() => {
        setHasNetwork((netInfo.isConnected) ? netInfo.isConnected : false);
    }, [netInfo.isConnected]);

    useEffect(() => {
        if (debugDB) {console.log("Running setup hooks");}
        getDBConnection().then(
            (conn: SQLiteDatabase) => {
                return createTables(conn);
            }
        ).then(() => {
            if (debugDB) {console.debug("DB available");}
        });
    }, [debugDB]);

    const refreshCsrfToken = useCallback(() => {
        if (hasNetwork) {
            if (debugNetwork) {console.debug('Requesting CSRF token at', BASE_API_URL + '/auth');}
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
            if (debugNetwork) {console.debug('Updated CSRF token:', auth);}
        }
    }, [auth, debugNetwork]);

    useEffect(() => {
        BackgroundGeolocation.destroyLocations(() => {
            if (debugPersistence) {console.log("Deleted all locations");}
        });
    }, [debugPersistence]);

    useEffect(() => {
        console.debug('Setting up BackgroundGeolocation (BG)');
        if (BackgroundGeolocation === undefined) {
            console.error("BG undefined");
            return;
        }
        BackgroundGeolocation.removeAllListeners(
            () => {
                if (debugGeo) {console.debug('BG: removed listeners');}
            },
            () => {
                throw new Error('BG: unable to remove listeners');
            });
            BackgroundGeolocation.addListener("location", (input: any) => {
                if (debugGeo) {console.debug("Got location", input);}
                AsyncStorage.getAllKeys((_error, result) => {
                    return result?.filter(function (r) {
                        r.startsWith(ASYNC_DB_PROJ_BASE);
                    }).keys;
                }).then((res: readonly string[]) => {
                    if (debugPersistence || debugGeo) {console.debug(`Calling location listener for ${res.length} projects: ${res}`);}
                    for (const projKey of res) {
                        AsyncStorage.getItem(projKey, (_itemErr, itemVal) => {
                            const proj = JSON.parse(itemVal || '') as unknown as Project;
                            if (!proj || proj.projectId === undefined) {
                                console.warn(`Unable to find project or project ID for key ${projKey}`);
                                return;
                            }
                            persistLocation(input, proj);
                        });
                    }
                });
            });
        BackgroundGeolocation.ready(
            {
                maxRecordsToPersist: 0,
                debug: true,
                desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
                distanceFilter: 10,
                stationaryRadius: 25,
                logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
                startOnBoot: true,
                stopOnTerminate: false,
                preventSuspend: true,
                notification: {
                    title: "Updating location",
                },
            },
            (state) => {
                // ⚠️ Do not execute any API method which will require accessing location-services
                // until #ready gets resolved (eg: #getCurrentPosition, #watchPosition, #start).
                if (!state.enabled) {
                    BackgroundGeolocation.start();
                }
            });
    }, [debugGeo, debugPersistence]);

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
                            console.debug(`\n>> key: ${key}: ${JSON.stringify(JSON.parse(val || ''), null, ' ')}`);
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
