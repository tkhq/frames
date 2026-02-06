import "./standalone-styles.css";
import * as TKHQ from "./turnkey-core.js";
import { HpkeDecrypt } from "@shared/crypto-utils.js";

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
  logMessage(`\u2B06\uFE0F Sent message ${type}: ${value}`);
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await TKHQ.initEmbeddedKey();
    const embeddedKeyJwk = await TKHQ.getEmbeddedKey();
    const targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
    const targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);
    document.getElementById("embedded-key").value = targetPubHex;

    sendMessageUpStandalone("PUBLIC_KEY_READY", targetPubHex);

    window.addEventListener(
      "message",
      async function (event) {
        if (event.data && event.data["type"] == "INJECT_KEY_EXPORT_BUNDLE") {
          logMessage(
            `\u2B07\uFE0F Received message ${event.data["type"]}: ${event.data["value"]}, ${event.data["keyFormat"]}, ${event.data["organizationId"]}`
          );
          try {
            await onInjectKeyBundle(
              event.data["value"],
              event.data["keyFormat"],
              event.data["organizationId"]
            );
          } catch (e) {
            sendMessageUpStandalone("ERROR", e.toString());
          }
        }
        if (event.data && event.data["type"] == "INJECT_WALLET_EXPORT_BUNDLE") {
          logMessage(
            `\u2B07\uFE0F Received message ${event.data["type"]}: ${event.data["value"]}, ${event.data["organizationId"]}`
          );
          try {
            await onInjectWalletBundle(
              event.data["value"],
              event.data["organizationId"]
            );
          } catch (e) {
            sendMessageUpStandalone("ERROR", e.toString());
          }
        }
        if (event.data && event.data["type"] == "RESET_EMBEDDED_KEY") {
          logMessage(`\u2B07\uFE0F Received message ${event.data["type"]}`);
          try {
            TKHQ.onResetEmbeddedKey();
          } catch (e) {
            sendMessageUpStandalone("ERROR", e.toString());
          }
        }
      },
      false
    );

    /**
     * Event handlers to power the export flow in standalone mode
     * Instead of receiving events from the parent page, forms trigger them.
     * This is useful for debugging as well.
     */
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
    document.getElementById("inject-wallet").addEventListener(
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
    document.getElementById("reset").addEventListener(
      "click",
      async (e) => {
        e.preventDefault();
        window.postMessage({ type: "RESET_EMBEDDED_KEY" });
      },
      false
    );
  },
  false
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

  const keyDiv = document.getElementById("key-div");
  keyDiv.innerText = key;
  for (let styleKey in style) {
    keyDiv.style[styleKey] = style[styleKey];
  }
  document.body.appendChild(keyDiv);
}

/**
 * Parse and decrypt the export bundle.
 * @param {string} bundle
 * @param {string} organizationId
 */
async function decryptBundle(bundle, organizationId) {
  let encappedKeyBuf;
  let ciphertextBuf;
  let verified;

  const bundleObj = JSON.parse(bundle);
  switch (bundleObj.version) {
    case "v1.0.0": {
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
      verified = await TKHQ.verifyEnclaveSignature(
        bundleObj.enclaveQuorumPublic,
        bundleObj.dataSignature,
        bundleObj.data
      );
      if (!verified) {
        throw new Error(`failed to verify enclave signature: ${bundle}`);
      }

      const signedData = JSON.parse(
        new TextDecoder().decode(TKHQ.uint8arrayFromHexString(bundleObj.data))
      );

      if (!organizationId) {
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
    }
    default:
      throw new Error(`unsupported version: ${bundleObj.version}`);
  }

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
 */
async function onInjectKeyBundle(bundle, keyFormat, organizationId) {
  const keyBytes = await decryptBundle(bundle, organizationId);

  TKHQ.onResetEmbeddedKey();

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

  displayKey(key);

  sendMessageUpStandalone("BUNDLE_INJECTED", true);
}

/**
 * Function triggered when INJECT_WALLET_EXPORT_BUNDLE event is received.
 * @param {string} bundle
 * @param {string} organizationId
 */
async function onInjectWalletBundle(bundle, organizationId) {
  const walletBytes = await decryptBundle(bundle, organizationId);

  TKHQ.onResetEmbeddedKey();

  const wallet = TKHQ.encodeWallet(new Uint8Array(walletBytes));

  displayKey(wallet.mnemonic);

  sendMessageUpStandalone("BUNDLE_INJECTED", true);
}
