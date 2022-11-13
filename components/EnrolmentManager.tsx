import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_DB_PROJ_BASE} from '../utils/Const';
import Toast from 'react-native-toast-message';
import RSA, {KeyPair} from 'react-native-fast-rsa';

type Project = {
    project_id: string,
    client_priv_key: string,
    client_pub_key: string,
    project_pub_key: string
}

export const getProject = (projectId: string) => {
    return AsyncStorage.getItem(`${ASYNC_DB_PROJ_BASE}_${projectId}`)
        .then((proj) => {
            if (!proj) {
                console.debug("Instantiating new project object");
                return {project_id: projectId} as Project;
            }
            return JSON.parse(proj) as Project;
        });
};

export const getClientKeys = (projectId: string | undefined) => {
    if (projectId === undefined) {
        throw new Error("Project ID must be provided");
    }
    return getProject(projectId)
        .then((project) => {
            if ((project.client_priv_key === undefined) || (project.client_pub_key === undefined)) {
                Toast.show({
                    type: "info",
                    text1: `Please wait`,
                    text2: `Generating client keypair: this can take a few seconds`,
                    position: "bottom",
                });
                return RSA.generate(2048)
                    .then((keyPair: KeyPair) => {
                        AsyncStorage.mergeItem(`${ASYNC_DB_PROJ_BASE}_${projectId}`, JSON.stringify(
                            {
                                project_id: projectId,
                                client_priv_key: keyPair.privateKey,
                                client_pub_key: keyPair.publicKey,
                            } as Project
                        ));
                        return keyPair;
                    });
            }
            else {
                return {
                    publicKey: project.client_pub_key,
                    privateKey: project.client_priv_key,
                } as KeyPair;
            }
        });
};
