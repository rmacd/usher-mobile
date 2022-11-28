import React, {useContext, useEffect, useState} from 'react';
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
import {ProjectPermission, VersionDTO} from '../generated/UsherTypes';
import {BASE_API_URL} from '@env';
import {request} from '../utils/Request';
import VersionNumber from 'react-native-version-number';
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';

type ContextProps = React.PropsWithChildren<{}>;

export default function ContextWrapper({children}: ContextProps) {

    const {network, debugFlags} = useContext(AppContext);

    // note that device ID must only be accessed once user consent has been gained
    const [uniqueId, setUniqueId] = useState('');
    useEffect(() => {
        DeviceInfo.getUniqueId()
            .then((res) => {
                setUniqueId(res);
            });
    }, []);

    const dispatch = useDispatch();
    const projects = useSelector((state: RootState) => {
        return state.projects.projects;
    });
    const permissions = useSelector((state: RootState) => {
        return state.permissions;
    });

    const [completedVersionCheck, setCompletedVersionCheck] = useState(false);
    useEffect(() => {
        if (!network || completedVersionCheck) {
            return;
        }
        const buildVersion = VersionNumber.buildVersion;
        request<VersionDTO>(`${BASE_API_URL}/version`, {})
            .then((version) => {
                if (!version) {
                    return;
                }
                if (version.minVersion && version.minVersion > parseInt(buildVersion, 10)) {
                    Toast.show({
                        type: 'error',
                        text1: 'App out of date',
                        text2: 'App will not work properly until it is updated',
                    });
                }
                setCompletedVersionCheck(true);
            });
    }, [completedVersionCheck, network]);

    // load projects from asyncstorage into redux state
    useEffect(() => {
        if (!dispatch) {
            return;
        }
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

    useEffect(() => {
        console.debug('Got projects from redux:', projects);
    }, [projects]);

    useEffect(() => {
        BackgroundGeolocation.destroyLocations(() => {
            if (debugFlags?.debugPersistence) {
                console.log('Deleted all locations');
            }
        });
    }, [debugFlags?.debugPersistence]);

    // if project requests device id and permission is granted by the user, pass this to the project
    function getDeviceId(proj: Project, granted: ProjectPermission[]) {
        if (proj.projectPermissions.includes('DEVICE_ID' as ProjectPermission) && granted.includes('DEVICE_ID' as ProjectPermission)) {
            return uniqueId;
        }
        return undefined;
    }

    // as with device ID
    function getParticipantId(proj: Project, granted: ProjectPermission[]) {
        if (proj.projectPermissions.includes('PARTICIPANT_ID' as ProjectPermission) && granted.includes('PARTICIPANT_ID' as ProjectPermission)) {
            return proj.participantId;
        }
    }

    useEffect(() => {
        console.debug('Updated GRANTED permissions:', permissions.granted, 'projects:', projects);
        // note that enum comparator can't be used
        if (permissions.granted.includes('GPS_FOREGROUND' as ProjectPermission) || permissions.granted.includes('GPS_BACKGROUND' as ProjectPermission)) {
            console.debug(`Permission to use GPS has been granted: setting up listeners`);

            // clearing old listeners
            BackgroundGeolocation.removeAllListeners(
                () => {
                    if (debugFlags?.debugGeo) {
                        console.debug('BG: removed listeners');
                    }
                },
                () => {
                    throw new Error('BG: unable to remove listeners');
                });

            // adding listener per project
            BackgroundGeolocation.addListener('location', (input: any) => {
                if (debugFlags?.debugGeo) {
                    console.debug('Got location', input);
                }
                projects.forEach((proj) => {
                    const deviceId = getDeviceId(proj, permissions.granted);
                    const participantId = getParticipantId(proj, permissions.granted);
                    persistLocation(input, proj, debugFlags, participantId, deviceId);
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
                    if (debugFlags?.debugGeo) {
                        console.debug('BG: removed listeners');
                    }
                },
                () => {
                    throw new Error('BG: unable to remove listeners');
                });
            BackgroundGeolocation.stop();
        }
    }, [debugFlags?.debugGeo, permissions.granted]);

    const reRegisterListeners = () => {
        console.debug('Re-registering all applicable listeners');
        BackgroundGeolocation.addListener('enabledchange', (input: any) => {
            console.debug('Got geo state change', input);
        });
        // register for changes to geofences
        BackgroundGeolocation.addListener('geofenceschange', (input: any) => {
            console.debug('Got geofences change', input);
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
