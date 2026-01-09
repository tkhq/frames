/**
 * Turnkey Core Module - Import Frame
 * Imports shared core functionality and adds frame-specific features
 */

import * as SharedTKHQ from "@shared/turnkey-core.js";

// Re-export shared functions
const {
  setCryptoProvider,
  loadTargetKey,
  getTargetEmbeddedKey,
  setTargetEmbeddedKey,
  resetTargetEmbeddedKey,
  getSettings,
  setSettings,
  sendMessageUp,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  base58Decode,
  decodeKey,
  setParentFrameMessageChannelPort,
  normalizePadding,
  fromDerSignature,
  additionalAssociatedData,
  verifyEnclaveSignature,
  validateStyles: sharedValidateStyles,
} = SharedTKHQ;

// Frame-specific: validateStyles wrapper (import uses labelColor)
function validateStyles(styles) {
  return sharedValidateStyles(styles);
}

/**
 * Function to apply settings on this page. For now, the only settings that can be applied
 * are for "styles". Upon successful application, return the valid, sanitized settings JSON string.
 * Frame-specific implementation for import (applies to "plaintext" and "passphrase" elements).
 * @param {string} settings
 * @return {string}
 */
function applySettings(settings) {
  const validSettings = {};
  const settingsObj = JSON.parse(settings);

  const passphraseLabel = document.getElementById("passphrase-label");
  const mnemonicLabel = document.getElementById("mnemonic-label");
  const passphraseTextarea = document.getElementById("passphrase");

  if (!passphraseLabel || !passphraseTextarea) {
    throw new Error("no passphrase HTML elements found to apply settings to.");
  }
  const plaintextTextarea = document.getElementById("plaintext");
  if (!plaintextTextarea) {
    throw new Error(
      "no plaintext textarea HTML element found to apply settings to."
    );
  }

  // Apply enablePassphrase setting
  if (settingsObj.enablePassphrase === true) {
    passphraseLabel.style.display = "inline-block";
    passphraseTextarea.style.display = "inline-block";
    passphraseTextarea.style.border = "solid 1px #ccc";
    passphraseTextarea.style.borderRadius = "4px";

    mnemonicLabel.style.display = "inline-block";
    plaintextTextarea.style.border = "solid 1px #ccc";
    plaintextTextarea.style.borderRadius = "4px";

    validSettings["enablePassphrase"] = true;
  } else {
    passphraseLabel.style.display = "none";
    passphraseTextarea.style.display = "none";
    mnemonicLabel.style.display = "none";

    plaintextTextarea.style.border = "none";
    validSettings["enablePassphrase"] = false;
  }

  if (settingsObj.styles) {
    // Validate, sanitize, and apply the styles to the "plaintext" textarea.
    const validStyles = validateStyles(settingsObj.styles);
    Object.entries(validStyles).forEach(([key, value]) => {
      plaintextTextarea.style[key] = value;
    });

    if (validStyles.backgroundColor) {
      // Apply background color to document and body as well.
      document.documentElement.style.backgroundColor =
        validStyles.backgroundColor;
      document.body.style.backgroundColor = validStyles.backgroundColor;
    }

    if (validStyles.labelColor) {
      document.getElementById("mnemonic-label").style.color =
        validStyles.labelColor;
    }

    validSettings["styles"] = validStyles;
  }

  if (settingsObj.passphraseStyles) {
    // Validate, sanitize, and apply the styles to the "passphrase" textarea.
    const validStyles = validateStyles(settingsObj.passphraseStyles);
    Object.entries(validStyles).forEach(([key, value]) => {
      passphraseTextarea.style[key] = value;
    });

    if (validStyles.labelColor) {
      document.getElementById("passphrase-label").style.color =
        validStyles.labelColor;
    }

    validSettings["passphraseStyles"] = validStyles;
  }

  return JSON.stringify(validSettings);
}

export {
  setCryptoProvider,
  loadTargetKey,
  getTargetEmbeddedKey,
  setTargetEmbeddedKey,
  resetTargetEmbeddedKey,
  getSettings,
  setSettings,
  sendMessageUp,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  base58Decode,
  base58CheckDecode,
  decodeKey,
  setParentFrameMessageChannelPort,
  normalizePadding,
  fromDerSignature,
  additionalAssociatedData,
  verifyEnclaveSignature,
  validateStyles,
  applySettings,
};
