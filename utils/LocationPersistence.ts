import {Location} from 'react-native-background-geolocation';
import {Project} from '../components/EnrolmentManager';
import Aes from 'react-native-aes-crypto';
import {AESPayload} from '../generated/UsherTypes';

const encryptData = (text: string, key: string) => {
    return Aes.randomKey(16).then(iv => {
        // at the moment the native functions only handle text, not binary
        return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
            cipher,
            iv,
        }));
    });
};

function encryptAndWriteLocation(location: Location | string, project: Project) {
    if (project.projectPublicKey === undefined) {
        console.error(`Public key for project ${project.projectId} does not exist`);
        return;
    }
    Aes.randomKey(32).then((key: string) => {
        console.debug('key', key);
        // location cannot be gzipped until native functions accept byte[]
        encryptData(JSON.stringify(location), key)
            .then(({cipher, iv}) => {
                console.debug('Encrypted:', cipher);
                console.debug('IV:', iv);
                Aes.hmac256(cipher, key).then(hash => {
                    console.debug('HMAC', hash);
                });
                const v = {
                    key: key,
                    iv: iv,
                    payload: cipher,
                } as AESPayload;
            });
    });
}

export const persistLocation = (location: Location | string, project: Project) => {
    encryptAndWriteLocation(location, project);
};
