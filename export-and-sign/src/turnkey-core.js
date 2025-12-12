/**
 * Turnkey Core Module
 * Contains all the core cryptographic and utility functions
 */

import * as nobleEd25519 from "@noble/ed25519";
import * as nobleHashes from "@noble/hashes/sha512";
import { fromDerSignature } from "@turnkey/crypto";

/** constant for LocalStorage */
const TURNKEY_EMBEDDED_KEY = "TURNKEY_EMBEDDED_KEY";
const TURNKEY_SETTINGS = "TURNKEY_SETTINGS";
/** 48 hours in milliseconds */
const TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS = 1000 * 60 * 60 * 48;
const TURNKEY_EMBEDDED_KEY_ORIGIN = "TURNKEY_EMBEDDED_KEY_ORIGIN";

let parentFrameMessageChannelPort = null;

/* Security functions */

function isDoublyIframed() {
  if (window.location.ancestorOrigins !== undefined) {
    // Does not exist in IE and firefox.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Location/ancestorOrigins for how this works
    return window.location.ancestorOrigins.length > 1;
  } else {
    return window.parent !== window.top;
  }
}

// Helper to parse a private key into a Solana base58 private key.
// To be used if a wallet account is exported without the `SOLANA` address format.
function parsePrivateKey(privateKey) {
  if (Array.isArray(privateKey)) {
    return new Uint8Array(privateKey);
  }

  if (typeof privateKey === "string") {
    // Remove 0x prefix if present
    if (privateKey.startsWith("0x")) {
      privateKey = privateKey.slice(2);
    }

    // Check if it's hex-formatted correctly (i.e. 64 hex chars)
    if (privateKey.length === 64 && /^[0-9a-fA-F]+$/.test(privateKey)) {
      return uint8arrayFromHexString(privateKey);
    }

    // Otherwise assume it's base58 format (for Solana)
    try {
      return base58Decode(privateKey);
    } catch (error) {
      throw new Error(
        "Invalid private key format. Use hex (64 chars) or base58 format."
      );
    }
  }

  throw new Error("Private key must be a string (hex/base58) or number array");
}

/*
 * Loads the quorum public key as a CryptoKey.
 */
async function loadQuorumKey(quorumPublic) {
  return await crypto.subtle.importKey(
    "raw",
    quorumPublic,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"]
  );
}

/**
 * Creates a new public/private key pair and persists it in localStorage
 */
async function initEmbeddedKey() {
  if (isDoublyIframed()) {
    throw new Error("Doubly iframed");
  }
  const retrievedKey = await getEmbeddedKey();
  if (retrievedKey === null) {
    const targetKey = await generateTargetKey();
    setEmbeddedKey(targetKey);
  }
  // Nothing to do, key is correctly initialized!
}

/*
 * Generate a key to encrypt to and export it as a JSON Web Key.
 */
async function generateTargetKey() {
  const p256key = await crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveBits"]
  );

  return await crypto.subtle.exportKey("jwk", p256key.privateKey);
}

/**
 * Gets the current embedded private key JWK. Returns `null` if not found.
 */
function getEmbeddedKey() {
  const jwtKey = getItemWithExpiry(TURNKEY_EMBEDDED_KEY);
  return jwtKey ? JSON.parse(jwtKey) : null;
}

/**
 * Sets the embedded private key JWK with the default expiration time.
 * @param {JsonWebKey} targetKey
 */
function setEmbeddedKey(targetKey) {
  setItemWithExpiry(
    TURNKEY_EMBEDDED_KEY,
    JSON.stringify(targetKey),
    TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS
  );
}

function setParentFrameMessageChannelPort(port) {
  parentFrameMessageChannelPort = port;
}

/**
 * Resets the current embedded private key JWK.
 */
function onResetEmbeddedKey() {
  window.localStorage.removeItem(TURNKEY_EMBEDDED_KEY);
  window.localStorage.removeItem(TURNKEY_EMBEDDED_KEY_ORIGIN);
}

/**
 * Gets the current settings.
 */
function getSettings() {
  const settings = window.localStorage.getItem(TURNKEY_SETTINGS);
  return settings ? JSON.parse(settings) : null;
}

/**
 * Sets the settings object.
 * @param {Object} settings
 */
function setSettings(settings) {
  window.localStorage.setItem(TURNKEY_SETTINGS, JSON.stringify(settings));
}

/**
 * Set an item in localStorage with an expiration time
 * @param {string} key
 * @param {string} value
 * @param {number} ttl expiration time in milliseconds
 */
function setItemWithExpiry(key, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  window.localStorage.setItem(key, JSON.stringify(item));
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

/**
 * Takes a hex string (e.g. "e4567ab" or "0xe4567ab") and returns an array buffer (Uint8Array)
 * @param {string} hexString - Hex string with or without "0x" prefix
 * @returns {Uint8Array}
 */
function uint8arrayFromHexString(hexString) {
  if (!hexString || typeof hexString !== "string") {
    throw new Error("cannot create uint8array from invalid hex string");
  }

  // Remove 0x prefix if present
  const hexWithoutPrefix =
    hexString.startsWith("0x") || hexString.startsWith("0X")
      ? hexString.slice(2)
      : hexString;

  var hexRegex = /^[0-9A-Fa-f]+$/;
  if (hexWithoutPrefix.length % 2 != 0 || !hexRegex.test(hexWithoutPrefix)) {
    throw new Error("cannot create uint8array from invalid hex string");
  }
  return new Uint8Array(
    hexWithoutPrefix.match(/../g).map((h) => parseInt(h, 16))
  );
}

/**
 * Takes a Uint8Array and returns a hex string
 * @param {Uint8Array} buffer
 * @return {string}
 */
function uint8arrayToHexString(buffer) {
  return [...buffer].map((x) => x.toString(16).padStart(2, "0")).join("");
}

/**
 * Function to normalize padding of byte array with 0's to a target length
 */
function normalizePadding(byteArray, targetLength) {
  const paddingLength = targetLength - byteArray.length;

  // Add leading 0's to array
  if (paddingLength > 0) {
    const padding = new Uint8Array(paddingLength).fill(0);
    return new Uint8Array([...padding, ...byteArray]);
  }

  // Remove leading 0's from array
  if (paddingLength < 0) {
    const expectedZeroCount = paddingLength * -1;
    let zeroCount = 0;
    for (let i = 0; i < expectedZeroCount && i < byteArray.length; i++) {
      if (byteArray[i] === 0) {
        zeroCount++;
      }
    }
    // Check if the number of zeros found equals the number of zeroes expected
    if (zeroCount !== expectedZeroCount) {
      throw new Error(
        `invalid number of starting zeroes. Expected number of zeroes: ${expectedZeroCount}. Found: ${zeroCount}.`
      );
    }
    return byteArray.slice(expectedZeroCount, expectedZeroCount + targetLength);
  }
  return byteArray;
}

/**
 * Additional Associated Data (AAD) in the format dictated by the enclave_encrypt crate.
 */
function additionalAssociatedData(senderPubBuf, receiverPubBuf) {
  const s = Array.from(new Uint8Array(senderPubBuf));
  const r = Array.from(new Uint8Array(receiverPubBuf));
  return new Uint8Array([...s, ...r]);
}

/**
 * Function to verify enclave signature on import bundle received from the server.
 * @param {string} enclaveQuorumPublic uncompressed public key for the quorum key which produced the signature
 * @param {string} publicSignature signature bytes encoded as a hexadecimal string
 * @param {string} signedData signed bytes encoded as a hexadecimal string. This could be public key bytes directly, or JSON-encoded bytes
 */
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

  // Use window.__TURNKEY_SIGNER_ENVIRONMENT__ if available (for testing), otherwise use the webpack replacement
  const environment =
    (typeof window !== "undefined" && window.__TURNKEY_SIGNER_ENVIRONMENT__) ||
    "__TURNKEY_SIGNER_ENVIRONMENT__";
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
function sendMessageUp(type, value, requestId) {
  const message = {
    type: type,
    value: value,
  };

  // Only include requestId if it was provided
  if (requestId) {
    message.requestId = requestId;
  }

  if (parentFrameMessageChannelPort) {
    parentFrameMessageChannelPort.postMessage(message);
  } else if (window.parent !== window) {
    window.parent.postMessage(
      {
        type: type,
        value: value,
      },
      "*"
    );
  }
  logMessage(`⬆️ Sent message ${type}: ${value}`);
}

/**
 * Function to log a message and persist it in the page's DOM.
 */
function logMessage(content) {
  const messageLog = document.getElementById("message-log");
  const message = document.createElement("p");
  message.innerText = content;
  messageLog.appendChild(message);
}

/**
 * Convert a JSON Web Key private key to a public key and export the public
 * key in raw format.
 * @return {Uint8array}
 */
async function p256JWKPrivateToPublic(jwkPrivate) {
  // make a copy so we don't modify the underlying object
  const jwkPrivateCopy = { ...jwkPrivate };
  // change jwk so it will be imported as a public key
  delete jwkPrivateCopy.d;
  jwkPrivateCopy.key_ops = ["verify"];

  const publicKey = await window.crypto.subtle.importKey(
    "jwk",
    jwkPrivateCopy,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"]
  );
  const buffer = await crypto.subtle.exportKey("raw", publicKey);
  return new Uint8Array(buffer);
}

/**
 * Encodes a buffer into a base58-encoded string.
 * @param {Uint8Array} bytes The buffer to encode.
 * @return {string} The base58-encoded string.
 */
function base58Encode(bytes) {
  // See https://en.bitcoin.it/wiki/Base58Check_encoding
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "";
  let digits = [0];
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; ++j) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }

    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  // Convert digits to a base58 string
  for (let k = 0; k < digits.length; k++) {
    result = alphabet[digits[k]] + result;
  }

  // Add '1' for each leading 0 byte
  for (let i = 0; bytes[i] === 0 && i < bytes.length - 1; i++) {
    result = "1" + result;
  }
  return result;
}

/**
 * Decodes a base58-encoded string into a buffer
 * This function throws an error when the string contains invalid characters.
 * @param {string} s The base58-encoded string.
 * @return {Uint8Array} The decoded buffer.
 */
function base58Decode(s) {
  // See https://en.bitcoin.it/wiki/Base58Check_encoding
  var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  var decoded = BigInt(0);
  var decodedBytes = [];
  var leadingZeros = [];
  for (var i = 0; i < s.length; i++) {
    if (alphabet.indexOf(s[i]) === -1) {
      throw new Error(`cannot base58-decode: ${s[i]} isn't a valid character`);
    }
    var carry = alphabet.indexOf(s[i]);

    // If the current base58 digit is 0, append a 0 byte.
    // "i == leadingZeros.length" can only be true if we have not seen non-zero bytes so far.
    // If we had seen a non-zero byte, carry wouldn't be 0, and i would be strictly more than `leadingZeros.length`
    if (carry == 0 && i === leadingZeros.length) {
      leadingZeros.push(0);
    }

    var j = 0;
    while (j < decodedBytes.length || carry > 0) {
      var currentByte = decodedBytes[j];

      // shift the current byte 58 units and add the carry amount
      // (or just add the carry amount if this is a new byte -- undefined case)
      if (currentByte === undefined) {
        currentByte = carry;
      } else {
        currentByte = currentByte * 58 + carry;
      }

      // find the new carry amount (1-byte shift of current byte value)
      carry = currentByte >> 8;
      // reset the current byte to the remainder (the carry amount will pass on the overflow)
      decodedBytes[j] = currentByte % 256;
      j++;
    }
  }

  var result = leadingZeros.concat(decodedBytes.reverse());
  return new Uint8Array(result);
}

/**
 * Returns a private key from private key bytes, represented in
 * the encoding and format specified by `keyFormat`. Defaults to
 * hex-encoding if `keyFormat` isn't passed.
 * @param {Uint8Array} privateKeyBytes
 * @param {string} keyFormat Can be "HEXADECIMAL" or "SOLANA"
 */
async function encodeKey(privateKeyBytes, keyFormat, publicKeyBytes) {
  switch (keyFormat) {
    case "SOLANA":
      if (!publicKeyBytes) {
        throw new Error("public key must be specified for SOLANA key format");
      }
      if (privateKeyBytes.length !== 32) {
        throw new Error(
          `invalid private key length. Expected 32 bytes. Got ${privateKeyBytes.length}.`
        );
      }
      if (publicKeyBytes.length !== 32) {
        throw new Error(
          `invalid public key length. Expected 32 bytes. Got ${publicKeyBytes.length}.`
        );
      }
      const concatenatedBytes = new Uint8Array(64);
      concatenatedBytes.set(privateKeyBytes, 0);
      concatenatedBytes.set(publicKeyBytes, 32);
      return base58Encode(concatenatedBytes);
    case "HEXADECIMAL":
      return "0x" + uint8arrayToHexString(privateKeyBytes);
    default:
      console.warn(
        `invalid key format: ${keyFormat}. Defaulting to HEXADECIMAL.`
      );
      return "0x" + uint8arrayToHexString(privateKeyBytes);
  }
}

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
 * Function to validate and sanitize the styles object using the accepted map of style keys and values (as regular expressions).
 * Any invalid style throws an error. Returns an object of valid styles.
 * @param {Object} styles
 * @return {Object}
 */
function validateStyles(styles, element) {
  const validStyles = {};

  const cssValidationRegex = {
    padding: "^(\\d+(px|em|%|rem) ?){1,4}$",
    margin: "^(\\d+(px|em|%|rem) ?){1,4}$",
    borderWidth: "^(\\d+(px|em|rem) ?){1,4}$",
    borderStyle:
      "^(none|solid|dashed|dotted|double|groove|ridge|inset|outset)$",
    borderColor:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    borderRadius: "^(\\d+(px|em|%|rem) ?){1,4}$",
    fontSize: "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax))$",
    fontWeight: "^(normal|bold|bolder|lighter|\\d{3})$",
    fontFamily: '^[^";<>]*$', // checks for the absence of some characters that could lead to CSS/HTML injection
    color:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    backgroundColor:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    width: "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|auto)$",
    height: "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|auto)$",
    maxWidth: "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|none)$",
    maxHeight:
      "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|none)$",
    lineHeight:
      "^(\\d+(\\.\\d+)?(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|normal)$",
    boxShadow:
      "^(none|(\\d+(px|em|rem) ?){2,4} (#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)) ?(inset)?)$",
    textAlign: "^(left|right|center|justify|initial|inherit)$",
    overflowWrap: "^(normal|break-word|anywhere)$",
    wordWrap: "^(normal|break-word)$",
    resize: "^(none|both|horizontal|vertical|block|inline)$",
  };

  Object.entries(styles).forEach(([property, value]) => {
    const styleProperty = property.trim();
    if (styleProperty.length === 0) {
      throw new Error("css style property cannot be empty");
    }
    const styleRegexStr = cssValidationRegex[styleProperty];
    if (!styleRegexStr) {
      throw new Error(
        `invalid or unsupported css style property: "${styleProperty}"`
      );
    }
    const styleRegex = new RegExp(styleRegexStr);
    const styleValue = value.trim();
    if (styleValue.length == 0) {
      throw new Error(`css style for "${styleProperty}" is empty`);
    }
    const isValidStyle = styleRegex.test(styleValue);
    if (!isValidStyle) {
      throw new Error(
        `invalid css style value for property "${styleProperty}"`
      );
    }
    validStyles[styleProperty] = styleValue;
  });

  return validStyles;
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
};
