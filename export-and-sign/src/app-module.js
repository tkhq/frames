// Import bundled dependencies
import {
  hpke,
  createSolanaRpc,
  address,
  createKeyPairFromBytes,
  createKeyPairFromPrivateKeyBytes,
  createTransactionMessage,
  signTransaction,
  getAddressFromPublicKey,
  LAMPORTS_PER_SOL,
  lamports,
  nacl,
  naclUtil,
  nobleEd25519,
  sha512,
} from "./index.js";

// persist the MessageChannel object so we can use it to communicate with the parent window
var iframeMessagePort = null;

// controllers to remove event listeners
const messageListenerController = new AbortController();
const turnkeyInitController = new AbortController();

var decryptedKey = null;

const DEFAULT_TTL = 24 * 60 * 60; // 24 hours

/**
 * DOM Event handlers to power the export flow in standalone mode
 * Instead of receiving events from the parent page, forms trigger them.
 * This is useful for debugging as well.
 */
var addDOMEventListeners = function () {
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
};

/**
 * Message Event Handlers to process messages from the parent frame
 */
var messageEventListener = async function (event) {
  // only support injected keys, not wallets
  if (event.data && event.data["type"] == "INJECT_KEY_EXPORT_BUNDLE") {
    TKHQ.logMessage(
      `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}, ${event.data["keyFormat"]}, ${event.data["organizationId"]}`
    );
    try {
      await onInjectKeyBundle(
        event.data["value"],
        event.data["keyFormat"],
        event.data["organizationId"],
        event.data["requestId"]
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
        event.data["requestId"]
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
        event.data["value"],
        event.data["requestId"],
        event.origin
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
        event.data["value"],
        event.data["requestId"],
        event.origin
      );
    } catch (e) {
      TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
    }
  }
  if (event.data && event.data["type"] == "CLEAR_EMBEDDED_PRIVATE_KEY") {
    TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
    try {
      await onClearEmbeddedPrivateKey(event.data["requestId"]);
    } catch (e) {
      TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
    }
  }
};

/**
 * Initialize the embedded key and set up the DOM and message event listeners
 */
document.addEventListener(
  "DOMContentLoaded",
  async function (event) {
    await TKHQ.initEmbeddedKey(event.origin);
    const embeddedKeyJwk = await TKHQ.getEmbeddedKey();
    const targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
    const targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);
    document.getElementById("embedded-key").value = targetPubHex;

    window.addEventListener("message", messageEventListener, {
      capture: false,
      signal: messageListenerController.signal,
    });

    addDOMEventListeners();

    if (!messageListenerController.signal.aborted) {
      // If styles are saved in local storage, sanitize and apply them.
      const styleSettings = TKHQ.getSettings();
      if (styleSettings) {
        TKHQ.applySettings(styleSettings);
      }
      TKHQ.sendMessageUp("PUBLIC_KEY_READY", targetPubHex);
    }
  },
  false
);

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

      iframeMessagePort = event.ports[0];
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
 * Example: {"encappedPublic":"04912cb4200c40f04ae4a162f4c870c78cb4498a8efda0b94f4a9cb848d611bd40e9acccab2bf73cee1e269d8350a02f4df71864921097838f05c288d944fa2f8b","encappedPublicSignature":"304502200cd19a3c5892f1eeab88fe0cdd7cca63736a7d15fc364186fb3c913e1e01568b022100dea49557c176f6ca052b27ad164f077cf64d2aa55fbdc4757a14767f8b8c6b48","ciphertext":"0e5d5503f43721135818051e4c5b77b3365b66ec4020b0051d59ea9fc773c67bd4b61ed34a97b07a3074a85546721ae4","enclaveQuorumPublic":"04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569"}
 * @param {string} bundle
 * @param {string} organizationId
 */
async function decryptBundle(bundle, organizationId) {
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
        new TextDecoder().decode(TKHQ.uint8arrayFromHexString(bundleObj.data))
      );

      // Validate fields match
      if (!organizationId) {
        // todo: throw error if organization id is undefined once we've fully transitioned to v1.0.0 server messages and v2.0.0 iframe-stamper
        console.warn(
          'we highly recommend a version of @turnkey/iframe-stamper >= v2.0.0 to pass "organizationId" for security purposes.'
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
 * Function triggered when INJECT_KEY_EXPORT_BUNDLE event is received.
 * @param {string} bundle
 * @param {string} keyFormat
 * @param {string} organizationId
 * @param {string} requestId
 */
async function onInjectKeyBundle(bundle, keyFormat, organizationId, requestId) {
  // Decrypt the export bundle
  const keyBytes = await decryptBundle(bundle, organizationId);

  // Reset embedded key after using for decryption
  TKHQ.onResetEmbeddedKey();

  // Parse the decrypted key bytes
  var key;
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

  // Display only the key
  displayKey(key);

  // Set in memory
  decryptedKey = {
    rawBytes: keyBytes,
    format: keyFormat,
    expiry: new Date().getTime() + DEFAULT_TTL,
  };

  // Send up BUNDLE_INJECTED message
  TKHQ.sendMessageUp("BUNDLE_INJECTED", true, requestId);
}

/**
 * Function triggered when INJECT_WALLET_EXPORT_BUNDLE event is received.
 * @param {string} bundle
 * @param {string} organizationId
 * @param {string} requestId
 */
async function onInjectWalletBundle(bundle, organizationId, requestId) {
  // Decrypt the export bundle
  const walletBytes = await decryptBundle(bundle, organizationId);

  // Reset embedded key after using for decryption
  TKHQ.onResetEmbeddedKey();

  // Parse the decrypted wallet bytes
  const wallet = TKHQ.encodeWallet(new Uint8Array(walletBytes));

  // Display only the wallet's mnemonic
  displayKey(wallet.mnemonic);

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
 * @param {string} transaction (serialized)
 * @param {string} organizationId
 * @param {string} requestId
 * @param {string} origin
 */
async function onSignTransaction(serializedTransaction, requestId, origin) {
  if (!decryptedKey) {
    TKHQ.sendMessageUp(
      "ERROR",
      new Error(
        "key bytes not found. Please re-inject export bundle into iframe."
      ).toString(),
      requestId
    );
  }

  checkOrigin(origin);

  // Create a keypair from the decrypted key bytes
  const keypair = await createSolanaKeypair(
    Array.from(new Uint8Array(decryptedKey.rawBytes))
  );

  const transactionWrapper = JSON.parse(serializedTransaction);
  const transactionToSign = transactionWrapper.transaction;
  const transactionType = transactionWrapper.type;

  var signedTransaction;

  if (transactionType === "SOLANA") {
    const transactionBytes = TKHQ.uint8arrayFromHexString(transactionToSign);

    // Sign the transaction using Kit
    signedTransaction = await signTransaction({
      transactionBytes,
      keyPair: keypair,
    });
  } else {
    // not yet supported
    throw new Error("unsupported transaction type");
  }

  const signedTransactionHex = TKHQ.uint8arrayToHexString(signedTransaction);

  // Send up TRANSACTION_SIGNED message
  TKHQ.sendMessageUp("TRANSACTION_SIGNED", signedTransactionHex, requestId);
}

/**
 * Function triggered when SIGN_MESSAGE event is received.
 * @param {string} message (serialized, JSON-stringified)
 * @param {string} organizationId
 * @param {string} requestId
 * @param {string} origin
 */
async function onSignMessage(serializedMessage, requestId, origin) {
  if (!decryptedKey) {
    TKHQ.sendMessageUp(
      "ERROR",
      new Error(
        "key bytes not found. Please re-inject export bundle into iframe."
      ).toString(),
      requestId
    );
  }
  checkOrigin(origin);

  const messageWrapper = JSON.parse(serializedMessage);
  const messageToSign = messageWrapper.message;
  const messageType = messageWrapper.type;
  const messageBytes = new TextEncoder().encode(messageToSign);

  var signatureHex;

  if (messageType === "SOLANA") {
    // Create a keypair from the decrypted key bytes
    const keypair = await createSolanaKeypair(
      Array.from(new Uint8Array(decryptedKey.rawBytes))
    );

    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
    const result = nacl.sign.detached.verify(
      messageBytes,
      signature,
      keypair.publicKey.toBytes()
    );

    signatureHex = TKHQ.uint8arrayToHexString(signature);
  } else {
    // not yet supported
    throw new Error("unsupported message type");
  }

  // Send up MESSAGE_SIGNED message
  TKHQ.sendMessageUp("MESSAGE_SIGNED", signatureHex, requestId);
}

/**
 * Function triggered when CLEAR_EMBEDDED_PRIVATE_KEY event is received.
 * @param {string} requestId
 */
async function onClearEmbeddedPrivateKey(requestId) {
  decryptedKey = {}; // blank out the in-memory key

  TKHQ.sendMessageUp("EMBEDDED_PRIVATE_KEY_CLEARED", true, requestId);
}

/**
 * Decrypt the ciphertext (ArrayBuffer) given an encapsulation key (ArrayBuffer)
 * and the receivers private key (JSON Web Key).
 */
async function HpkeDecrypt({ ciphertextBuf, encappedKeyBuf, receiverPrivJwk }) {
  const kemContext = new hpke.DhkemP256HkdfSha256();
  var receiverPriv = await kemContext.importKey(
    "jwk",
    { ...receiverPrivJwk },
    false
  );

  var suite = new hpke.CipherSuite({
    kem: kemContext,
    kdf: new hpke.HkdfSha256(),
    aead: new hpke.Aes256Gcm(),
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

// Solana utility functions
async function createSolanaKeypair(privateKey) {
  const privateKeyBytes = TKHQ.parsePrivateKey(privateKey);

  let keypair;
  if (privateKeyBytes.length === 32) {
    // 32-byte private key (seed)
    keypair = await createKeyPairFromPrivateKeyBytes(privateKeyBytes);
  } else if (privateKeyBytes.length === 64) {
    // 64-byte secret key (private + public)
    keypair = await createKeyPairFromBytes(privateKeyBytes);
  } else {
    throw new Error(
      `Invalid private key length: ${privateKeyBytes.length}. Expected 32 or 64 bytes.`
    );
  }

  return keypair;
}

async function createTransferTransaction(
  fromKeypair,
  toAddress,
  amountLamports,
  rpc
) {
  // For now, create a simple transaction message
  // Note: This is a simplified version - in practice you'd need to create proper transfer instructions
  const transactionMessage = await createTransactionMessage({
    payer: getAddressFromPublicKey(fromKeypair.publicKey),
    instructions: [], // Would need proper transfer instruction here
  });

  // Get recent blockhash
  const { value: blockhash } = await rpc.getLatestBlockhash().send();
  transactionMessage.recentBlockhash = blockhash;

  return transactionMessage;
}

async function getAccountBalance(rpc, publicKey) {
  const { value: balance } = await rpc
    .getBalance(address(getAddressFromPublicKey(publicKey)))
    .send();
  return balance;
}

/**
 * Attempts to create a valid transaction from potentially incomplete transaction data
 * @param {Uint8Array} transactionBytes - Raw transaction bytes
 * @param {Keypair} keypair - The keypair to use for signing
 * @returns {Transaction} - A valid transaction object
 */
async function createValidTransactionFromBytes(transactionBytes, keypair) {
  try {
    // First, try to deserialize as-is
    return Transaction.from(transactionBytes);
  } catch (error) {
    TKHQ.logMessage(`⚠️ Direct deserialization failed: ${error.message}`);

    // If that fails, try to create a new transaction and copy over what we can
    const newTransaction = new Transaction();

    try {
      // Try to extract what we can from the original bytes
      // This is a fallback approach for incomplete transactions
      TKHQ.logMessage(
        `🔄 Attempting to create valid transaction from incomplete data...`
      );

      // Set the fee payer to the keypair's public key
      newTransaction.feePayer = keypair.publicKey;

      // Try to get a recent blockhash (this requires RPC connection)
      // For now, we'll create a placeholder
      newTransaction.recentBlockhash = "11111111111111111111111111111111";

      TKHQ.logMessage(
        `✅ Created transaction with fee payer: ${newTransaction.feePayer.toBase58()}`
      );
      TKHQ.logMessage(
        `⚠️ Note: This is a minimal transaction. You may need to add instructions manually.`
      );

      return newTransaction;
    } catch (fallbackError) {
      throw new Error(
        `Unable to create valid transaction: ${fallbackError.message}`
      );
    }
  }
}
