import "./styles.css";
import * as hpke from "@hpke/core";
import * as TKHQ from "./turnkey-core.js";

// Make TKHQ available globally for backwards compatibility
window.TKHQ = TKHQ;

// persist the MessageChannel object so we can use it to communicate with the parent window
var iframeMessagePort = null;

// controllers to remove event listeners
const messageListenerController = new AbortController();
const turnkeyInitController = new AbortController();

/**
 * Message Event Handlers to process messages from the parent frame
 */
var messageEventListener = async function (event) {
  if (event.data && event.data["type"] == "INJECT_IMPORT_BUNDLE") {
    try {
      await onInjectImportBundle(
        event.data["value"],
        event.data["organizationId"],
        event.data["userId"],
        event.data["requestId"]
      );
    } catch (e) {
      TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
    }
  }
  if (event.data && event.data["type"] == "EXTRACT_WALLET_ENCRYPTED_BUNDLE") {
    try {
      await onExtractWalletEncryptedBundle(event.data["requestId"]);
    } catch (e) {
      TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
    }
  }
  if (event.data && event.data["type"] == "EXTRACT_KEY_ENCRYPTED_BUNDLE") {
    try {
      await onExtractKeyEncryptedBundle(
        event.data["keyFormat"],
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
};

/**
 * Broadcast that the frame is ready and set up the message event listeners
 */
document.addEventListener(
  "DOMContentLoaded",
  async function () {
    window.addEventListener("message", messageEventListener, {
      capture: false,
      signal: messageListenerController.signal,
    });

    if (!messageListenerController.signal.aborted) {
      // If styles are saved in local storage, sanitize and apply them.
      const styleSettings = TKHQ.getSettings();
      if (styleSettings) {
        TKHQ.applySettings(styleSettings);
      }
      // This is a workaround for how @turnkey/iframe-stamper is initialized. Currently,
      // init() waits for a public key to be initialized that can be used to send to the server
      // which will encrypt messages to this public key.
      // In the case of import, this public key is not used because the client encrypts messages
      // to the server's public key.
      TKHQ.sendMessageUp("PUBLIC_KEY_READY", "");

      const plaintextTextarea = document.getElementById("plaintext");
      if (!plaintextTextarea) return;
      // Clear clipboard after paste to avoid sensitive data lingering in clipboard.

      plaintextTextarea.addEventListener("paste", async () => {
        // Let the paste happen first
        try {
          // Check clipboard-write permission first. In new versions of iframe-stamper, we add this permission when creating the iframe. In older versions, this permission is not added.
          const permStatus = await navigator.permissions
            .query({ name: "clipboard-write" }) // This is required to avoid error on clipboard write
            .catch(() => null);

          // Proceed only if granted or promptable
          if (
            permStatus?.state === "granted" ||
            permStatus?.state === "prompt"
          ) {
            await navigator.clipboard.writeText("");
          }
        } catch {
          // Silently ignore any errors — no warnings or console noise
        }
      });
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

      // This is a workaround for how @turnkey/iframe-stamper is initialized. Currently,
      // init() waits for a public key to be initialized that can be used to send to the server
      // which will encrypt messages to this public key.
      // In the case of import, this public key is not used because the client encrypts messages
      // to the server's public key.
      TKHQ.sendMessageUp("PUBLIC_KEY_READY", "");

      // remove the listener for TURNKEY_INIT_MESSAGE_CHANNEL after it's been processed
      turnkeyInitController.abort();
    }
  },
  { signal: turnkeyInitController.signal }
);

// make sure the mnemonic does not include our splitter (\n--PASS--\n) string or \n characters
function validateMnemonic(mnemonic) {
  if (mnemonic.includes("\n--PASS--\n")) {
    throw new Error('mnemonic cannot include the string "\\n--PASS--\\n"');
  }
  if (mnemonic.includes("\n")) {
    throw new Error("mnemonic cannot include newline characters");
  }
}

/**
 * Function triggered when INJECT_IMPORT_BUNDLE event is received.
 * Parses the `import_bundle` and stores the target public key as a JWK
 * in local storage. Sends true upon success.
 * @param {string} bundle
 * Example bundle: {"targetPublic":"0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f","targetPublicSignature":"3045022100cefc333c330c9fa300d1aa10a439a76539b4d6967301638ab9edc9fd9468bfdb0220339bba7e2b00b45d52e941d068ecd3bfd16fd1926da69dd7769893268990d62f","enclaveQuorumPublic":"04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569"}
 * @param {string} organizationId
 * @param {string} userId
 * @param {string} requestId
 */
async function onInjectImportBundle(bundle, organizationId, userId, requestId) {
  let targetPublicBuf;
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
        // TODO: throw error if organization id is undefined once we've fully transitioned to v1.0.0 server messages and v2.0.0 iframe-stamper
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
      if (!userId) {
        // TODO: throw error if user id is undefined once we've fully transitioned to v1.0.0 server messages and v2.0.0 iframe-stamper
        console.warn(
          'we highly recommend a version of @turnkey/iframe-stamper >= v2.0.0 to pass "userId" for security purposes.'
        );
      } else if (!signedData.userId || signedData.userId !== userId) {
        throw new Error(
          `user id does not match expected value. Expected: ${userId}. Found: ${signedData.userId}.`
        );
      }

      if (!signedData.targetPublic) {
        throw new Error('missing "targetPublic" in bundle signed data');
      }

      // Load target public key generated from enclave and set in local storage
      targetPublicBuf = TKHQ.uint8arrayFromHexString(signedData.targetPublic);
      break;
    default:
      throw new Error(`unsupported version: ${bundleObj.version}`);
  }

  const targetPublicKeyJwk = await TKHQ.loadTargetKey(
    new Uint8Array(targetPublicBuf)
  );
  TKHQ.setTargetEmbeddedKey(targetPublicKeyJwk);

  // Send up BUNDLE_INJECTED message
  TKHQ.sendMessageUp("BUNDLE_INJECTED", true, requestId);
}

/**
 * Function triggered when EXTRACT_WALLET_ENCRYPTED_BUNDLE event is received.
 * Prerequisite: This function uses the target public key in local storage that is imported
 * from the INJECT_IMPORT_BUNDLE event.
 * Uses the target public key in local storage to encrypt the text entered in the
 * `plaintext` textarea element. Upon successful encryption, sends
 * an `encrypted_bundle` containing the ciphertext and encapped public key.
 * Example bundle: {"encappedPublic":"0497f33f3306f67f4402d4824e15b63b04786b6558d417aac2fef69051e46fa7bfbe776b142e4ded4f02097617a7588e93c53b71f900a4a8831a31be6f95e5f60f","ciphertext":"c17c3085505f3c094f0fa61791395b83ab1d8c90bdf9f12a64fc6e2e9cba266beb528f65c88bd933e36e6203752a9b63e6a92290a0ab6bf0ed591cf7bfa08006001e2cc63870165dc99ec61554ffdc14dea7d567e62cceed29314ae6c71a013843f5c06146dee5bf9c1d"}
 * @param {string} requestId
 */
async function onExtractWalletEncryptedBundle(requestId) {
  // Get target embedded key from previous step (onInjectImportBundle)
  const targetPublicKeyJwk = TKHQ.getTargetEmbeddedKey();
  if (targetPublicKeyJwk == null) {
    throw new Error("no target key found");
  }

  // Get plaintext wallet mnemonic
  const plaintext = document.getElementById("plaintext").value.trim();
  if (!plaintext) {
    throw new Error("no wallet mnemonic entered");
  }
  
  const passphrase = document.getElementById("passphrase").value.trim();

  validateMnemonic(plaintext);

  const combined = passphrase === "" ? plaintext : `${plaintext}\n--PASS--\n${passphrase}`;
  const plaintextBuf = new TextEncoder().encode(combined);

  // Encrypt the bundle using the enclave target public key
  const encryptedBundle = await HpkeEncrypt({
    plaintextBuf,
    receiverPubJwk: targetPublicKeyJwk,
  });

  // Reset target embedded key after using for encryption
  TKHQ.resetTargetEmbeddedKey();

  // Send up ENCRYPTED_BUNDLE_EXTRACTED message
  TKHQ.sendMessageUp("ENCRYPTED_BUNDLE_EXTRACTED", encryptedBundle, requestId);
}

/**
 * Function triggered when EXTRACT_KEY_ENCRYPTED_BUNDLE event is received.
 * Prerequisite: This function uses the target public key in local storage that is imported
 * from the INJECT_IMPORT_BUNDLE event.
 * Uses the target public key in local storage to encrypt the text entered in the
 * `plaintext` textarea element. Upon successful encryption, sends
 * an `encrypted_bundle` containing the ciphertext and encapped public key.
 * Example bundle: {"encappedPublic":"0497f33f3306f67f4402d4824e15b63b04786b6558d417aac2fef69051e46fa7bfbe776b142e4ded4f02097617a7588e93c53b71f900a4a8831a31be6f95e5f60f","ciphertext":"c17c3085505f3c094f0fa61791395b83ab1d8c90bdf9f12a64fc6e2e9cba266beb528f65c88bd933e36e6203752a9b63e6a92290a0ab6bf0ed591cf7bfa08006001e2cc63870165dc99ec61554ffdc14dea7d567e62cceed29314ae6c71a013843f5c06146dee5bf9c1d"}
 * @param {string} keyFormat
 * @param {string} requestId
 */
async function onExtractKeyEncryptedBundle(keyFormat, requestId) {
  // Get target embedded key from previous step (onInjectImportBundle)
  const targetPublicKeyJwk = TKHQ.getTargetEmbeddedKey();
  if (targetPublicKeyJwk == null) {
    throw new Error("no target key found");
  }

  // Get plaintext private key
  const plaintext = document.getElementById("plaintext").value.trim();
  if (!plaintext) {
    throw new Error("no private key entered");
  }
  const plaintextBuf = TKHQ.decodeKey(plaintext, keyFormat);

  // Encrypt the bundle using the enclave target public key
  const encryptedBundle = await HpkeEncrypt({
    plaintextBuf,
    receiverPubJwk: targetPublicKeyJwk,
  });

  // Reset target embedded key after using for encryption
  TKHQ.resetTargetEmbeddedKey();

  // Send up ENCRYPTED_BUNDLE_EXTRACTED message
  TKHQ.sendMessageUp("ENCRYPTED_BUNDLE_EXTRACTED", encryptedBundle, requestId);
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

async function HpkeEncrypt({ plaintextBuf, receiverPubJwk }) {
  const kemContext = new hpke.DhkemP256HkdfSha256();
  const receiverPub = await kemContext.importKey(
    "jwk",
    { ...receiverPubJwk },
    true
  );

  const suite = new hpke.CipherSuite({
    kem: kemContext,
    kdf: new hpke.HkdfSha256(),
    aead: new hpke.Aes256Gcm(),
  });

  const senderCtx = await suite.createSenderContext({
    recipientPublicKey: receiverPub,
    info: new TextEncoder().encode("turnkey_hpke"),
  });

  // Need to import the key again as a JWK to export as a raw key, the format needed to
  // create the aad with the newly generated raw encapped key.
  const receiverPubCryptoKey = await crypto.subtle.importKey(
    "jwk",
    receiverPubJwk,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    []
  );
  const receiverPubRaw = await crypto.subtle.exportKey(
    "raw",
    receiverPubCryptoKey
  );
  const receiverPubBuf = new Uint8Array(receiverPubRaw);

  const encappedKeyBuf = new Uint8Array(senderCtx.enc);

  const aad = TKHQ.additionalAssociatedData(encappedKeyBuf, receiverPubBuf);

  var ciphertextBuf;
  try {
    ciphertextBuf = await senderCtx.seal(plaintextBuf, aad);
  } catch (e) {
    throw new Error("failed to encrypt import bundle: " + e.toString());
  }

  const ciphertextHex = TKHQ.uint8arrayToHexString(
    new Uint8Array(ciphertextBuf)
  );
  const encappedKeyBufHex = TKHQ.uint8arrayToHexString(encappedKeyBuf);
  const encryptedBundle = JSON.stringify({
    encappedPublic: encappedKeyBufHex,
    ciphertext: ciphertextHex,
  });
  return encryptedBundle;
}
