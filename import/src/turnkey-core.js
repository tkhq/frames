/** constants for LocalStorage */
const TURNKEY_TARGET_EMBEDDED_KEY = "TURNKEY_TARGET_EMBEDDED_KEY";
const TURNKEY_SETTINGS = "TURNKEY_SETTINGS";

var parentFrameMessageChannelPort = null;
var cryptoProviderOverride = null;

/*
 * Returns a reference to the WebCrypto subtle interface regardless of the host environment.
 */
function getSubtleCrypto() {
  if (
    cryptoProviderOverride &&
    cryptoProviderOverride.subtle
  ) {
    return cryptoProviderOverride.subtle;
  }
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    globalThis.crypto.subtle
  ) {
    return globalThis.crypto.subtle;
  }
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.subtle
  ) {
    return window.crypto.subtle;
  }
  if (
    typeof global !== "undefined" &&
    global.crypto &&
    global.crypto.subtle
  ) {
    return global.crypto.subtle;
  }
  if (typeof crypto !== "undefined" && crypto.subtle) {
    return crypto.subtle;
  }

  console.log('global', global.crypto)
  console.log('window', window.crypto)

  return null;
}

/*
 * Allows tests to explicitly set the crypto provider (e.g. crypto.webcrypto) when the runtime
 * environment does not expose one on the global/window objects.
 */
function setCryptoProvider(cryptoProvider) {
  cryptoProviderOverride = cryptoProvider || null;
}

/*
 * Load a key to encrypt to as a CryptoKey and return it as a JSON Web Key.
 */
async function loadTargetKey(targetPublic) {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto subtle API is unavailable");
  }
  const targetKey = await subtle.importKey(
    "raw",
    targetPublic,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );

  return await subtle.exportKey("jwk", targetKey);
}

/*
 * Loads the quorum public key as a CryptoKey.
 */
async function loadQuorumKey(quorumPublic) {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto subtle API is unavailable");
  }
  return await subtle.importKey(
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
 * Gets the current target embedded private key JWK. Returns `null` if not found.
 */
function getTargetEmbeddedKey() {
  const jwtKey = window.localStorage.getItem(
    TURNKEY_TARGET_EMBEDDED_KEY
  );
  return jwtKey ? JSON.parse(jwtKey) : null;
}

/**
 * Sets the target embedded public key JWK.
 * @param {JsonWebKey} targetKey
 */
function setTargetEmbeddedKey(targetKey) {
  window.localStorage.setItem(
    TURNKEY_TARGET_EMBEDDED_KEY,
    JSON.stringify(targetKey)
  );
}

/**
 * Resets the current target embedded private key JWK.
 */
function resetTargetEmbeddedKey() {
  window.localStorage.removeItem(TURNKEY_TARGET_EMBEDDED_KEY);
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
  window.localStorage.setItem(
    TURNKEY_SETTINGS,
    JSON.stringify(settings)
  );
}

/**
 * Takes a hex string (e.g. "e4567ab") and returns an array buffer (Uint8Array)
 * @param {string} hexString
 * @returns {Uint8Array}
 */
function uint8arrayFromHexString(hexString) {
  var hexRegex = /^[0-9A-Fa-f]+$/;
  if (
    !hexString ||
    hexString.length % 2 != 0 ||
    !hexRegex.test(hexString)
  ) {
    throw new Error("cannot create uint8array from invalid hex string");
  }
  return new Uint8Array(
    hexString.match(/../g).map((h) => parseInt(h, 16))
  );
}

/**
 * Takes a Uint8Array and returns a hex string
 * @param {Uint8Array} buffer
 * @return {string}
 */
function uint8arrayToHexString(buffer) {
  return [...buffer]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Decodes a base58-encoded string into a buffer
 * This function throws an error when the string contains invalid characters.
 * @param {string} s The base58-encoded string.
 * @return {Uint8Array} The decoded buffer.
 */
function base58Decode(s) {
  // See https://en.bitcoin.it/wiki/Base58Check_encoding
  var alphabet =
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  var decoded = BigInt(0);
  var decodedBytes = [];
  var leadingZeros = [];
  for (var i = 0; i < s.length; i++) {
    if (alphabet.indexOf(s[i]) === -1) {
      throw new Error(
        `cannot base58-decode: ${s[i]} isn't a valid character`
      );
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
 * Returns private key bytes from a private key, represented in
 * the encoding and format specified by `keyFormat`. Defaults to
 * hex-encoding if `keyFormat` isn't passed.
 * @param {string} privateKey
 * @param {string} keyFormat Can be "HEXADECIMAL" or "SOLANA"
 */
function decodeKey(privateKey, keyFormat) {
  switch (keyFormat) {
    case "SOLANA":
      const decodedKeyBytes = base58Decode(privateKey);
      if (decodedKeyBytes.length !== 64) {
        throw new Error(
          `invalid key length. Expected 64 bytes. Got ${decodedKeyBytes.length()}.`
        );
      }
      return decodedKeyBytes.subarray(0, 32);
    case "HEXADECIMAL":
      if (privateKey.startsWith("0x")) {
        return uint8arrayFromHexString(privateKey.slice(2));
      }
      return uint8arrayFromHexString(privateKey);
    default:
      console.warn(
        `invalid key format: ${keyFormat}. Defaulting to HEXADECIMAL.`
      );
      if (privateKey.startsWith("0x")) {
        return uint8arrayFromHexString(privateKey.slice(2));
      }
      return uint8arrayFromHexString(privateKey);
  }
}

function setParentFrameMessageChannelPort(port) {
  parentFrameMessageChannelPort = port;
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
    for (
      let i = 0;
      i < expectedZeroCount && i < byteArray.length;
      i++
    ) {
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
    return byteArray.slice(
      expectedZeroCount,
      expectedZeroCount + targetLength
    );
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
 * Converts an ASN.1 DER-encoded ECDSA signature to the raw format that WebCrypto uses.
 */
function fromDerSignature(derSignature) {
  const derSignatureBuf = uint8arrayFromHexString(derSignature);

  // Check and skip the sequence tag (0x30)
  let index = 2;

  // Parse 'r' and check for integer tag (0x02)
  if (derSignatureBuf[index] !== 0x02) {
    throw new Error(
      "failed to convert DER-encoded signature: invalid tag for r"
    );
  }
  index++; // Move past the INTEGER tag
  const rLength = derSignatureBuf[index];
  index++; // Move past the length byte
  const r = derSignatureBuf.slice(index, index + rLength);
  index += rLength; // Move to the start of s

  // Parse 's' and check for integer tag (0x02)
  if (derSignatureBuf[index] !== 0x02) {
    throw new Error(
      "failed to convert DER-encoded signature: invalid tag for s"
    );
  }
  index++; // Move past the INTEGER tag
  const sLength = derSignatureBuf[index];
  index++; // Move past the length byte
  const s = derSignatureBuf.slice(index, index + sLength);

  // Normalize 'r' and 's' to 32 bytes each
  const rPadded = normalizePadding(r, 32);
  const sPadded = normalizePadding(s, 32);

  // Concatenate and return the raw signature
  return new Uint8Array([...rPadded, ...sPadded]);
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

  const TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY =
    TURNKEY_SIGNERS_ENCLAVES["${TURNKEY_SIGNER_ENVIRONMENT}"];
  if (TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY === undefined) {
    throw new Error(
      "Configuration error: TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY is undefined"
    );
  }

  // todo(olivia): throw error if enclave quorum public is null once server changes are deployed
  if (enclaveQuorumPublic) {
    if (
      enclaveQuorumPublic !== TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY
    ) {
      throw new Error(
        `enclave quorum public keys from client and bundle do not match. Client: ${TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY}. Bundle: ${enclaveQuorumPublic}.`
      );
    }
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
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto subtle API is unavailable");
  }
  return await subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    quorumKey,
    publicSignatureBuf,
    signedDataBuf
  );
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
    fontSize:
      "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax))$",
    fontWeight: "^(normal|bold|bolder|lighter|\\d{3})$",
    fontFamily: '^[^";<>]*$', // checks for the absence of some characters that could lead to CSS/HTML injection
    color:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    labelColor:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    backgroundColor:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    width:
      "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|auto)$",
    height:
      "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|auto)$",
    maxWidth:
      "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|none)$",
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
  const settingsObj = JSON.parse(settings);

  const passphraseLabel = document.getElementById(
    "passphrase-label"
  );
  const mnemonicLabel = document.getElementById("mnemonic-label");
  const passphraseTextarea = document.getElementById("passphrase");

  if (!passphraseLabel || !passphraseTextarea) {
    throw new Error(
      "no passphrase HTML elements found to apply settings to."
    );
  }
  const plaintextTextarea = document.getElementById("plaintext");
  if (!plaintextTextarea) {
    throw new Error(
      "no plaintext textarea HTML element found to apply settings to."
    );
  }

  // Apply enablePassphrase setting
  if (settingsObj.enablePassphrase === true) {
    passphraseLabel.style.display = "inline-block";
    passphraseTextarea.style.display = "inline-block";
    passphraseTextarea.style.border = "solid 1px #ccc";
    passphraseTextarea.style.borderRadius = "4px";

    mnemonicLabel.style.display = "inline-block";
    plaintextTextarea.style.border = "solid 1px #ccc";
    plaintextTextarea.style.borderRadius = "4px";

    validSettings["enablePassphrase"] = true;
  } else {
    passphraseLabel.style.display = "none";
    passphraseTextarea.style.display = "none";
    mnemonicLabel.style.display = "none";

    plaintextTextarea.style.border = "none";
    validSettings["enablePassphrase"] = false;
  }

  if (settingsObj.styles) {
    // Validate, sanitize, and apply the styles to the "plaintext" textarea.
    const validStyles = validateStyles(settingsObj.styles);
    Object.entries(validStyles).forEach(([key, value]) => {
      plaintextTextarea.style[key] = value;
    });

    if (validStyles.backgroundColor) {
      // Apply background color to document and body as well.
      document.documentElement.style.backgroundColor =
        validStyles.backgroundColor;
      document.body.style.backgroundColor = validStyles.backgroundColor;
    }

    if (validStyles.labelColor) {
      document.getElementById("mnemonic-label").style.color =
        validStyles.labelColor;
    }

    validSettings["styles"] = validStyles;
  }

  if (settingsObj.passphraseStyles) {
    // Validate, sanitize, and apply the styles to the "passphrase" textarea.
    const validStyles = TKHQ.validateStyles(settingsObj.passphraseStyles);
    Object.entries(validStyles).forEach(([key, value]) => {
      passphraseTextarea.style[key] = value;
    });

    if (validStyles.labelColor) {
      document.getElementById("passphrase-label").style.color =
        validStyles.labelColor;
    }

    validSettings["passphraseStyles"] = validStyles;
  }
  
  return JSON.stringify(validSettings);
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
}

export {
  setCryptoProvider,
  loadTargetKey,
  getTargetEmbeddedKey,
  setTargetEmbeddedKey,
  resetTargetEmbeddedKey,
  getSettings,
  setSettings,
  sendMessageUp,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  base58Decode,
  decodeKey,
  setParentFrameMessageChannelPort,
  normalizePadding,
  fromDerSignature,
  additionalAssociatedData,
  verifyEnclaveSignature,
  validateStyles,
  applySettings,
};
