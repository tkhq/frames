import { TKHQ } from "./turnkey-core.js";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import nacl from "tweetnacl";
import { HpkeDecrypt } from "./crypto-utils.js";

// Persist keys in memory via mapping of { address --> pk }
let inMemoryKeys = {};

const DEFAULT_TTL_SECONDS = 24 * 60 * 60; // 24 hours

// Instantiate these once (for perf)
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Hide every HTML element in <body> except any <script> elements.
 * Then append an element containing the hex-encoded raw private key.
 * @param {string} key
 */
function displayKey(key) {
  Array.from(document.body.children).forEach((child) => {
    if (child.tagName !== "SCRIPT" && child.id !== "key-div") {
      child.style.display = "none";
    }
  });

  const style = {
    border: "none",
    color: "#555b64",
    fontSize: ".875rem",
    lineHeight: "1.25rem",
    overflowWrap: "break-word",
    textAlign: "left",
  };

  // Create a new div with the key material and append the new div to the body
  const keyDiv = document.getElementById("key-div");
  keyDiv.innerText = key;
  for (let styleKey in style) {
    keyDiv.style[styleKey] = style[styleKey];
  }
  document.body.appendChild(keyDiv);
  TKHQ.applySettings(TKHQ.getSettings());
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
  let encappedKeyBuf;
  let ciphertextBuf;
  let verified;

  // Parse the import bundle
  const bundleObj = JSON.parse(bundle);
  switch (bundleObj.version) {
    case "v1.0.0":
      // Validate fields exist
      if (!bundleObj.data) {
        throw new Error('missing "data" in bundle');
      }
      if (!bundleObj.dataSignature) {
        throw new Error('missing "dataSignature" in bundle');
      }
      if (!bundleObj.enclaveQuorumPublic) {
        throw new Error('missing "enclaveQuorumPublic" in bundle');
      }

      // Verify enclave signature
      if (!TKHQ.verifyEnclaveSignature) {
        throw new Error("method not loaded");
      }
      verified = await TKHQ.verifyEnclaveSignature(
        bundleObj.enclaveQuorumPublic,
        bundleObj.dataSignature,
        bundleObj.data
      );
      if (!verified) {
        throw new Error(`failed to verify enclave signature: ${bundle}`);
      }

      // Parse the signed data. The data is produced by JSON encoding followed by hex encoding. We reverse this here.
      const signedData = JSON.parse(
        textDecoder.decode(TKHQ.uint8arrayFromHexString(bundleObj.data))
      );

      // Validate fields match
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
      encappedKeyBuf = TKHQ.uint8arrayFromHexString(signedData.encappedPublic);
      ciphertextBuf = TKHQ.uint8arrayFromHexString(signedData.ciphertext);
      break;
    default:
      throw new Error(`unsupported version: ${bundleObj.version}`);
  }

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

  // Parse the decrypted key bytes
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

  // TODO: In debug mode and only debug mode (aka standalone), support displaying multiple keys
  displayKey(key);

  // Set in memory
  // If no address provided, use a default key
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
      expiry: new Date().getTime() + DEFAULT_TTL_SECONDS,
      keypair: cachedKeypair,
    },
  };

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
    // Sign the message
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);

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
 * Validates that a key exists and has not expired.
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
    throw new Error(
      `key bytes not found. Please re-inject export bundle for address ${keyAddress} into iframe. Note that address is case sensitive.`
    ).toString();
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
        await onInjectWalletBundle(
          event.data["value"],
          event.data["organizationId"],
          event.data["requestId"],
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
