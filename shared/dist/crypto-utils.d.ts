/**
 * Decrypt the ciphertext (ArrayBuffer) given an encapsulation key (ArrayBuffer)
 * and the receivers private key (JSON Web Key).
 */
export function HpkeDecrypt({ ciphertextBuf, encappedKeyBuf, receiverPrivJwk, }: {
    ciphertextBuf: any;
    encappedKeyBuf: any;
    receiverPrivJwk: any;
}): Promise<ArrayBuffer>;
/**
 * Encrypt plaintext using HPKE with the receiver's public key.
 * @param {Object} params
 * @param {Uint8Array} params.plaintextBuf - Plaintext to encrypt
 * @param {JsonWebKey} params.receiverPubJwk - Receiver's public key in JWK format
 * @returns {Promise<string>} JSON stringified encrypted bundle with encappedPublic and ciphertext
 */
export function HpkeEncrypt({ plaintextBuf, receiverPubJwk }: {
    plaintextBuf: Uint8Array;
    receiverPubJwk: JsonWebKey;
}): Promise<string>;
//# sourceMappingURL=crypto-utils.d.ts.map