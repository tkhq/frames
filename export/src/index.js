// Import dependencies that will be managed by webpack
import * as hpke from '@hpke/core';
import { sha512 } from '@noble/hashes/sha512';
import { getPublicKey } from '@noble/ed25519';

// Import our modules
import { TKHQ } from './turnkey-core.js';
import { setupEventHandlers } from './event-handlers.js';
import { HpkeDecrypt } from './crypto-utils.js';
import './styles.css';

// Make dependencies available globally for the TKHQ module
window.hpke = hpke;
window.nobleHashes = { sha512 };
window.nobleEd25519 = { getPublicKey, etc: { sha512Sync: undefined } };

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
  // Set up noble-ed25519 sync function
  window.nobleEd25519.etc.sha512Sync = sha512;
  
  await TKHQ.initEmbeddedKey();
  const embeddedKeyJwk = await TKHQ.getEmbeddedKey();
  const targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
  const targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);
  document.getElementById('embedded-key').value = targetPubHex;

  // Set up event handlers
  setupEventHandlers(HpkeDecrypt);

  // If styles are saved in local storage, sanitize and apply them
  const styleSettings = TKHQ.getSettings();
  if (styleSettings) {
    TKHQ.applySettings(styleSettings);
  }
  
  TKHQ.sendMessageUp('PUBLIC_KEY_READY', targetPubHex);
});

// Handle MessageChannel initialization for iframe communication
window.addEventListener('message', async function(event) {
  if (
    event.data &&
    event.data['type'] == 'TURNKEY_INIT_MESSAGE_CHANNEL' &&
    event.ports?.[0]
  ) {
    const iframeMessagePort = event.ports[0];
    iframeMessagePort.onmessage = setupEventHandlers(HpkeDecrypt).messageEventListener;
    
    TKHQ.setParentFrameMessageChannelPort(iframeMessagePort);

    await TKHQ.initEmbeddedKey();
    const embeddedKeyJwk = await TKHQ.getEmbeddedKey();
    const targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
    const targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);
    document.getElementById('embedded-key').value = targetPubHex;

    TKHQ.sendMessageUp('PUBLIC_KEY_READY', targetPubHex);
  }
});
