import * as nobleEd25519 from "@noble/ed25519";
import * as nobleHashes from "@noble/hashes/sha512";
import { fromDerSignature } from "@turnkey/crypto";
import * as SharedTKHQ from "@shared/turnkey-core.js";

const {
  initEmbeddedKey: sharedInitEmbeddedKey,
  generateTargetKey,
  setItemWithExpiry,
  getItemWithExpiry,
  getEmbeddedKey: sharedGetEmbeddedKey,
  setEmbeddedKey: sharedSetEmbeddedKey,
  onResetEmbeddedKey: sharedOnResetEmbeddedKey,
  p256JWKPrivateToPublic,
  base58Encode,
  base58Decode,
  encodeKey,
  sendMessageUp,
  logMessage,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  setParentFrameMessageChannelPort,
  setParentFrameOrigin,
  normalizePadding,
  additionalAssociatedData,
  getSettings,
  setSettings,
  parsePrivateKey,
  validateStyles,
  isDoublyIframed,
  loadQuorumKey,
} = SharedTKHQ;

const LEGACY_EMBEDDED_KEY = "TURNKEY_EMBEDDED_KEY";
const LEGACY_EMBEDDED_KEY_ORIGIN = "TURNKEY_EMBEDDED_KEY_ORIGIN";
const ORIGIN_SCOPED_EMBEDDED_KEY_PREFIX = "TURNKEY_EMBEDDED_KEY_V2";

// Embedded key state for this document, keyed by window so it is tied to the
// document lifetime. Two shapes:
//   { mode: "persistent", origin, storageKey, ready } -- key lives in
//     localStorage, scoped to the browser-authenticated parent origin (or
//     this document's own origin in standalone mode). `ready` resolves once
//     the key has actually been persisted; readers racing the handshake must
//     await it before calling getEmbeddedKey.
//   { mode: "ephemeral", key } -- key lives in memory only. Used for legacy
//     (@turnkey/iframe-stamper < 2.1.0) parents: because the key is unique to
//     this document and never persisted, an unrelated embedder can never
//     obtain a key that decrypts another application's bundles (INT-697).
const embeddedKeyStates = new WeakMap();

function validateParentOrigin(parentOrigin) {
  if (
    typeof parentOrigin !== "string" ||
    parentOrigin.length === 0 ||
    parentOrigin === "null"
  ) {
    throw new Error("a non-opaque parent origin is required");
  }

  const parsedOrigin = new URL(parentOrigin).origin;
  if (parsedOrigin !== parentOrigin) {
    throw new Error(`invalid parent origin: ${parentOrigin}`);
  }

  return parsedOrigin;
}

// Never migrate the old global key: doing so would preserve the cross-origin
// replay vulnerability for bundles encrypted before this change.
function purgeLegacyEmbeddedKey() {
  window.localStorage.removeItem(LEGACY_EMBEDDED_KEY);
  window.localStorage.removeItem(LEGACY_EMBEDDED_KEY_ORIGIN);
}

/**
 * Creates (if needed) the persistent embedded key scoped to the given parent
 * origin and persists it in localStorage. A document can bind to exactly one
 * parent origin; an ephemeral key, if any, is superseded.
 * @param {string} parentOrigin
 */
async function initEmbeddedKey(parentOrigin) {
  if (isDoublyIframed()) {
    throw new Error("Doubly iframed");
  }
  const validatedOrigin = validateParentOrigin(parentOrigin);
  const previousState = embeddedKeyStates.get(window);
  if (
    previousState?.mode === "persistent" &&
    previousState.origin !== validatedOrigin
  ) {
    throw new Error(
      `parent origin is already bound to ${previousState.origin}; refusing ${validatedOrigin}`
    );
  }
  purgeLegacyEmbeddedKey();
  const storageKey = `${ORIGIN_SCOPED_EMBEDDED_KEY_PREFIX}:${encodeURIComponent(
    validatedOrigin
  )}`;
  const state = { mode: "persistent", origin: validatedOrigin, storageKey };
  // The state is activated synchronously so a concurrent ephemeral init
  // cannot clobber it, but the key does not exist in localStorage until
  // sharedInitEmbeddedKey resolves; `ready` lets racing readers wait for it.
  // If persistence fails (e.g. blocked third-party storage), roll back so the
  // document keeps operating on its previous key and a retry is possible.
  state.ready = sharedInitEmbeddedKey(storageKey).catch((error) => {
    if (embeddedKeyStates.get(window) === state) {
      if (previousState) {
        embeddedKeyStates.set(window, previousState);
      } else {
        embeddedKeyStates.delete(window);
      }
    }
    throw error;
  });
  embeddedKeyStates.set(window, state);
  return await state.ready;
}

/**
 * Creates (if needed) an in-memory embedded key unique to this document, for
 * legacy (@turnkey/iframe-stamper < 2.1.0) parents that speak direct
 * postMessage. No-ops if a persistent origin-scoped key is already active
 * (i.e. the MessageChannel handshake completed first).
 */
async function initEphemeralEmbeddedKey() {
  if (isDoublyIframed()) {
    throw new Error("Doubly iframed");
  }
  const state = embeddedKeyStates.get(window);
  if (state?.mode === "persistent") {
    // Wait for the in-flight persistence so callers can read the key.
    return await state.ready;
  }
  if (state?.key) {
    return;
  }
  purgeLegacyEmbeddedKey();
  const generatedKey = await generateTargetKey();
  // Re-check: a MessageChannel handshake may have activated a persistent key
  // while key generation was in flight; it must not be clobbered. Wait for it
  // so callers can read the key; if it fails (and rolls itself back), the
  // ephemeral key takes over below.
  const latestState = embeddedKeyStates.get(window);
  if (latestState?.mode === "persistent") {
    try {
      return await latestState.ready;
    } catch {
      // fall through to the ephemeral key
    }
  }
  if (embeddedKeyStates.get(window)?.mode !== "persistent") {
    embeddedKeyStates.set(window, { mode: "ephemeral", key: generatedKey });
  }
}

function getEmbeddedKey() {
  const state = embeddedKeyStates.get(window);
  if (!state) {
    return null;
  }
  return state.mode === "persistent"
    ? sharedGetEmbeddedKey(state.storageKey)
    : state.key;
}

function setEmbeddedKey(targetKey) {
  const state = embeddedKeyStates.get(window);
  if (!state) {
    throw new Error("embedded key has not been initialized");
  }
  if (state.mode === "persistent") {
    sharedSetEmbeddedKey(targetKey, state.storageKey);
  } else {
    state.key = targetKey;
  }
}

function onResetEmbeddedKey() {
  const state = embeddedKeyStates.get(window);
  if (!state) {
    throw new Error("embedded key has not been initialized");
  }
  if (state.mode === "persistent") {
    sharedOnResetEmbeddedKey(state.storageKey);
  } else {
    state.key = null;
  }
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
  initEphemeralEmbeddedKey,
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
  setParentFrameOrigin,
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
