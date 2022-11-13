import {AESPayload} from '../generated/UsherTypes';
import Aes from "react-native-aes-crypto";
// @ts-ignore - local library (for now)
import RSA, {Hash} from 'react-native-fast-rsa';
import {Buffer} from 'buffer';

/**
 * Returns AES key as hex
 * @param input the AES payload including encrypted key
 * @param privateKey the client's private key
 */
export const getAESKey = function (input: AESPayload, privateKey: string) {
    if (input === undefined || input.key === undefined || privateKey === undefined) {
        throw new Error("Input and private key must both be defined");
    }
    // gets AES key from input
    return RSA.decryptOAEP(input.key, '', Hash.SHA256, privateKey)
        .then((res: string) => {
            console.debug(`Got response of length ${res.length}`);
            return Buffer.from(res || '').toString('hex');
        });
};

export const decryptPayload = function (input: AESPayload, key: string) {
    if (input === undefined
        || input.key === undefined
        || input.payload === undefined
        || input.iv === undefined
        || key === undefined) {
        throw new Error("Input and AES key must both be defined");
    }

    // payload = base64 (already encoded as such)
    // key = hex (already encoded as such)
    // iv = hex
    const iv = Buffer.from(input.iv, 'base64').toString('hex');

    Aes.decrypt(
        input.payload,
        key,
        iv,
        'aes-256-cbc'
    )
        .then((res: any) => {
            console.debug(`decrypted AES response - ${res}`);
        })
        .catch((err) => {
            console.error("Error in AES payload decryption:", err);
        });
};
