import { TKHQ } from "./turnkey-core.js";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import * as nobleEd25519 from "@noble/ed25519";
import * as nobleHashes from "@noble/hashes/sha512";

// Persist keys in memory via mapping of { address --> pk }
let inMemoryKeys = {};

// Decryption key -- held in memory only, never persisted to localStorage.
// This is a P-256 private key in JWK format used to decrypt stored bundles.
let decryptionKey = null;

export const DEFAULT_TTL_MILLISECONDS = 1000 * 24 * 60 * 60; // 24 hours or 86,400,000 milliseconds

// Instantiate these once (for perf)
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

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
    throw new Error("method not loaded");
  }
  const verified = await TKHQ.verifyEnclaveSignature(
    bundleObj.enclaveQuorumPublic,
    bundleObj.dataSignature,
    bundleObj.data
  );
  if (!verified) {
    throw new Error(`failed to verify enclave signature: ${bundle}`);
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
    signedData.organizationId !== organizationId
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

  // Decrypt the ciphertext
  const embeddedKeyJwk = await TKHQ.getEmbeddedKey();
  return await HpkeDecrypt({
    ciphertextBuf,
    encappedKeyBuf,
    receiverPrivJwk: embeddedKeyJwk,
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

  if (keyFormat === "SOLANA") {
    const privateKeyHex = TKHQ.uint8arrayToHexString(
      privateKeyBytes.subarray(0, 32)
    );
    const publicKeyBytes = TKHQ.getEd25519PublicKey(privateKeyHex);
    key = await TKHQ.encodeKey(privateKeyBytes, keyFormat, publicKeyBytes);
  } else {
    key = await TKHQ.encodeKey(privateKeyBytes, keyFormat);
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

  inMemoryKeys = {
    ...inMemoryKeys,
    [keyAddress]: {
      organizationId,
      privateKey: key,
      format: keyFormat,
      expiry: new Date().getTime() + DEFAULT_TTL_MILLISECONDS,
      keypair: cachedKeypair,
    },
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

    // Extract the 32-byte private key from the 64-byte secretKey
    // Solana keypair.secretKey format: [32-byte private key][32-byte public key]
    const privateKey = keypair.secretKey.slice(0, 32);
    // Sign the message using nobleEd25519
    const signature = nobleEd25519.sign(messageBytes, privateKey);

    // Note: Signature verification is skipped for performance. The signature will always be valid if signing succeeds with a valid keypair.
    // Clients can verify the signature returned.

    signatureHex = TKHQ.uint8arrayToHexString(signature);
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

  // Clear the specific key from memory
  delete inMemoryKeys[address];

  TKHQ.sendMessageUp("EMBEDDED_PRIVATE_KEY_CLEARED", true, requestId);
}

/**
 * Handler for STORE_ENCRYPTED_BUNDLE events.
 * Verifies the enclave signature on an encrypted bundle and stores
 * the encrypted payload in localStorage for later decryption.
 * If the decryption key is already in memory, also decrypts and loads
 * the key into memory immediately.
 * @param {string} requestId
 * @param {string} organizationId
 * @param {string} bundle - v1.0.0 bundle JSON
 * @param {string} keyFormat - "SOLANA" | "HEXADECIMAL"
 * @param {string} address - Wallet address
 * @param {Function} HpkeDecrypt
 */
async function onStoreEncryptedBundle(
  requestId,
  organizationId,
  bundle,
  keyFormat,
  address,
  HpkeDecrypt
) {
  if (!address) {
    throw new Error("address is required for STORE_ENCRYPTED_BUNDLE");
  }

  // Verify enclave signature and parse the signed data
  const signedData = await verifyAndParseBundleData(bundle, organizationId);

  const resolvedKeyFormat = keyFormat || "HEXADECIMAL";

  // Store the encrypted fields in localStorage (just what's needed for decryption)
  TKHQ.setEncryptedBundle(address, {
    encappedPublic: signedData.encappedPublic,
    ciphertext: signedData.ciphertext,
    organizationId: organizationId,
    keyFormat: resolvedKeyFormat,
  });

  // If the decryption key is already in memory, decrypt and load immediately
  if (decryptionKey && HpkeDecrypt) {
    const encappedKeyBuf = TKHQ.uint8arrayFromHexString(
      signedData.encappedPublic
    );
    const ciphertextBuf = TKHQ.uint8arrayFromHexString(signedData.ciphertext);

    const keyBytes = await HpkeDecrypt({
      ciphertextBuf,
      encappedKeyBuf,
      receiverPrivJwk: decryptionKey,
    });

    await loadKeyIntoMemory(
      address,
      keyBytes,
      resolvedKeyFormat,
      organizationId
    );
  }

  TKHQ.sendMessageUp("ENCRYPTED_BUNDLE_STORED", true, requestId);
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

  // PKCS8 DER prefix for a P-256 private key (without optional public key field)
  // SEQUENCE {
  //   INTEGER 0 (version)
  //   SEQUENCE { OID ecPublicKey, OID P-256 }
  //   OCTET STRING { SEQUENCE { INTEGER 1, OCTET STRING(32) <key> } }
  // }
  const pkcs8Prefix = new Uint8Array([
    0x30, 0x41, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48,
    0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03,
    0x01, 0x07, 0x04, 0x27, 0x30, 0x25, 0x02, 0x01, 0x01, 0x04, 0x20,
  ]);

  const pkcs8 = new Uint8Array(pkcs8Prefix.length + 32);
  pkcs8.set(pkcs8Prefix);
  pkcs8.set(rawPrivateKeyBytes, pkcs8Prefix.length);

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );

  return await crypto.subtle.exportKey("jwk", cryptoKey);
}

/**
 * Handler for INJECT_DECRYPTION_KEY_BUNDLE events.
 * Decrypts the P-256 private key using the iframe's embedded key,
 * then iterates all stored encrypted bundles, HPKE-decrypts each one
 * with the key, and loads them into inMemoryKeys.
 * @param {string} requestId
 * @param {string} organizationId
 * @param {string} bundle - v1.0.0 bundle containing the private key
 * @param {Function} HpkeDecrypt
 */
async function onInjectDecryptionKeyBundle(
  requestId,
  organizationId,
  bundle,
  HpkeDecrypt
) {
  // Decrypt the private key using the iframe's embedded key.
  // The decrypted payload is a raw 32-byte P-256 private key scalar.
  const keyBytes = await decryptBundle(bundle, organizationId, HpkeDecrypt);

  // Convert raw P-256 bytes to a full JWK (derives public key via WebCrypto)
  const keyJwk = await rawP256PrivateKeyToJwk(new Uint8Array(keyBytes));

  // Store in module-level variable (memory only)
  decryptionKey = keyJwk;

  // Iterate all stored encrypted bundles and decrypt each one
  const storedBundles = TKHQ.getEncryptedBundles();
  let decryptedCount = 0;

  if (storedBundles) {
    const addresses = Object.keys(storedBundles);

    for (const addr of addresses) {
      const bundleData = storedBundles[addr];

      try {
        const bundleOrgId = bundleData.organizationId;

        if (organizationId !== bundleOrgId) continue; // skip bundles that don't match the organization ID of the decryption key

        const encappedKeyBuf = TKHQ.uint8arrayFromHexString(
          bundleData.encappedPublic
        );
        const ciphertextBuf = TKHQ.uint8arrayFromHexString(
          bundleData.ciphertext
        );

        // HPKE-decrypt using the key
        const keyBytes = await HpkeDecrypt({
          ciphertextBuf,
          encappedKeyBuf,
          receiverPrivJwk: decryptionKey,
        });

        // Load the decrypted key into memory
        await loadKeyIntoMemory(
          addr,
          keyBytes,
          bundleData.keyFormat,
          bundleData.organizationId
        );

        decryptedCount++;
      } catch (e) {
        TKHQ.logMessage(
          `Failed to decrypt bundle for address ${addr}: ${e.toString()}`
        );
      }
    }
  }

  TKHQ.sendMessageUp("DECRYPTION_KEY_INJECTED", decryptedCount, requestId);
}

/**
 * Handler for BURN_SESSION events.
 * Clears the decryption key and all in-memory wallet keys.
 * Encrypted bundles in localStorage are preserved for the next session.
 * @param {string} requestId
 */
function onBurnSession(requestId) {
  decryptionKey = null;
  inMemoryKeys = {};
  TKHQ.sendMessageUp("SESSION_BURNED", true, requestId);
}

/**
 * Handler for GET_STORED_WALLET_ADDRESSES events.
 * Returns a JSON array of all wallet addresses that have encrypted bundles in localStorage.
 * @param {string} requestId
 * @param {string} organizationId - Organization ID to filter addresses by (only return addresses with bundles matching the organization ID)
 */
function onGetStoredWalletAddresses(requestId, organizationId) {
  const bundles = TKHQ.getEncryptedBundles();
  const addresses = bundles
    ? Object.entries(bundles)
        .filter(([, bundle]) => bundle.organizationId === organizationId)
        .map(([address]) => address)
    : [];
  TKHQ.sendMessageUp(
    "STORED_WALLET_ADDRESSES",
    JSON.stringify(addresses),
    requestId
  );
}

/**
 * Handler for CLEAR_STORED_BUNDLES events.
 * Removes encrypted bundles from localStorage AND the corresponding
 * in-memory keys. If address is provided, removes only that address.
 * If no address, removes ALL encrypted bundles and ALL in-memory keys.
 * @param {string} requestId
 * @param {string} organizationId - Organization ID to filter addresses by (only remove bundles matching the organization ID)
 * @param {string|undefined} address - Optional wallet address
 */
function onClearStoredBundles(requestId, address, organizationId) {
  if (address) {
    TKHQ.removeEncryptedBundle(address, organizationId);
    delete inMemoryKeys[address];
  } else {
    TKHQ.clearAllEncryptedBundles(organizationId);
    inMemoryKeys = {};
  }
  TKHQ.sendMessageUp("STORED_BUNDLES_CLEARED", true, requestId);
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
    if (event.data && event.data["type"] == "STORE_ENCRYPTED_BUNDLE") {
      TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: address=${event.data["address"]}`
      );
      try {
        await onStoreEncryptedBundle(
          event.data["requestId"],
          event.data["organizationId"],
          event.data["value"],
          event.data["keyFormat"],
          event.data["address"],
          HpkeDecrypt
        );
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "INJECT_DECRYPTION_KEY_BUNDLE") {
      TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        await onInjectDecryptionKeyBundle(
          event.data["requestId"],
          event.data["organizationId"],
          event.data["value"],
          HpkeDecrypt
        );
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "BURN_SESSION") {
      TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        onBurnSession(event.data["requestId"]);
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "GET_STORED_WALLET_ADDRESSES") {
      TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        onGetStoredWalletAddresses(
          event.data["requestId"],
          event.data["organizationId"]
        );
      } catch (e) {
        TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "CLEAR_STORED_BUNDLES") {
      TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: address=${event.data["address"]}`
      );
      try {
        onClearStoredBundles(
          event.data["requestId"],
          event.data["address"],
          event.data["organizationId"]
        );
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
  onStoreEncryptedBundle,
  onInjectDecryptionKeyBundle,
  onBurnSession,
  onGetStoredWalletAddresses,
  onClearStoredBundles,
};
