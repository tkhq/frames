/**
 * Turnkey Core Module - Export-and-Sign Frame
 * Imports shared core functionality and adds frame-specific features
 */

import * as nobleEd25519 from "@noble/ed25519";
import * as nobleHashes from "@noble/hashes/sha512";
import { fromDerSignature } from "@turnkey/crypto";
import * as SharedTKHQ from "@shared/turnkey-core.js";

// Re-export shared functions
const {
  initEmbeddedKey: sharedInitEmbeddedKey,
  generateTargetKey,
  setItemWithExpiry,
  getItemWithExpiry,
  getEmbeddedKey,
  setEmbeddedKey,
  onResetEmbeddedKey,
  p256JWKPrivateToPublic,
  base58Encode,
  base58Decode,
  encodeKey,
  sendMessageUp,
  logMessage,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  setParentFrameMessageChannelPort,
  normalizePadding,
  additionalAssociatedData,
  verifyEnclaveSignature: sharedVerifyEnclaveSignature,
  getSettings,
  setSettings,
  parsePrivateKey,
  validateStyles: sharedValidateStyles,
  isDoublyIframed,
  loadQuorumKey,
} = SharedTKHQ;

// Frame-specific: use shared initEmbeddedKey but with frame-specific check
async function initEmbeddedKey() {
  if (isDoublyIframed()) {
    throw new Error("Doubly iframed");
  }
  return await sharedInitEmbeddedKey();
}

// Frame-specific: verifyEnclaveSignature that uses fromDerSignature from @turnkey/crypto
async function verifyEnclaveSignature(
  enclaveQuorumPublic,
  publicSignature,
  signedData
) {
  /** Turnkey Signer enclave's public keys */
  const TURNKEY_SIGNERS_ENCLAVES = {
    prod: "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
    preprod:
      "04f3422b8afbe425d6ece77b8d2469954715a2ff273ab7ac89f1ed70e0a9325eaa1698b4351fd1b23734e65c0b6a86b62dd49d70b37c94606aac402cbd84353212",
  };

  // Read environment from meta tag (templated at deploy time), fall back to window variable (for testing)
  let environment = null;
  if (typeof document !== "undefined") {
    const meta = document.querySelector(
      'meta[name="turnkey-signer-environment"]'
    );
    if (
      meta &&
      meta.content &&
      meta.content !== "__TURNKEY_SIGNER_ENVIRONMENT__"
    ) {
      environment = meta.content;
    }
  }
  if (!environment && typeof window !== "undefined") {
    environment = window.__TURNKEY_SIGNER_ENVIRONMENT__;
  }
  const TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY =
    TURNKEY_SIGNERS_ENCLAVES[environment];

  if (TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY === undefined) {
    throw new Error(
      `Configuration error: TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY is undefined`
    );
  }

  if (enclaveQuorumPublic !== TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY) {
    throw new Error(
      `enclave quorum public keys from client and bundle do not match. Client: ${TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY}. Bundle: ${enclaveQuorumPublic}.`
    );
  }

  const encryptionQuorumPublicBuf = new Uint8Array(
    uint8arrayFromHexString(TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY)
  );
  const quorumKey = await loadQuorumKey(encryptionQuorumPublicBuf);
  if (!quorumKey) {
    throw new Error("failed to load quorum key");
  }

  // The ECDSA signature is ASN.1 DER encoded but WebCrypto uses raw format
  const publicSignatureBuf = fromDerSignature(publicSignature);
  const signedDataBuf = uint8arrayFromHexString(signedData);
  return await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    quorumKey,
    publicSignatureBuf,
    signedDataBuf
  );
}

// Frame-specific: validateStyles wrapper (export-and-sign doesn't use labelColor)
function validateStyles(styles) {
  return sharedValidateStyles(styles);
}

/**
 * Returns the public key bytes for a hex-encoded Ed25519 private key.
 * Frame-specific function for export-and-sign.
 * @param {string} privateKeyHex
 */
function getEd25519PublicKey(privateKeyHex) {
  nobleEd25519.etc.sha512Sync = (...m) =>
    nobleHashes.sha512(nobleEd25519.etc.concatBytes(...m));
  return nobleEd25519.getPublicKey(privateKeyHex);
}

/**
 * Function to apply settings on this page. For now, the only settings that can be applied
 * are for "styles". Upon successful application, return the valid, sanitized settings JSON string.
 * Frame-specific implementation for export-and-sign (applies to "key-div" element).
 * @param {string} settings
 * @return {string}
 */
function applySettings(settings) {
  const validSettings = {};
  if (!settings) {
    return JSON.stringify(validSettings);
  }
  const settingsObj = JSON.parse(settings);
  if (settingsObj.styles) {
    // Valid styles will be applied the "key-div" div HTML element.
    const keyDivTextarea = document.getElementById("key-div");
    if (!keyDivTextarea) {
      throw new Error("no key-div HTML element found to apply settings to.");
    }

    // Validate, sanitize, and apply the styles to the "key-div" div element.
    const validStyles = validateStyles(settingsObj.styles);
    Object.entries(validStyles).forEach(([key, value]) => {
      keyDivTextarea.style[key] = value;
    });

    validSettings["styles"] = validStyles;
  }

  return JSON.stringify(validSettings);
}

export const TKHQ = {
  initEmbeddedKey,
  generateTargetKey,
  setItemWithExpiry,
  getItemWithExpiry,
  getEmbeddedKey,
  setEmbeddedKey,
  onResetEmbeddedKey,
  p256JWKPrivateToPublic,
  base58Encode,
  base58Decode,
  encodeKey,
  sendMessageUp,
  logMessage,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  setParentFrameMessageChannelPort,
  normalizePadding,
  fromDerSignature,
  additionalAssociatedData,
  verifyEnclaveSignature,
  getEd25519PublicKey,
  applySettings,
  validateStyles,
  getSettings,
  setSettings,
  parsePrivateKey,
};
