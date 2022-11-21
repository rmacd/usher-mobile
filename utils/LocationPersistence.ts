import {Location} from 'react-native-background-geolocation';
import {Project} from '../components/EnrolmentManager';
import Aes from 'react-native-aes-crypto';
import {AESPayload, MobileLocationEvent} from '../generated/UsherTypes';
import {getDBConnection, triggerPushLocations, writeEvent} from './DbSetup';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

const debugPersistence = false;
const debugCrypt = false;

const encryptData = (text: string, key: string) => {
    return Aes.randomKey(16).then(iv => {
        // at the moment the native functions only handle text, not binary
        return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
            cipher,
            iv,
        }));
    });
};

function encryptAndWriteLocation(location: MobileLocationEvent | string, project: Project) {
    if (project.projectPublicKey === undefined) {
        console.error(`Public key for project ${project.projectId} does not exist`);
        return;
    }
    if (debugPersistence) {console.debug("Persisting to project", project.projectId, location);}
    Aes.randomKey(32).then((key: string) => {
        if (debugCrypt) {console.debug('key', key);}
        // location cannot be gzipped until native functions accept byte[]
        encryptData(JSON.stringify(location), key)
            .then(({cipher, iv}) => {
                if (debugCrypt) {console.debug('Encrypted:', cipher);}
                if (debugCrypt) {console.debug('IV:', iv);}
                Aes.hmac256(cipher, key).then(hash => {
                    if (debugCrypt) {console.debug('HMAC', hash);}
                });
                const v = {
                    key: key,
                    iv: iv,
                    payload: cipher,
                } as AESPayload;
                if (debugCrypt) {console.debug("payload", v);}
                getDBConnection().then(
                    (conn: SQLiteDatabase) => {
                        writeEvent(conn, project.projectId, JSON.stringify(v))
                            .then(() => {
                                triggerPushLocations();
                            });
                    }
                );
            });
    });
}

export const persistLocation = (location: Location | string, project: Project) => {
    const loc = location.valueOf() as Location;
    const event = {
        eventId: loc.uuid,
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
    } as MobileLocationEvent;
    encryptAndWriteLocation(event, project);
};
