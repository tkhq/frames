import * as nobleEd25519 from "@noble/ed25519";
import * as nobleHashes from "@noble/hashes/sha512";
import { fromDerSignature } from "@turnkey/crypto";
import * as SharedTKHQ from "@turnkey/frames-shared";

const {
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
  additionalAssociatedData,
  getSettings,
  setSettings,
  parsePrivateKey,
  unsafeSkipDoubleIframeCheck,
  validateStyles,
  verifyEnclaveSignature,
} = SharedTKHQ;

/**
 * Returns the public key bytes for a hex-encoded Ed25519 private key.
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
  unsafeSkipDoubleIframeCheck,
};
