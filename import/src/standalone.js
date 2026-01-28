import "./standalone-styles.css";
import * as TKHQ from "./turnkey-core.js";
import { HpkeEncrypt } from "@shared/crypto-utils.js";

// Make TKHQ available globally
window.TKHQ = TKHQ;

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
 * Standalone-specific sendMessageUp that logs to DOM instead
 */
function sendMessageUpStandalone(type, value) {
  if (window.top !== null) {
    window.top.postMessage(
      {
        type: type,
        value: value,
      },
      "*"
    );
  }
  logMessage(`⬆️ Sent message ${type}: ${value}`);
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    // This is a workaround for how @turnkey/iframe-stamper is initialized. Currently,
    // init() waits for a public key to be initialized that can be used to send to the server
    // which will encrypt messages to this public key.
    // In the case of import, this public key is not used because the client encrypts messages
    // to the server's public key.
    sendMessageUpStandalone("PUBLIC_KEY_READY", "");

    // TODO: find a way to filter messages and ensure they're coming from the parent window?
    // We do not want to arbitrarily receive messages from all origins.
    window.addEventListener(
      "message",
      async function (event) {
        if (event.data && event.data["type"] == "INJECT_IMPORT_BUNDLE") {
          logMessage(
            `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}, ${event.data["organizationId"]}, ${event.data["userId"]}`
          );
          try {
            await onInjectImportBundle(
              event.data["value"],
              event.data["organizationId"],
              event.data["userId"]
            );
          } catch (e) {
            sendMessageUpStandalone("ERROR", e.toString());
          }
        }
        // TODO: deprecate EXTRACT_WALLET_ENCRYPTED_BUNDLE in favor of EXTRACT_ENCRYPTED_BUNDLE
        if (
          event.data &&
          event.data["type"] == "EXTRACT_WALLET_ENCRYPTED_BUNDLE"
        ) {
          logMessage(
            `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}`
          );
          try {
            await onExtractWalletEncryptedBundle(event.data["value"]);
          } catch (e) {
            sendMessageUpStandalone("ERROR", e.toString());
          }
        }
        if (
          event.data &&
          event.data["type"] == "EXTRACT_KEY_ENCRYPTED_BUNDLE"
        ) {
          logMessage(
            `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}, ${event.data["keyFormat"]}`
          );
          try {
            await onExtractKeyEncryptedBundle(
              event.data["value"],
              event.data["keyFormat"]
            );
          } catch (e) {
            sendMessageUpStandalone("ERROR", e.toString());
          }
        }
      },
      false
    );

    /**
     * Event handlers to power the import flow in standalone mode
     * Instead of receiving events from the parent page, forms trigger them.
     * This is useful for debugging as well.
     */
    document.getElementById("inject-import-bundle").addEventListener(
      "click",
      async (e) => {
        e.preventDefault();
        window.postMessage({
          type: "INJECT_IMPORT_BUNDLE",
          value: document.getElementById("import-bundle").value,
          organizationId: document.getElementById("organization-id").value,
          userId: document.getElementById("user-id").value,
        });
      },
      false
    );
    document.getElementById("encrypt-wallet-bundle").addEventListener(
      "click",
      async (e) => {
        e.preventDefault();
        window.postMessage({
          type: "EXTRACT_WALLET_ENCRYPTED_BUNDLE",
          value: document.getElementById("wallet-plaintext").value,
        });
      },
      false
    );
    document.getElementById("encrypt-key-bundle").addEventListener(
      "click",
      async (e) => {
        e.preventDefault();
        window.postMessage({
          type: "EXTRACT_KEY_ENCRYPTED_BUNDLE",
          value: document.getElementById("key-plaintext").value,
          keyFormat: document.getElementById("key-import-format").value,
        });
      },
      false
    );
  },
  false
);

/**
 * Function triggered when INJECT_IMPORT_BUNDLE event is received.
 * Parses the `import_bundle` and stores the target public key as a JWK
 * in local storage. Sends true upon success.
 * @param {string} bundle
 * Example bundle: {"targetPublic":"0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f","targetPublicSignature":"3045022100cefc333c330c9fa300d1aa10a439a76539b4d6967301638ab9edc9fd9468bfdb0220339bba7e2b00b45d52e941d068ecd3bfd16fd1926da69dd7769893268990d62f","enclaveQuorumPublic":"04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569"}
 * @param {string} organizationId
 * @param {string} userId
 */
async function onInjectImportBundle(bundle, organizationId, userId) {
  let targetPublicBuf;
  let verified;

  // Parse the import bundle
  const bundleObj = JSON.parse(bundle);

  switch (bundleObj.version) {
    case "v1.0.0": {
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
    }
    default:
      throw new Error(`unsupported version: ${bundleObj.version}`);
  }

  const targetPublicKeyJwk = await TKHQ.loadTargetKey(
    new Uint8Array(targetPublicBuf)
  );
  TKHQ.setTargetEmbeddedKey(targetPublicKeyJwk);

  // Send up BUNDLE_INJECTED message
  sendMessageUpStandalone("BUNDLE_INJECTED", true);
}

/**
 * Function triggered when EXTRACT_WALLET_ENCRYPTED_BUNDLE event is received.
 * Prerequisite: This function uses the target public key in local storage that is imported
 * from the INJECT_IMPORT_BUNDLE event.
 * Uses the target public key in local storage to encrypt the plaintextValue. Upon successful encryption, sends
 * an `encrypted_bundle` containing the ciphertext and encapped public key.
 * Example bundle: {"encappedPublic":"0497f33f3306f67f4402d4824e15b63b04786b6558d417aac2fef69051e46fa7bfbe776b142e4ded4f02097617a7588e93c53b71f900a4a8831a31be6f95e5f60f","ciphertext":"c17c3085505f3c094f0fa61791395b83ab1d8c90bdf9f12a64fc6e2e9cba266beb528f65c88bd933e36e6203752a9b63e6a92290a0ab6bf0ed591cf7bfa08006001e2cc63870165dc99ec61554ffdc14dea7d567e62cceed29314ae6c71a013843f5c06146dee5bf9c1d"}
 */
async function onExtractWalletEncryptedBundle(plaintextValue) {
  // Get target embedded key from previous step (onInjectImportBundle)
  const targetPublicKeyJwk = TKHQ.getTargetEmbeddedKey();
  if (targetPublicKeyJwk == null) {
    throw new Error("no target key found");
  }

  // Get plaintext wallet mnemonic
  const plaintext = plaintextValue.trim();
  if (!plaintext) {
    throw new Error("no wallet mnemonic entered");
  }
  const plaintextBuf = new TextEncoder().encode(plaintext);

  // Encrypt the bundle using the enclave target public key
  const encryptedBundle = await HpkeEncrypt({
    plaintextBuf,
    receiverPubJwk: targetPublicKeyJwk,
  });

  // Reset target embedded key after using for encryption
  TKHQ.resetTargetEmbeddedKey();

  // Send up ENCRYPTED_BUNDLE_EXTRACTED message
  sendMessageUpStandalone("ENCRYPTED_BUNDLE_EXTRACTED", encryptedBundle);
}

/**
 * Function triggered when EXTRACT_KEY_ENCRYPTED_BUNDLE event is received.
 * Prerequisite: This function uses the target public key in local storage that is imported
 * from the INJECT_IMPORT_BUNDLE event.
 * Uses the target public key in local storage to encrypt the plaintextValue. Upon successful encryption, sends
 * an `encrypted_bundle` containing the ciphertext and encapped public key.
 * Example bundle: {"encappedPublic":"0497f33f3306f67f4402d4824e15b63b04786b6558d417aac2fef69051e46fa7bfbe776b142e4ded4f02097617a7588e93c53b71f900a4a8831a31be6f95e5f60f","ciphertext":"c17c3085505f3c094f0fa61791395b83ab1d8c90bdf9f12a64fc6e2e9cba266beb528f65c88bd933e36e6203752a9b63e6a92290a0ab6bf0ed591cf7bfa08006001e2cc63870165dc99ec61554ffdc14dea7d567e62cceed29314ae6c71a013843f5c06146dee5bf9c1d"}
 */
async function onExtractKeyEncryptedBundle(plaintextValue, keyFormat) {
  // Get target embedded key from previous step (onInjectImportBundle)
  const targetPublicKeyJwk = TKHQ.getTargetEmbeddedKey();
  if (targetPublicKeyJwk == null) {
    throw new Error("no target key found");
  }

  // Get plaintext private key
  const plaintext = plaintextValue.trim();
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
  sendMessageUpStandalone("ENCRYPTED_BUNDLE_EXTRACTED", encryptedBundle);
}

// HpkeEncrypt is now imported from @shared/crypto-utils.js
