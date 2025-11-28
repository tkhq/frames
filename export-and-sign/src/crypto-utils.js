import { TKHQ } from "./turnkey-core.js";
import {
  CipherSuite,
  DhkemP256HkdfSha256,
  HkdfSha256,
  Aes256Gcm,
} from "@hpke/core";

// Pre-compute constant values for performance
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

  var receiverPubBuf = await TKHQ.p256JWKPrivateToPublic(receiverPrivJwk);
  var aad = TKHQ.additionalAssociatedData(encappedKeyBuf, receiverPubBuf);
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
