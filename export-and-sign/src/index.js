// This file is the main entrypoint of the webpack-bundled application

// Import relevant modules
import { TKHQ } from "./turnkey-core.js";
import { initEventHandlers } from "./event-handlers.js";
import { HpkeDecrypt } from "@shared/crypto-utils.js";
import "./styles.css";

// Surface TKHQ for external access
window.TKHQ = TKHQ;

// Init app
document.addEventListener("DOMContentLoaded", async function () {
  initEventHandlers(HpkeDecrypt);

  // If styles are saved in local storage, sanitize and apply them
  const styleSettings = TKHQ.getSettings();
  if (styleSettings) {
    TKHQ.applySettings(styleSettings);
  }

  if (window.parent === window) {
    // Standalone mode has no parent; scope the persisted key to this
    // document's own origin.
    await TKHQ.initEmbeddedKey(window.location.origin);
  } else {
    // Embedded mode: create a document-scoped ephemeral key so legacy
    // (@turnkey/iframe-stamper < 2.1.0) parents, which passively wait for
    // PUBLIC_KEY_READY, can finish init(). Modern parents supersede it with
    // a persistent key scoped to their browser-authenticated origin during
    // the MessageChannel handshake (see event-handlers.js).
    await TKHQ.initEphemeralEmbeddedKey();
  }

  const embeddedKeyJwk = await TKHQ.getEmbeddedKey();
  const targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
  const targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);
  document.getElementById("embedded-key").value = targetPubHex;

  if (window.parent !== window) {
    // The parent origin is not known yet, but announcing the (non-secret)
    // public key broadly is required to bootstrap legacy clients.
    TKHQ.sendMessageUp("PUBLIC_KEY_READY", targetPubHex);
  }
});
