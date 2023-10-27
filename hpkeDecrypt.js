/**
 * Script importing HPKE lib until we can replace it
 */

// TODO: this should be bundled at build time or replaced with code written by Turnkey entirely.
import * as hpke from "https://esm.sh/@hpke/core";

/**
 * Decrypt the ciphertext (ArrayBuffer) given an encapsulation key (ArrayBuffer)
 * and the receivers private key (JSON Web Key).
 */
export const HpkeDecrypt = async ({ ciphertextBuf, encappedKeyBuf, receiverPrivJwk }) => {
  const kemContext = new hpke.DhkemP256HkdfSha256();
  var receiverPriv = await kemContext.importKey("jwk", {...receiverPrivJwk}, false);

  var suite = new hpke.CipherSuite({
    kem: kemContext,
    kdf: new hpke.HkdfSha256(),
    aead: new hpke.Aes256Gcm(),
  });

  var recipientCtx = await suite.createRecipientContext({
    recipientKey: receiverPriv,
    enc: encappedKeyBuf,
    info: new TextEncoder().encode("turnkey_hpke"),
  });

  var receiverPubBuf = await TKHQ.p256JWKPrivateToPublic(receiverPrivJwk);
  var aad = TKHQ.additionalAssociatedData(encappedKeyBuf, receiverPubBuf);
  var res;
  try {
    res = await recipientCtx.open(ciphertextBuf, aad);
  } catch (e) {
    throw new Error("decryption failed: " + e);
  }
  return res
}