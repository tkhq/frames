import { TKHQ } from './turnkey-core.js';

/**
 * Decrypt the ciphertext (ArrayBuffer) given an encapsulation key (ArrayBuffer)
 * and the receivers private key (JSON Web Key).
 */
export async function HpkeDecrypt({
  ciphertextBuf,
  encappedKeyBuf,
  receiverPrivJwk,
}) {
  const kemContext = new window.hpke.DhkemP256HkdfSha256();
  var receiverPriv = await kemContext.importKey(
    "jwk",
    { ...receiverPrivJwk },
    false
  );

  var suite = new window.hpke.CipherSuite({
    kem: kemContext,
    kdf: new window.hpke.HkdfSha256(),
    aead: new window.hpke.Aes256Gcm(),
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
    throw new Error(
      "unable to decrypt bundle using embedded key. the bundle may be incorrect. failed with error: " +
        e.toString()
    );
  }
  return res;
}
