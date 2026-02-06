import "./styles.css";
import * as SharedTKHQ from "@shared/turnkey-core.js";
import * as nobleEd25519 from "@noble/ed25519";
import * as nobleHashes from "@noble/hashes"
import { sha512 } from "@noble/hashes/sha2.js";

const {
  getSettings,
  setSettings,
  sendMessageUp,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  base58Decode,
  base58Encode,
  base58CheckEncode,
  encodeKey,
  setParentFrameMessageChannelPort,
  normalizePadding,
  fromDerSignature,
  additionalAssociatedData,
  verifyEnclaveSignature,
  validateStyles,
  p256JWKPrivateToPublic,
  setItemWithExpiry,
  onResetEmbeddedKey,
  setEmbeddedKey,
  getEmbeddedKey,
  generateTargetKey,
  initEmbeddedKey,
  logMessage,
} = SharedTKHQ;

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

    if (validStyles.backgroundColor) {
      // Apply background color to document and body as well.
      document.documentElement.style.backgroundColor =
        validStyles.backgroundColor;
      document.body.style.backgroundColor = validStyles.backgroundColor;
    }

    validSettings["styles"] = validStyles;
  }

  return JSON.stringify(validSettings);
}

/**
 * Returns the public key bytes for a hex-encoded Ed25519 private key.
 * @param {string} privateKeyHex
 */
function getEd25519PublicKey(privateKeyHex) {
  nobleEd25519.etc.sha512Sync = (...m) =>
    sha512(nobleEd25519.etc.concatBytes(...m));

  return nobleEd25519.getPublicKey(privateKeyHex);
}

/**
 * Returns a UTF-8 encoded wallet mnemonic + newline optional passphrase
 * from wallet bytes.
 * @param {Uint8Array} walletBytes
 */
function encodeWallet(walletBytes) {
  const decoder = new TextDecoder("utf-8");
  const wallet = decoder.decode(walletBytes);
  let mnemonic;
  let passphrase = null;

  if (wallet.includes("\n")) {
    const parts = wallet.split("\n");
    mnemonic = parts[0];
    passphrase = parts[1];
  } else {
    mnemonic = wallet;
  }

  return {
    mnemonic: mnemonic,
    passphrase: passphrase,
  };
}

/**
 * Get an item from localStorage. Returns `null` and
 * removes the item from localStorage if expired or
 * expiry time is missing.
 * @param {string} key
 */
function getItemWithExpiry(key) {
  const itemStr = window.localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  if (!item.hasOwnProperty("expiry") || !item.hasOwnProperty("value")) {
    window.localStorage.removeItem(key);
    return null;
  }
  const now = new Date();
  if (now.getTime() > item.expiry) {
    window.localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

export {
  initEmbeddedKey,
  generateTargetKey,
  setItemWithExpiry,
  getEmbeddedKey,
  setEmbeddedKey,
  onResetEmbeddedKey,
  p256JWKPrivateToPublic,
  base58Encode,
  base58Decode,
  base58CheckEncode,
  encodeKey,
  sendMessageUp,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  setParentFrameMessageChannelPort,
  normalizePadding,
  fromDerSignature,
  additionalAssociatedData,
  verifyEnclaveSignature,
  validateStyles,
  getSettings,
  setSettings,
  logMessage,
  getItemWithExpiry,
  getEd25519PublicKey,
  applySettings,
  encodeWallet,
};
