import { TKHQ } from "./turnkey-core.js";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import * as nobleEd25519 from "@noble/ed25519";
import * as nobleHashes from "@noble/hashes/sha512";

/**
 * In-memory key store: { address --> key object }.
 * SECURITY: Mutated in-place (not spread-copied) to avoid multiplying
 * copies of key material on the V8 heap. Before deleting an entry,
 * all Uint8Array fields (e.g. keypair.secretKey) must be zeroed.
 */
let inMemoryKeys = {};

/**
 * Injected embedded key -- held in memory only, never persisted.
 * When set, decryptBundle uses this P-256 JWK instead of the iframe's embedded key.
 *
 * SECURITY LIMITATION: This is a JWK object containing the raw "d" parameter.
 * It cannot be reliably zeroed in JS (object properties are GC'd, not wiped).
 * We null it on error paths and on reset to limit the exposure window.
 */
let injectedEmbeddedKey = null;

export const DEFAULT_TTL_MILLISECONDS = 1000 * 24 * 60 * 60; // 24 hours or 86,400,000 milliseconds

// Instantiate these once (for perf)
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Zeros all sensitive Uint8Array fields on a key entry before removal.
 * JS strings (like `privateKey`) are immutable and cannot be zeroed — this is
 * a known V8 limitation. We zero what we can (Uint8Array buffers) and document
 * the rest.
 * @param {Object} keyEntry - An entry from inMemoryKeys
 */
function zeroKeyEntry(keyEntry) {
  if (!keyEntry) return;
  // Zero the cached Solana keypair's secret key (64-byte Uint8Array)
  if (keyEntry.keypair && keyEntry.keypair.secretKey) {
    keyEntry.keypair.secretKey.fill(0);
  }
  // NOTE: keyEntry.privateKey is a JS string (hex or base58 encoded).
  // JS strings are immutable — we cannot zero them. They will linger on the
  // V8 heap until GC. Keeping key material as Uint8Array end-to-end would
  // require a larger refactor of the encodeKey/decodeKey pipeline.
}

/**
 * Verifies the enclave signature on a v1.0.0 bundle and returns the parsed signed data.
 * @param {string} bundle - JSON-stringified bundle
 * @param {string} organizationId - Expected organization ID
 * @returns {Promise<Object>} - The parsed signed data {organizationId, encappedPublic, ciphertext}
 */
async function verifyAndParseBundleData(bundle, organizationId) {
  const bundleObj = JSON.parse(bundle);

  if (bundleObj.version !== "v1.0.0") {
    throw new Error(`unsupported version: ${bundleObj.version}`);
  }
  if (!bundleObj.data) {
    throw new Error('missing "data" in bundle');
  }
  if (!bundleObj.dataSignature) {
    throw new Error('missing "dataSignature" in bundle');
  }
  if (!bundleObj.enclaveQuorumPublic) {
    throw new Error('missing "enclaveQuorumPublic" in bundle');
  }

  if (!TKHQ.verifyEnclaveSignature) {
    throw new Error("method TKHQ.verifyEnclaveSignature not loaded");
  }
  const verified = await TKHQ.verifyEnclaveSignature(
    bundleObj.enclaveQuorumPublic,
    bundleObj.dataSignature,
    bundleObj.data
  );
  if (!verified) {
    throw new Error(
      `failed to verify enclave signature. Got signature: ${bundleObj.dataSignature}, enclaveQuorumPublic: ${bundleObj.enclaveQuorumPublic}`
    );
  }

  const signedData = JSON.parse(
    textDecoder.decode(TKHQ.uint8arrayFromHexString(bundleObj.data))
  );

  if (!organizationId) {
    throw new Error(
      `organization id is required. Please ensure you are using @turnkey/iframe-stamper >= v2.0.0 to pass "organizationId" for security purposes.`
    );
  } else if (
    !signedData.organizationId ||
    // SECURITY: Use constant-time comparison to prevent timing side-channel
    // attacks that could leak the organization ID byte-by-byte.
    !TKHQ.timingSafeEqual(signedData.organizationId, organizationId)
  ) {
    throw new Error(
      `organization id does not match expected value. Expected: ${organizationId}. Found: ${signedData.organizationId}.`
    );
  }

  if (!signedData.encappedPublic) {
    throw new Error('missing "encappedPublic" in bundle signed data');
  }
  if (!signedData.ciphertext) {
    throw new Error('missing "ciphertext" in bundle signed data');
  }

  return signedData;
}

/**
 * Parse and decrypt the export bundle.
 * The `bundle` param is a JSON string of the encapsulated public
 * key, encapsulated public key signature, and the ciphertext.
 * @param {string} bundle
 * @param {string} organizationId
 * @param {Function} HpkeDecrypt
 */
async function decryptBundle(bundle, organizationId, HpkeDecrypt) {
  const signedData = await verifyAndParseBundleData(bundle, organizationId);

  const encappedKeyBuf = TKHQ.uint8arrayFromHexString(
    signedData.encappedPublic
  );
  const ciphertextBuf = TKHQ.uint8arrayFromHexString(signedData.ciphertext);

  // Use the injected embedded key if available, otherwise fall back to the embedded key
  const receiverPrivJwk = injectedEmbeddedKey || (await TKHQ.getEmbeddedKey());
  return await HpkeDecrypt({
    ciphertextBuf,
    encappedKeyBuf,
    receiverPrivJwk,
  });
}

/**
 * Function triggered when GET_EMBEDDED_PUBLIC_KEY event is received.
 * @param {string} requestId
 */
async function onGetPublicEmbeddedKey(requestId) {
  const embeddedKeyJwk = TKHQ.getEmbeddedKey();

  if (!embeddedKeyJwk) {
    TKHQ.sendMessageUp("EMBEDDED_PUBLIC_KEY", "", requestId); // no key == empty string

    return;
  }

  const targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
  const targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);

  // Send up EMBEDDED_PUBLIC_KEY message
  TKHQ.sendMessageUp("EMBEDDED_PUBLIC_KEY", targetPubHex, requestId);
}

/**
 * Encodes raw key bytes and loads them into the in-memory key store.
 * @param {string} address - Wallet address (case-sensitive)
 * @param {ArrayBuffer} keyBytes - Raw decrypted private key bytes
 * @param {string} keyFormat - "SOLANA" | "HEXADECIMAL"
 * @param {string} organizationId - Organization ID
 */
async function loadKeyIntoMemory(address, keyBytes, keyFormat, organizationId) {
  let key;
  const privateKeyBytes = new Uint8Array(keyBytes);

  try {
    if (keyFormat === "SOLANA") {
      const privateKeyHex = TKHQ.uint8arrayToHexString(
        privateKeyBytes.subarray(0, 32)
      );
      const publicKeyBytes = TKHQ.getEd25519PublicKey(privateKeyHex);
      key = await TKHQ.encodeKey(privateKeyBytes, keyFormat, publicKeyBytes);
    } else {
      key = await TKHQ.encodeKey(privateKeyBytes, keyFormat);
    }
  } finally {
    // SECURITY: Zero the raw private key bytes immediately after encoding.
    // The encoded `key` is a JS string (hex or base58) which we cannot zero,
    // but we can at least wipe the Uint8Array source material from the heap.
    privateKeyBytes.fill(0);
  }

  const keyAddress = address || "default";

  // Cache keypair for improved signing perf
  let cachedKeypair;
  if (keyFormat === "SOLANA") {
    cachedKeypair = Keypair.fromSecretKey(TKHQ.base58Decode(key));
  } else if (keyFormat === "HEXADECIMAL") {
    cachedKeypair = await createSolanaKeypair(
      Array.from(TKHQ.uint8arrayFromHexString(key))
    );
  }

  // SECURITY: Mutate in-place rather than spread-copying. The spread pattern
  // `{ ...inMemoryKeys, [addr]: ... }` creates a shallow copy of the entire map
  // on every key injection, multiplying references to key material on the heap.
  // In-place mutation avoids this; only one reference per key exists at a time.
  // If replacing an existing entry, zero its buffers first.
  if (inMemoryKeys[keyAddress]) {
    zeroKeyEntry(inMemoryKeys[keyAddress]);
  }
  inMemoryKeys[keyAddress] = {
    organizationId,
    privateKey: key,
    format: keyFormat,
    expiry: new Date().getTime() + DEFAULT_TTL_MILLISECONDS,
    keypair: cachedKeypair,
  };
}

/**
 * Function triggered when INJECT_KEY_EXPORT_BUNDLE event is received.
 * @param {string} requestId
 * @param {string} organizationId
 * @param {string} bundle
 * @param {string} keyFormat
 * @param {string} address
 * @param {Function} HpkeDecrypt // TODO: import this directly (instead of passing around)
 */
async function onInjectKeyBundle(
  requestId,
  organizationId,
  bundle,
  keyFormat,
  address,
  HpkeDecrypt
) {
  // Decrypt the export bundle
  const keyBytes = await decryptBundle(bundle, organizationId, HpkeDecrypt);

  // Load decrypted key into memory
  await loadKeyIntoMemory(address, keyBytes, keyFormat, organizationId);

  // Send up BUNDLE_INJECTED message
  TKHQ.sendMessageUp("BUNDLE_INJECTED", true, requestId);
}

/**
 * Function triggered when APPLY_SETTINGS event is received.
 * For now, the only settings that can be applied are for "styles".
 * Persist them in local storage so they can be applied on every
 * page load.
 * @param {string} settings: JSON-stringified settings
 * @param {string} requestId
 */
async function onApplySettings(settings, requestId) {
  // Apply settings
  const validSettings = TKHQ.applySettings(settings);

  // Persist in local storage
  TKHQ.setSettings(validSettings);

  // Send up SETTINGS_APPLIED message
  TKHQ.sendMessageUp("SETTINGS_APPLIED", true, requestId);
}

/**
 * Function triggered when SIGN_TRANSACTION event is received.
 * @param {string} requestId
 * @param {string} transaction (serialized)
 * @param {string} address (case-sensitive --> enforce this, optional for backwards compatibility)
 */
async function onSignTransaction(requestId, serializedTransaction, address) {
  // If no address provided, use "default"
  const keyAddress = address || "default";
  const key = inMemoryKeys[keyAddress];

  // Validate key exists and is valid/non-expired
  if (!validateKey(key, keyAddress, requestId)) {
    return;
  }

  // Get or create keypair (uses cached keypair if available)
  const keypair = await getOrCreateKeypair(key);

  const transactionWrapper = JSON.parse(serializedTransaction);
  const transactionToSign = transactionWrapper.transaction;
  const transactionType = transactionWrapper.type;

  let signedTransaction;

  if (transactionType === "SOLANA") {
    // Fetch the transaction and sign
    const transactionBytes = TKHQ.uint8arrayFromHexString(transactionToSign);
    const transaction = VersionedTransaction.deserialize(transactionBytes);
    transaction.sign([keypair]);

    signedTransaction = transaction.serialize();
  } else {
    throw new Error("unsupported transaction type");
  }

  const signedTransactionHex = TKHQ.uint8arrayToHexString(signedTransaction);

  TKHQ.sendMessageUp("TRANSACTION_SIGNED", signedTransactionHex, requestId);
}

/**
 * Function triggered when SIGN_MESSAGE event is received.
 * @param {string} requestId
 * @param {string} message (serialized, JSON-stringified)
 * @param {string} address (case-sensitive --> enforce this, optional for backwards compatibility)
 */
async function onSignMessage(requestId, serializedMessage, address) {
  // Backwards compatibility: if no address provided, use "default"
  const keyAddress = address || "default";
  const key = inMemoryKeys[keyAddress];

  // Validate key exists and has not expired
  if (!validateKey(key, keyAddress, requestId)) {
    return;
  }

  const messageWrapper = JSON.parse(serializedMessage);
  const messageToSign = messageWrapper.message;
  const messageType = messageWrapper.type;
  const messageBytes = textEncoder.encode(messageToSign);

  let signatureHex;

  // Get or create keypair (uses cached keypair if available)
  const keypair = await getOrCreateKeypair(key);

  if (messageType === "SOLANA") {
    // Set up sha512 for nobleEd25519 (required for signing)
    nobleEd25519.etc.sha512Sync = (...m) =>
      nobleHashes.sha512(nobleEd25519.etc.concatBytes(...m));

    // Extract the 32-byte private key from the 64-byte secretKey.
    // Solana keypair.secretKey format: [32-byte private key][32-byte public key]
    // SECURITY: .slice() creates a new Uint8Array copy. We must zero it after
    // signing to avoid leaving an extra copy of the private key on the heap.
    const privateKey = keypair.secretKey.slice(0, 32);
    try {
      // Sign the message using nobleEd25519
      const signature = nobleEd25519.sign(messageBytes, privateKey);

      // Note: Signature verification is skipped for performance. The signature will always be valid if signing succeeds with a valid keypair.
      // Clients can verify the signature returned.

      signatureHex = TKHQ.uint8arrayToHexString(signature);
    } finally {
      // SECURITY: Zero the private key slice immediately after use.
      privateKey.fill(0);
    }
  } else {
    TKHQ.sendMessageUp("ERROR", "unsupported message type", requestId);

    return;
  }

  TKHQ.sendMessageUp("MESSAGE_SIGNED", signatureHex, requestId);
}

/**
 * Function triggered when CLEAR_EMBEDDED_PRIVATE_KEY event is received.
 * @param {string} requestId
 * @param {string} address - Optional: The address of the key to clear (case-sensitive). If not provided, clears all keys.
 */
async function onClearEmbeddedPrivateKey(requestId, address) {
  // If no address is provided, clear all keys
  if (!address) {
    // SECURITY: Zero all Uint8Array buffers before releasing references.
    // `delete` and reassignment only remove the JS reference — the underlying
    // memory isn't wiped and will persist until GC reclaims it.
    for (const key of Object.keys(inMemoryKeys)) {
      zeroKeyEntry(inMemoryKeys[key]);
    }
    inMemoryKeys = {};
    TKHQ.sendMessageUp("EMBEDDED_PRIVATE_KEY_CLEARED", true, requestId);

    return;
  }

  // Check if key exists for the specific address
  if (!inMemoryKeys[address]) {
    TKHQ.sendMessageUp(
      "ERROR",
      new Error(
        `key not found for address ${address}. Note that address is case sensitive.`
      ).toString(),
      requestId
    );

    return;
  }

  // SECURITY: Zero sensitive buffers before deleting the entry.
  zeroKeyEntry(inMemoryKeys[address]);
  delete inMemoryKeys[address];

  TKHQ.sendMessageUp("EMBEDDED_PRIVATE_KEY_CLEARED", true, requestId);
}

/**
 * Handler for SET_EMBEDDED_KEY_OVERRIDE events.
 * Decrypts a P-256 private key bundle using the iframe's embedded key and
 * overrides the embedded key with it for subsequent bundle decryptions.
 * @param {string} requestId
 * @param {string} organizationId
 * @param {string} bundle - v1.0.0 bundle containing the P-256 private key
 * @param {Function} HpkeDecrypt
 */
async function onSetEmbeddedKeyOverride(
  requestId,
  organizationId,
  bundle,
  HpkeDecrypt
) {
  let keyBytes = null;
  try {
    // Decrypt the private key using the iframe's embedded key.
    // The decrypted payload is a raw 32-byte P-256 private key scalar.
    const decrypted = await decryptBundle(bundle, organizationId, HpkeDecrypt);
    keyBytes =
      decrypted instanceof Uint8Array ? decrypted : new Uint8Array(decrypted);

    // Convert raw P-256 bytes to a full JWK (derives public key via WebCrypto)
    const keyJwk = await rawP256PrivateKeyToJwk(new Uint8Array(keyBytes));

    // Store in module-level variable (memory only)
    injectedEmbeddedKey = keyJwk;

    TKHQ.sendMessageUp("EMBEDDED_KEY_OVERRIDE_SET", true, requestId);
  } catch (e) {
    // SECURITY: Ensure the injected key is cleared on any error path.
    // If decryption or JWK conversion partially succeeded before throwing,
    // we must not leave stale key material in the module variable.
    injectedEmbeddedKey = null;
    throw e;
  } finally {
    // SECURITY: Zero decrypted key bytes on all paths once we've derived the JWK.
    if (keyBytes) {
      keyBytes.fill(0);
    }
  }
}

/**
 * Handler for RESET_TO_DEFAULT_EMBEDDED_KEY events.
 * Clears the embedded key from memory, replacing it with the iframe's default embedded key.
 * @param {string} requestId
 */
function onResetToDefaultEmbeddedKey(requestId) {
  injectedEmbeddedKey = null;
  TKHQ.sendMessageUp("RESET_TO_DEFAULT_EMBEDDED_KEY", true, requestId);
}

// Utility functions
async function createSolanaKeypair(privateKey) {
  const privateKeyBytes = TKHQ.parsePrivateKey(privateKey);

  let keypair;
  if (privateKeyBytes.length === 32) {
    // 32-byte private key (seed)
    keypair = Keypair.fromSeed(privateKeyBytes);
  } else if (privateKeyBytes.length === 64) {
    // 64-byte secret key (private + public)
    keypair = Keypair.fromSecretKey(privateKeyBytes);
  } else {
    throw new Error(
      `Invalid private key length: ${privateKeyBytes.length}. Expected 32 or 64 bytes.`
    );
  }

  return keypair;
}

/**
 * Converts raw P-256 private key bytes (32-byte scalar) to a JWK.
 * Constructs a PKCS8 wrapper around the raw bytes, imports via WebCrypto
 * (which derives the public key), then exports as JWK.
 * @param {Uint8Array} rawPrivateKeyBytes - 32-byte P-256 private key scalar
 * @returns {Promise<JsonWebKey>} - Full P-256 ECDH private key JWK
 */
async function rawP256PrivateKeyToJwk(rawPrivateKeyBytes) {
  if (rawPrivateKeyBytes.length !== 32) {
    throw new Error(
      `invalid decryption key length: expected 32 bytes, got ${rawPrivateKeyBytes.length}`
    );
  }

  // Fixed PKCS#8 DER prefix for a P-256 private key (36 bytes).
  // This wraps a raw 32-byte scalar into the PrivateKeyInfo structure
  // that WebCrypto's importKey("pkcs8", ...) expects.
  //
  // Structure (per RFC 5958 §2 / RFC 5208 §5):
  //   SEQUENCE {
  //     INTEGER 0                              -- version (v1)
  //     SEQUENCE {                             -- AlgorithmIdentifier (RFC 5480 §2.1.1)
  //       OID 1.2.840.10045.2.1               -- id-ecPublicKey
  //       OID 1.2.840.10045.3.1.7             -- secp256r1 (P-256)
  //     }
  //     OCTET STRING {                         -- privateKey (SEC 1 §C.4 / RFC 5915 §3)
  //       SEQUENCE {
  //         INTEGER 1                          -- version
  //         OCTET STRING (32 bytes)            -- raw private key scalar
  //       }
  //     }
  //   }
  //
  // References:
  //   - RFC 5958 / RFC 5208: PKCS#8 PrivateKeyInfo
  //   - RFC 5480 §2.1.1: ECC AlgorithmIdentifier (OIDs)
  //   - RFC 5915 / SEC 1 v2 §C.4: ECPrivateKey encoding
  const pkcs8Prefix = new Uint8Array([
    0x30, 0x41, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48,
    0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03,
    0x01, 0x07, 0x04, 0x27, 0x30, 0x25, 0x02, 0x01, 0x01, 0x04, 0x20,
  ]);

  const pkcs8 = new Uint8Array(pkcs8Prefix.length + 32);
  pkcs8.set(pkcs8Prefix);
  pkcs8.set(rawPrivateKeyBytes, pkcs8Prefix.length);

  try {
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      pkcs8,
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveBits"]
    );

    return await crypto.subtle.exportKey("jwk", cryptoKey);
  } finally {
    // SECURITY: Zero intermediate buffers that contain private key material.
    // The PKCS#8 wrapper embeds the raw scalar, so both must be wiped.
    pkcs8.fill(0);
    rawPrivateKeyBytes.fill(0);
  }
}

/**
 * Generates the error message for missing or expired keys.
 * @param {string} keyAddress - The address of the key
 * @returns {string} - The error message string
 */
export function getKeyNotFoundErrorMessage(keyAddress) {
  return `key bytes have expired. Please re-inject export bundle for address ${keyAddress} into iframe. Note that address is case sensitive.`;
}

/**
 * Clears an expired key from memory. This is an internal helper function
 * that clears the key without sending messages to the parent frame.
 * @param {string} keyAddress - The address of the key to clear
 */
function clearExpiredKey(keyAddress) {
  if (inMemoryKeys[keyAddress]) {
    // SECURITY: Zero sensitive Uint8Array buffers before releasing the reference.
    zeroKeyEntry(inMemoryKeys[keyAddress]);
    delete inMemoryKeys[keyAddress];
  }
}

/**
 * Clears all expired keys from memory.
 * This function iterates through all keys and removes any that have expired.
 */
function clearAllExpiredKeys() {
  const now = new Date().getTime();
  const addressesToRemove = [];

  for (const [address, key] of Object.entries(inMemoryKeys)) {
    if (key.expiry && now >= key.expiry) {
      addressesToRemove.push(address);
    }
  }

  for (const address of addressesToRemove) {
    clearExpiredKey(address);
  }
}

/**
 * Validates that a key exists and has not expired.
 * Clears the key from memory if it has expired.
 * Throws error if validation fails (and caller will send message up back to parent).
 * @param {Object} key - The key object from inMemoryKeys
 * @param {string} keyAddress - The address of the key
 * @returns {boolean} - True if key is valid, false otherwise
 */
function validateKey(key, keyAddress) {
  if (!key) {
    throw new Error(
      `key bytes not found. Please re-inject export bundle for address ${keyAddress} into iframe. Note that address is case sensitive.`
    ).toString();
  }

  const now = new Date().getTime();
  if (now >= key.expiry) {
    // Clear all expired keys before processing the signing request
    clearAllExpiredKeys();
    throw new Error(getKeyNotFoundErrorMessage(keyAddress)).toString();
  }

  return true;
}

/**
 * Gets or creates a Solana keypair from a key object.
 * Uses cached keypair if available, otherwise creates a new one.
 * @param {Object} key - The key object containing format and privateKey
 * @returns {Promise<Keypair>} - The Solana keypair
 */
async function getOrCreateKeypair(key) {
  if (key.keypair) {
    return key.keypair;
  }

  if (key.format === "SOLANA") {
    return Keypair.fromSecretKey(TKHQ.base58Decode(key.privateKey));
  } else {
    return await createSolanaKeypair(
      Array.from(TKHQ.uint8arrayFromHexString(key.privateKey))
    );
  }
}

/**
 * DOM Event handlers to power the export flow in standalone mode
 * Instead of receiving events from the parent page, forms trigger them.
 * This is useful for debugging as well.
 */
function addDOMEventListeners() {
  // only support injected keys, not wallets
  document.getElementById("inject-key").addEventListener(
    "click",
    async (e) => {
      e.preventDefault();
      window.postMessage({
        type: "INJECT_KEY_EXPORT_BUNDLE",
        value: document.getElementById("key-export-bundle").value,
        keyFormat: document.getElementById("key-export-format").value,
        organizationId: document.getElementById("key-organization-id").value,
      });
    },
    false
  );
  document.getElementById("sign-transaction").addEventListener(
    "click",
    async (e) => {
      e.preventDefault();
      window.postMessage({
        type: "SIGN_TRANSACTION",
        value: document.getElementById("transaction-to-sign").value,
      });
    },
    false
  );
  document.getElementById("sign-message").addEventListener(
    "click",
    async (e) => {
      e.preventDefault();
      window.postMessage({
        type: "SIGN_MESSAGE",
        value: document.getElementById("message-to-sign").value,
      });
    },
    false
  );
  document.getElementById("reset").addEventListener(
    "click",
    async (e) => {
      e.preventDefault();
      window.postMessage({ type: "RESET_EMBEDDED_KEY" });
    },
    false
  );

  // Add wallet injection support
  const injectWalletBtn = document.getElementById("inject-wallet");
  if (injectWalletBtn) {
    injectWalletBtn.addEventListener(
      "click",
      async (e) => {
        e.preventDefault();
        window.postMessage({
          type: "INJECT_WALLET_EXPORT_BUNDLE",
          value: document.getElementById("wallet-export-bundle").value,
          organizationId: document.getElementById("wallet-organization-id")
            .value,
        });
      },
      false
    );
  }
}

/**
 * Message Event Handlers to process messages from the parent frame
 */
function initMessageEventListener(HpkeDecrypt) {
  return async function messageEventListener(event) {
    if (event.data && event.data["type"] == "INJECT_KEY_EXPORT_BUNDLE") {
      TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}, ${event.data["keyFormat"]}, ${event.data["organizationId"]}`
      );
      try {
        await onInjectKeyBundle(
          event.data["requestId"],
          event.data["organizationId"],
          event.data["value"], // bundle
          event.data["keyFormat"],
          event.data["address"],
          HpkeDecrypt
        );
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "INJECT_WALLET_EXPORT_BUNDLE") {
      TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}, ${event.data["organizationId"]}`
      );
      try {
        await onInjectKeyBundle(
          event.data["requestId"],
          event.data["organizationId"],
          event.data["value"],
          undefined, // keyFormat - default to HEXADECIMAL
          undefined, // address - default to "default"
          HpkeDecrypt
        );
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "APPLY_SETTINGS") {
      try {
        await onApplySettings(event.data["value"], event.data["requestId"]);
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "RESET_EMBEDDED_KEY") {
      TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        TKHQ.onResetEmbeddedKey();
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString());
      }
    }
    if (event.data && event.data["type"] == "SIGN_TRANSACTION") {
      TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}`
      );
      try {
        await onSignTransaction(
          event.data["requestId"],
          event.data["value"],
          event.data["address"] // signing address (case sensitive)
        );
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "SIGN_MESSAGE") {
      TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}`
      );
      try {
        await onSignMessage(
          event.data["requestId"],
          event.data["value"],
          event.data["address"] // signing address (case sensitive)
        );
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "CLEAR_EMBEDDED_PRIVATE_KEY") {
      TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        await onClearEmbeddedPrivateKey(
          event.data["requestId"],
          event.data["address"]
        );
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "GET_EMBEDDED_PUBLIC_KEY") {
      TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        await onGetPublicEmbeddedKey(event.data["requestId"]);
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "SET_EMBEDDED_KEY_OVERRIDE") {
      TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        await onSetEmbeddedKeyOverride(
          event.data["requestId"],
          event.data["organizationId"],
          event.data["value"],
          HpkeDecrypt
        );
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "RESET_TO_DEFAULT_EMBEDDED_KEY") {
      TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        onResetToDefaultEmbeddedKey(event.data["requestId"]);
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
  };
}

/**
 * Set up event handlers for both DOM and message events
 * @param {Function} HpkeDecrypt
 */
export function initEventHandlers(HpkeDecrypt) {
  const messageEventListener = initMessageEventListener(HpkeDecrypt);

  // controllers to remove event listeners
  const messageListenerController = new AbortController();
  const turnkeyInitController = new AbortController();

  // Add DOM event listeners for standalone mode
  addDOMEventListeners();

  // Add window message listener for iframe mode
  window.addEventListener("message", messageEventListener, {
    capture: false,
    signal: messageListenerController.signal,
  });

  // Guard to prevent concurrent channel establishment from multiple senders
  let channelEstablished = false;

  // Handle MessageChannel initialization for iframe communication
  window.addEventListener(
    "message",
    async function (event) {
      /**
       * @turnkey/iframe-stamper >= v2.1.0 is using a MessageChannel to communicate with the parent frame.
       * The parent frame sends a TURNKEY_INIT_MESSAGE_CHANNEL event with the MessagePort.
       * If we receive this event, we want to remove the message event listener that was added in the DOMContentLoaded event to avoid processing messages twice.
       * We persist the MessagePort so we can use it to communicate with the parent window in subsequent calls to TKHQ.sendMessageUp
       */
      if (
        event.data &&
        event.data["type"] == "TURNKEY_INIT_MESSAGE_CHANNEL" &&
        event.ports?.[0]
      ) {
        // Synchronously check-and-set the flag before any await. This prevents
        // a second concurrent invocation from racing through while the first is
        // suspended at an await, which would allow multiple origins to establish
        // a channel before turnkeyInitController.abort() is reached.
        if (channelEstablished) {
          return;
        }
        channelEstablished = true;

        // remove the message event listener that was added in the DOMContentLoaded event
        messageListenerController.abort();

        const iframeMessagePort = event.ports[0];
        iframeMessagePort.onmessage = messageEventListener;

        TKHQ.setParentFrameMessageChannelPort(iframeMessagePort);

        await TKHQ.initEmbeddedKey(event.origin);
        var embeddedKeyJwk = await TKHQ.getEmbeddedKey();
        var targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
        var targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);
        document.getElementById("embedded-key").value = targetPubHex;

        TKHQ.sendMessageUp("PUBLIC_KEY_READY", targetPubHex);

        // remove the listener for TURNKEY_INIT_MESSAGE_CHANNEL after it's been processed
        turnkeyInitController.abort();
      }
    },
    { signal: turnkeyInitController.signal }
  );

  return { messageEventListener };
}
/**
 * Expose internal handlers for targeted testing.
 */
export {
  onInjectKeyBundle,
  onSignTransaction,
  onSignMessage,
  onClearEmbeddedPrivateKey,
  onSetEmbeddedKeyOverride,
  onResetToDefaultEmbeddedKey,
};
