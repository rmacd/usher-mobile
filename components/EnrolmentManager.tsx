import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_DB_PROJ_BASE} from '../utils/Const';
import Toast from 'react-native-toast-message';
// @ts-ignore
import RSA, {KeyPair} from 'react-native-fast-rsa';
import {ProjectPermission} from '../generated/UsherTypes';

export type Project = {
    projectId: string,
    clientPrivateKey: string,
    clientPublicKey: string,
    projectPublicKey: string,
    projectPermissions: ProjectPermission[]
}

export const getProject = (projectId: string) => {
    return AsyncStorage.getItem(`${ASYNC_DB_PROJ_BASE}_${projectId}`)
        .then((proj) => {
            if (!proj) {
                console.debug('Instantiating new project object');
                return {projectId: projectId} as Project;
            }
            return JSON.parse(proj) as Project;
        });
};

export const getClientKeys = (projectId: string | undefined) => {
    if (projectId === undefined) {
        throw new Error('Project ID must be provided');
    }
    return getProject(projectId)
        .then((project) => {
            if ((project.clientPrivateKey === undefined) || (project.clientPublicKey === undefined)) {
                Toast.show({
                    type: 'info',
                    text1: `Please wait`,
                    text2: `Generating client keypair: this can take a few seconds`,
                    position: 'bottom',
                });
                return RSA.generate(2048)
                    .then((keyPair: KeyPair) => {
                        AsyncStorage.mergeItem(`${ASYNC_DB_PROJ_BASE}_${projectId}`, JSON.stringify(
                            {
                                projectId: projectId,
                                clientPrivateKey: keyPair.privateKey,
                                clientPublicKey: keyPair.publicKey,
                            } as Project,
                        ));
                        return keyPair;
                    });
            } else {
                return {
                    publicKey: project.clientPublicKey,
                    privateKey: project.clientPrivateKey,
                } as KeyPair;
            }
        });
};
