import React, {useContext, useEffect} from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_DB_PROJ_BASE} from '../utils/Const';
import {Project} from './EnrolmentManager';
import {persistLocation} from '../utils/LocationPersistence';
import {createTables, getDBConnection} from '../utils/DAO';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import AppContext from './AppContext';

type ContextProps = React.PropsWithChildren<{}>;

export default function ContextWrapper({children}: ContextProps) {

    const {debugFlags} = useContext(AppContext);

    useEffect(() => {
        if (debugFlags?.debugDB) {
            console.log('Running setup hooks');
        }
        getDBConnection().then(
            (conn: SQLiteDatabase) => {
                return createTables(conn);
            },
        ).then(() => {
            if (debugFlags?.debugDB) {
                console.debug('DB available');
            }
        });
    }, [debugFlags?.debugDB]);

    // debug - print db
    useEffect(() => {
        if (!debugFlags?.debugDB) {
            return;
        }
        AsyncStorage.getAllKeys()
            .then((input: readonly string[]) => {
                for (const key of input) {
                    AsyncStorage.getItem(key)
                        .then((_val) => {
                            console.debug(`\n>> key: ${key}: ${JSON.stringify(JSON.parse(_val || ''), null, ' ')}`);
                        });
                }
            });
    }, [debugFlags?.debugDB]);

    useEffect(() => {
        BackgroundGeolocation.destroyLocations(() => {
            if (debugFlags?.debugPersistence) {
                console.log('Deleted all locations');
            }
        });
    }, [debugFlags?.debugPersistence]);

    useEffect(() => {
        console.debug('Setting up BackgroundGeolocation (BG)');
        if (BackgroundGeolocation === undefined) {
            console.error('BG undefined');
            return;
        }
        BackgroundGeolocation.removeAllListeners(
            () => {
                if (debugFlags?.debugGeo) {
                    console.debug('BG: removed listeners');
                }
            },
            () => {
                throw new Error('BG: unable to remove listeners');
            });
        BackgroundGeolocation.addListener('location', (input: any) => {
            if (debugFlags?.debugGeo) {
                console.debug('Got location', input);
            }
            AsyncStorage.getAllKeys((_error, result) => {
                return result?.filter(function (r) {
                    r.startsWith(ASYNC_DB_PROJ_BASE);
                }).keys;
            }).then((res: readonly string[]) => {
                if (debugFlags?.debugPersistence || debugFlags?.debugGeo) {
                    console.debug(`Calling location listener for ${res.length} projects: ${res}`);
                }
                for (const projKey of res) {
                    AsyncStorage.getItem(projKey, (_itemErr, itemVal) => {
                        const proj = JSON.parse(itemVal || '') as unknown as Project;
                        if (!proj || proj.projectId === undefined) {
                            console.info(`Unable to find project or project ID for key ${projKey}`);
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
                    title: 'Updating location',
                },
            },
            (state) => {
                // ⚠️ Do not execute any API method which will require accessing location-services
                // until #ready gets resolved (eg: #getCurrentPosition, #watchPosition, #start).
                if (!state.enabled) {
                    BackgroundGeolocation.start();
                }
            });
    }, [debugFlags?.debugGeo, debugFlags?.debugPersistence]);

    return (
        <>
            {children}
        </>
    );
}
