// This file is the main entrypoint of the webpack-bundled application

// Import relevant modules
import { TKHQ } from "./turnkey-core.js";
import { initEventHandlers } from "./event-handlers.js";
import { HpkeDecrypt } from "./crypto-utils.js";
import "./styles.css";

// Surface TKHQ for external access
window.TKHQ = TKHQ;

// Init app
document.addEventListener("DOMContentLoaded", async function () {
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

  TKHQ.sendMessageUp("PUBLIC_KEY_READY", targetPubHex);
});
