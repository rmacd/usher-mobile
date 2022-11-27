import React, {useContext, useEffect} from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_DB_PROJ_BASE} from '../utils/Const';
import {Project} from './EnrolmentManager';
import {persistLocation} from '../utils/LocationPersistence';
import AppContext from './AppContext';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/UsherStore';
import {addProject} from '../redux/reducers/ProjectsReducer';
import {refusePermissions, requestPermissions} from '../redux/reducers/PermissionsReducer';
import {ProjectPermission} from '../generated/UsherTypes';

type ContextProps = React.PropsWithChildren<{}>;

export default function ContextWrapper({children}: ContextProps) {

    const {debugFlags} = useContext(AppContext);

    const dispatch = useDispatch();
    const projects = useSelector((state: RootState) => {
        return state.projects.projects;
    });
    const permissions = useSelector((state: RootState) => {
        return state.permissions;
    });

    // load projects from asyncstorage into redux state
    useEffect(() => {
        if (!dispatch) {return;}
        AsyncStorage.getAllKeys((_error, result) => {
            return result?.filter(function (r) {
                r.startsWith(ASYNC_DB_PROJ_BASE);
            }).keys;
        }).then((res: readonly string[]) => {
            for (const projKey of res) {
                AsyncStorage.getItem(projKey, (_itemErr, itemVal) => {
                    const proj = JSON.parse(itemVal || '') as unknown as Project;
                    dispatch(addProject(proj));
                    dispatch(requestPermissions(proj.projectPermissions));
                });
            }
        });
    }, [dispatch]);

    // debug - print db
    // useEffect(() => {
    //     if (!debugFlags?.debugDB) {
    //         return;
    //     }
    //     AsyncStorage.getAllKeys()
    //         .then((input: readonly string[]) => {
    //             for (const key of input) {
    //                 AsyncStorage.getItem(key)
    //                     .then((_val) => {
    //                         console.debug(`\n>> key: ${key}: ${JSON.stringify(JSON.parse(_val || ''), null, ' ')}`);
    //                     });
    //             }
    //         });
    // }, [debugFlags?.debugDB]);

    useEffect(() => {
        console.debug("Got projects from redux:", projects);
    }, [projects]);

    useEffect(() => {
        BackgroundGeolocation.destroyLocations(() => {
            if (debugFlags?.debugPersistence) {
                console.log('Deleted all locations');
            }
        });
    }, [debugFlags?.debugPersistence]);

    useEffect(() => {
        console.debug('Updated GRANTED permissions:', permissions.granted);
        // note that enum comparator can't be used
        if (permissions.granted.includes('GPS_FOREGROUND' as ProjectPermission) || permissions.granted.includes('GPS_BACKGROUND' as ProjectPermission)) {
            console.debug(`Permission to use GPS has been granted: setting up listeners`);

            // adding listener per project
            BackgroundGeolocation.addListener('location', (input: any) => {
                if (debugFlags?.debugGeo) {
                    console.debug('Got location', input);
                }
                projects.forEach((proj) => {
                    persistLocation(input, proj, debugFlags);
                });
            });

            // enabling geo
            BackgroundGeolocation.ready(
                {
                    maxRecordsToPersist: 0,
                    autoSync: false,
                    debug: false,
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
                }, (error) => {
                    console.info(`Unable to request permissions: disabling (error: ${error})`);
                    dispatch(refusePermissions([ProjectPermission.GPS_BACKGROUND, ProjectPermission.GPS_FOREGROUND]));
                });
        } else {
            console.debug(`Permission has NOT been granted to use GPS: disabling all listeners`);
            BackgroundGeolocation.removeAllListeners(
                () => {
                    if (debugFlags?.debugGeo) {console.debug('BG: removed listeners');}
                },
                () => {
                    throw new Error('BG: unable to remove listeners');
                });
            BackgroundGeolocation.stop();
        }
    }, [debugFlags?.debugGeo, permissions.granted]);

    useEffect(() => {
        if (projects.length > 10) {
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
                            persistLocation(input, proj, debugFlags);
                        });
                    }
                });
            });
            BackgroundGeolocation.ready(
                {
                    maxRecordsToPersist: 0,
                    autoSync: false,
                    debug: false,
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
        }
        else {
            BackgroundGeolocation.stop(() => {
                console.info("Stopped BackgroundGeolocation service");
            });
        }
    }, [debugFlags, debugFlags?.debugGeo, debugFlags?.debugPersistence, projects]);

    const reRegisterListeners = () => {
        console.debug("Re-registering all applicable listeners");
        BackgroundGeolocation.addListener('enabledchange', (input: any) => {
            console.debug("Got geo state change", input);
        });
        // register for changes to geofences
        BackgroundGeolocation.addListener('geofenceschange', (input: any) => {
            console.debug("Got geofences change", input);
        });
    };

    // geo - initial hook
    useEffect(() => {
        BackgroundGeolocation.removeAllListeners(
            () => {
                if (debugFlags?.debugGeo) {
                    console.debug('BG: removed listeners');
                }
                // now re-register any listeners
                reRegisterListeners();
            },
            () => {
                throw new Error('BG: unable to remove listeners');
            });
    }, [debugFlags?.debugGeo]);

    return (
        <>
            {children}
        </>
    );
}
