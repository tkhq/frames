// This file is the main entrypoint of the webpack-bundled application

// Import relevant modules
import { TKHQ } from "./turnkey-core.js";
import { initEventHandlers } from "./event-handlers.js";
import { HpkeDecrypt } from "@turnkey/frames-shared";
import "./styles.css";

// Surface TKHQ for external access
window.TKHQ = TKHQ;

if (window.TURNKEY_E2E_TEST) {
  console.warn("E2E TEST ENVIRONMENT DETECTED");
  TKHQ.unsafeSkipDoubleIframeCheck();
}

// Init app
document.addEventListener("DOMContentLoaded", async function () {
  console.warn("DOM CONTENT LOADED");

  await TKHQ.initEmbeddedKey();
  const embeddedKeyJwk = await TKHQ.getEmbeddedKey();
  const targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
  const targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);
  document.getElementById("embedded-key").value = targetPubHex;

  initEventHandlers(HpkeDecrypt);

  // If styles are saved in local storage, sanitize and apply them
  const styleSettings = TKHQ.getSettings();
  if (styleSettings) {
    TKHQ.applySettings(styleSettings);
  }

  console.warn("SENDING MESSAGE UP");

  TKHQ.sendMessageUp("PUBLIC_KEY_READY", targetPubHex);
});
