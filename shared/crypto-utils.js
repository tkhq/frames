/**
 * Crypto Utilities - Shared
 * Contains HPKE encryption and decryption functions
 */

import {
  p256JWKPrivateToPublic,
  additionalAssociatedData,
  uint8arrayToHexString,
} from "./turnkey-core.js";
import {
  CipherSuite,
  DhkemP256HkdfSha256,
  HkdfSha256,
  Aes256Gcm,
} from "@hpke/core";

// Pre-compute const (for perf)
const TURNKEY_HPKE_INFO = new TextEncoder().encode("turnkey_hpke");

/**
 * Decrypt the ciphertext (ArrayBuffer) given an encapsulation key (ArrayBuffer)
 * and the receivers private key (JSON Web Key).
 */
export async function HpkeDecrypt({
  ciphertextBuf,
  encappedKeyBuf,
  receiverPrivJwk,
}) {
  const kemContext = new DhkemP256HkdfSha256();
  var receiverPriv = await kemContext.importKey(
    "jwk",
    { ...receiverPrivJwk },
    false
  );

  var suite = new CipherSuite({
    kem: kemContext,
    kdf: new HkdfSha256(),
    aead: new Aes256Gcm(),
  });

  var recipientCtx = await suite.createRecipientContext({
    recipientKey: receiverPriv,
    enc: encappedKeyBuf,
    info: TURNKEY_HPKE_INFO,
  });

  var receiverPubBuf = await p256JWKPrivateToPublic(receiverPrivJwk);
  var aad = additionalAssociatedData(encappedKeyBuf, receiverPubBuf);
  var res;
  try {
    res = await recipientCtx.open(ciphertextBuf, aad);
  } catch (e) {
    throw new Error(
      "unable to decrypt bundle using embedded key. the bundle may be incorrect. failed with error: " +
        e.toString()
    );
  }
  return res;
}

/**
 * Encrypt plaintext using HPKE with the receiver's public key.
 * @param {Object} params
 * @param {Uint8Array} params.plaintextBuf - Plaintext to encrypt
 * @param {JsonWebKey} params.receiverPubJwk - Receiver's public key in JWK format
 * @returns {Promise<string>} JSON stringified encrypted bundle with encappedPublic and ciphertext
 */
export async function HpkeEncrypt({ plaintextBuf, receiverPubJwk }) {
  const kemContext = new DhkemP256HkdfSha256();
  const receiverPub = await kemContext.importKey(
    "jwk",
    { ...receiverPubJwk },
    true
  );

  const suite = new CipherSuite({
    kem: kemContext,
    kdf: new HkdfSha256(),
    aead: new Aes256Gcm(),
  });

  const senderCtx = await suite.createSenderContext({
    recipientPublicKey: receiverPub,
    info: TURNKEY_HPKE_INFO,
  });

  // Need to import the key again as a JWK to export as a raw key, the format needed to
  // create the aad with the newly generated raw encapped key.
  const receiverPubCryptoKey = await crypto.subtle.importKey(
    "jwk",
    receiverPubJwk,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    []
  );
  const receiverPubRaw = await crypto.subtle.exportKey(
    "raw",
    receiverPubCryptoKey
  );
  const receiverPubBuf = new Uint8Array(receiverPubRaw);

  const encappedKeyBuf = new Uint8Array(senderCtx.enc);

  const aad = additionalAssociatedData(encappedKeyBuf, receiverPubBuf);

  var ciphertextBuf;
  try {
    ciphertextBuf = await senderCtx.seal(plaintextBuf, aad);
  } catch (e) {
    throw new Error("failed to encrypt import bundle: " + e.toString());
  }

  const ciphertextHex = uint8arrayToHexString(new Uint8Array(ciphertextBuf));
  const encappedKeyBufHex = uint8arrayToHexString(encappedKeyBuf);
  const encryptedBundle = JSON.stringify({
    encappedPublic: encappedKeyBufHex,
    ciphertext: ciphertextHex,
  });
  return encryptedBundle;
}
