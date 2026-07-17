export function setCryptoProvider(cryptoProvider: any): void;
export function getSubtleCrypto(): any;
export function isDoublyIframed(): boolean;
export function loadQuorumKey(quorumPublic: any): Promise<any>;
export function loadTargetKey(targetPublic: any): Promise<any>;
/**
 * Creates a new public/private key pair and persists it in localStorage
 */
export function initEmbeddedKey(): Promise<void>;
export function generateTargetKey(): Promise<any>;
/**
 * Gets the current embedded private key JWK. Returns `null` if not found.
 */
export function getEmbeddedKey(): any;
/**
 * Sets the embedded private key JWK with the default expiration time.
 * @param {JsonWebKey} targetKey
 */
export function setEmbeddedKey(targetKey: JsonWebKey): void;
/**
 * Gets the current target embedded private key JWK. Returns `null` if not found.
 */
export function getTargetEmbeddedKey(): any;
/**
 * Sets the target embedded public key JWK.
 * @param {JsonWebKey} targetKey
 */
export function setTargetEmbeddedKey(targetKey: JsonWebKey): void;
/**
 * Resets the current embedded private key JWK.
 */
export function onResetEmbeddedKey(): void;
/**
 * Resets the current target embedded private key JWK.
 */
export function resetTargetEmbeddedKey(): void;
export function setParentFrameMessageChannelPort(port: any): void;
/**
 * Gets the current settings.
 */
export function getSettings(): any;
/**
 * Sets the settings object.
 * @param {Object} settings
 */
export function setSettings(settings: any): void;
/**
 * Set an item in localStorage with an expiration time
 * @param {string} key
 * @param {string} value
 * @param {number} ttl expiration time in milliseconds
 */
export function setItemWithExpiry(key: string, value: string, ttl: number): void;
/**
 * Get an item from localStorage. Returns `null` and
 * removes the item from localStorage if expired or
 * expiry time is missing.
 * @param {string} key
 */
export function getItemWithExpiry(key: string): any;
/**
 * Takes a hex string (e.g. "e4567ab" or "0xe4567ab") and returns an array buffer (Uint8Array)
 * @param {string} hexString - Hex string with or without "0x" prefix
 * @returns {Uint8Array<ArrayBuffer>}
 */
export function uint8arrayFromHexString(hexString: string): any;
/**
 * Takes a Uint8Array and returns a hex string
 * @param {Uint8Array} buffer
 * @return {string}
 */
export function uint8arrayToHexString(buffer: Uint8Array): string;
/**
 * Function to normalize padding of byte array with 0's to a target length
 */
export function normalizePadding(byteArray: any, targetLength: any): any;
/**
 * Additional Associated Data (AAD) in the format dictated by the enclave_encrypt crate.
 */
export function additionalAssociatedData(senderPubBuf: any, receiverPubBuf: any): Uint8Array;
/**
 * Converts an ASN.1 DER-encoded ECDSA signature to the raw format that WebCrypto uses.
 *
 * @param {string} derSignature - The DER-encoded signature as a hexadecimal string.
 * @returns {Uint8Array<ArrayBuffer>} - The raw signature as a Uint8Array.
 */
export function fromDerSignature(derSignature: string): any;
/**
 * Function to verify enclave signature on import bundle received from the server.
 * @param {string | null} enclaveQuorumPublic uncompressed public key for the quorum key which produced the signature
 * @param {string} publicSignature signature bytes encoded as a hexadecimal string
 * @param {string} signedData signed bytes encoded as a hexadecimal string. This could be public key bytes directly, or JSON-encoded bytes
 */
export function verifyEnclaveSignature(enclaveQuorumPublic: string | null, publicSignature: string, signedData: string): Promise<any>;
/**
 * Function to send a message.
 *
 * If this page is embedded as an iframe we'll send a postMessage
 * in one of two ways depending on the version of @turnkey/iframe-stamper:
 *   1. newer versions (>=v2.1.0) pass a MessageChannel MessagePort from the parent frame for postMessages.
 *   2. older versions (<v2.1.0) still use the contentWindow so we will postMessage to the window.parent for backwards compatibility.
 *
 * Otherwise we'll display it in the DOM.
 * @param type message type. Can be "PUBLIC_KEY_CREATED" or "BUNDLE_INJECTED"
 * @param value message value
 * @param requestId serves as an idempotency key to match incoming requests. Backwards compatible: if not provided, it isn't passed in.
 */
export function sendMessageUp(type: any, value: any, requestId: any): void;
/**
 * Function to log a message and persist it in the page's DOM.
 */
export function logMessage(content: any): void;
/**
 * Convert a JSON Web Key private key to a public key and export the public
 * key in raw format.
 * @return {Uint8array}
 */
export function p256JWKPrivateToPublic(jwkPrivate: any): Uint8array;
/**
 * Encodes a buffer into a base58-encoded string.
 * @param {Uint8Array} bytes The buffer to encode.
 * @return {string} The base58-encoded string.
 */
export function base58Encode(bytes: Uint8Array): string;
/**
 * Decodes a base58-encoded string into a buffer
 * This function throws an error when the string contains invalid characters.
 * @param {string} s The base58-encoded string.
 * @return {Uint8Array} The decoded buffer.
 */
export function base58Decode(s: string): Uint8Array;
/**
 * Decodes a base58check-encoded string and verifies the checksum.
 * Base58Check encoding includes a 4-byte checksum at the end to detect errors.
 * The checksum is the first 4 bytes of SHA256(SHA256(payload)).
 * This function throws an error if the checksum is invalid.
 * @param {string} s The base58check-encoded string.
 * @return {Promise<Uint8Array>} The decoded payload (without checksum).
 */
export function base58CheckDecode(s: string): Promise<Uint8Array>;
/**
 * Returns private key bytes from a private key, represented in
 * the encoding and format specified by `keyFormat`. Defaults to
 * hex-encoding if `keyFormat` isn't passed.
 * @param {string} privateKey
 * @param {string} [keyFormat] Can be "HEXADECIMAL", "SUI_BECH32", "BITCOIN_MAINNET_WIF", "BITCOIN_TESTNET_WIF" or "SOLANA"
 * @return {Promise<Uint8Array>}
 */
export function decodeKey(privateKey: string, keyFormat?: string): Promise<Uint8Array>;
/**
 * Returns a private key from private key bytes, represented in
 * the encoding and format specified by `keyFormat`. Defaults to
 * hex-encoding if `keyFormat` isn't passed.
 * @param {Uint8Array} privateKeyBytes
 * @param {string} [keyFormat] Can be "HEXADECIMAL" or "SOLANA"
 * @param {Uint8Array} [publicKeyBytes] Required if keyFormat is "SOLANA"
 * @return {string}
 */
export function encodeKey(privateKeyBytes: Uint8Array, keyFormat?: string, publicKeyBytes?: Uint8Array): string;
/**
 * Helper to parse a private key into a Solana base58 private key.
 * To be used if a wallet account is exported without the `SOLANA` address format.
 *
 * @param {string | Array<number>} privateKey
 * @returns {Uint8Array}
 */
export function parsePrivateKey(privateKey: string | Array<number>): Uint8Array;
/**
 * Function to validate and sanitize the styles object using the accepted map of style keys and values (as regular expressions).
 * Any invalid style throws an error. Returns an object of valid styles.
 * @param {Object} styles
 * @return {Object}
 */
export function validateStyles(styles: any): any;
//# sourceMappingURL=turnkey-core.d.ts.map