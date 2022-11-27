import {Location} from 'react-native-background-geolocation';
import {Project} from '../components/EnrolmentManager';
import Aes from 'react-native-aes-crypto';
import {AESPayload, LocationEventDTO} from '../generated/UsherTypes';
import {getDBConnection, triggerPushLocations, writeEvent} from './DAO';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {DebugFlags} from '../components/AppContext';
// @ts-ignore
import RSA, {Hash} from 'react-native-fast-rsa';

const encryptData = (text: string, key: string) => {
    return Aes.randomKey(16).then(iv => {
        // at the moment the native functions only handle text, not binary
        return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
            cipher,
            iv,
        }));
    });
};

function encryptAndWriteLocation(location: LocationEventDTO | string, project: Project, debugFlags: DebugFlags) {
    if (project.projectPublicKey === undefined) {
        console.info(`Public key for project ${project.projectId} does not exist`);
        return;
    }
    if (debugFlags && debugFlags?.debugPersistence) {
        console.debug('Persisting to project', project.projectId, location);
    }
    Aes.randomKey(32).then((key: string) => {
        if (debugFlags && debugFlags?.debugCrypt) {
            console.debug('key', key);
        }
        RSA.encryptOAEP(key, '', Hash.SHA256, "-----BEGIN RSA PUBLIC KEY-----\n" + project.projectPublicKey + "\n-----END RSA PUBLIC KEY-----\n")
            .then((encryptedKey: string) => {
                console.debug("generated enckey", encryptedKey);
                // location cannot be gzipped until native functions accept byte[]
                encryptData(JSON.stringify(location), key)
                    .then(({cipher, iv}) => {
                        if (debugFlags && debugFlags?.debugCrypt) {
                            console.debug('Encrypted:', cipher);
                            console.debug('IV:', iv);
                        }
                        const v = {
                            key: encryptedKey,
                            iv: iv,
                            payload: cipher,
                            version: 1,
                        } as AESPayload;
                        if (debugFlags && debugFlags?.debugCrypt) {
                            console.debug('payload', v);
                        }
                        getDBConnection().then(
                            (conn: SQLiteDatabase) => {
                                writeEvent(conn, project.projectId, JSON.stringify(Object.assign({}, v)))
                                    .then(() => {
                                        triggerPushLocations();
                                    });
                            },
                        );
                    });
            });
    });
}

export const persistLocation = (location: Location | string, project: Project, debugFlags: DebugFlags) => {
    const loc = location.valueOf() as Location;
    const event = {
        id: loc.uuid,
        participantId: '--NULL--',
        latitude: loc.coords?.latitude,
        longitude: loc.coords?.longitude,
        altitude: loc.coords?.altitude,
        speed: loc.coords?.speed,
        heading: loc.coords?.heading,
        moving: loc.is_moving,
        timestamp: new Date(loc.timestamp),
        locationAccuracy: loc.coords?.accuracy,
        altitudeAccuracy: loc.coords?.altitude_accuracy,
        speedAccuracy: loc.coords?.speed_accuracy,
        headingAccuracy: loc.coords?.heading_accuracy,
        batteryCharging: loc.battery?.is_charging,
        batteryLevel: loc.battery?.level,
        activity: loc.activity?.activity,
        activityAccuracy: loc.activity?.confidence,
        mock: loc.mock,
    } as LocationEventDTO;
    return encryptAndWriteLocation(event, project, debugFlags);
};
