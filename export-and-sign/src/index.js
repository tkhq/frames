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

// Init MessageChannel for communication between iframe <> parent page
window.addEventListener("message", async function (event) {
  if (
    event.data &&
    event.data["type"] == "TURNKEY_INIT_MESSAGE_CHANNEL" &&
    event.ports?.[0]
  ) {
    const iframeMessagePort = event.ports[0];
    iframeMessagePort.onmessage =
      initEventHandlers(HpkeDecrypt).messageEventListener;

    TKHQ.setParentFrameMessageChannelPort(iframeMessagePort);

    await TKHQ.initEmbeddedKey();
    const embeddedKeyJwk = await TKHQ.getEmbeddedKey();
    const targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
    const targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);
    document.getElementById("embedded-key").value = targetPubHex;

    TKHQ.sendMessageUp("PUBLIC_KEY_READY", targetPubHex);
  }
});
