/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 28382:
/*!********************************!*\
  !*** ../shared/dist/index.mjs ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HpkeDecrypt: () => (/* reexport safe */ _crypto_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.HpkeDecrypt),
/* harmony export */   HpkeEncrypt: () => (/* reexport safe */ _crypto_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.HpkeEncrypt),
/* harmony export */   additionalAssociatedData: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.additionalAssociatedData),
/* harmony export */   base58CheckDecode: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.base58CheckDecode),
/* harmony export */   base58Decode: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.base58Decode),
/* harmony export */   base58Encode: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.base58Encode),
/* harmony export */   decodeKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.decodeKey),
/* harmony export */   encodeKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.encodeKey),
/* harmony export */   fromDerSignature: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.fromDerSignature),
/* harmony export */   generateTargetKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.generateTargetKey),
/* harmony export */   getEmbeddedKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.getEmbeddedKey),
/* harmony export */   getItemWithExpiry: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.getItemWithExpiry),
/* harmony export */   getSettings: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.getSettings),
/* harmony export */   getSubtleCrypto: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.getSubtleCrypto),
/* harmony export */   getTargetEmbeddedKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.getTargetEmbeddedKey),
/* harmony export */   initEmbeddedKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.initEmbeddedKey),
/* harmony export */   loadQuorumKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.loadQuorumKey),
/* harmony export */   loadTargetKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.loadTargetKey),
/* harmony export */   logMessage: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.logMessage),
/* harmony export */   normalizePadding: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.normalizePadding),
/* harmony export */   onResetEmbeddedKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.onResetEmbeddedKey),
/* harmony export */   p256JWKPrivateToPublic: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.p256JWKPrivateToPublic),
/* harmony export */   parsePrivateKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.parsePrivateKey),
/* harmony export */   resetTargetEmbeddedKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.resetTargetEmbeddedKey),
/* harmony export */   sendMessageUp: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.sendMessageUp),
/* harmony export */   setCryptoProvider: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.setCryptoProvider),
/* harmony export */   setEmbeddedKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.setEmbeddedKey),
/* harmony export */   setItemWithExpiry: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.setItemWithExpiry),
/* harmony export */   setParentFrameMessageChannelPort: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.setParentFrameMessageChannelPort),
/* harmony export */   setSettings: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.setSettings),
/* harmony export */   setTargetEmbeddedKey: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.setTargetEmbeddedKey),
/* harmony export */   uint8arrayFromHexString: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.uint8arrayFromHexString),
/* harmony export */   uint8arrayToHexString: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.uint8arrayToHexString),
/* harmony export */   unsafeSkipDoubleIframeCheck: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.unsafeSkipDoubleIframeCheck),
/* harmony export */   validateStyles: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.validateStyles),
/* harmony export */   verifyEnclaveSignature: () => (/* reexport safe */ _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__.verifyEnclaveSignature)
/* harmony export */ });
/* harmony import */ var _crypto_utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./crypto-utils.mjs */ 62081);
/* harmony import */ var _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./turnkey-core.mjs */ 67180);


//# sourceMappingURL=index.mjs.map


/***/ }),

/***/ 43654:
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.3_webpack@5.102.1/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ 84455);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.3_webpack@5.102.1/node_modules/style-loader/dist/runtime/styleDomAPI.js */ 51812);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.3_webpack@5.102.1/node_modules/style-loader/dist/runtime/insertBySelector.js */ 86600);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.3_webpack@5.102.1/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ 58575);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.3_webpack@5.102.1/node_modules/style-loader/dist/runtime/insertStyleElement.js */ 72963);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/.pnpm/style-loader@3.3.3_webpack@5.102.1/node_modules/style-loader/dist/runtime/styleTagTransform.js */ 60592);
/* harmony import */ var _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/.pnpm/css-loader@6.8.1_webpack@5.102.1/node_modules/css-loader/dist/cjs.js!./styles.css */ 89204);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_pnpm_style_loader_3_3_3_webpack_5_102_1_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../node_modules/.pnpm/css-loader@6.8.1_webpack@5.102.1/node_modules/css-loader/dist/cjs.js!./styles.css */ 89204,
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/.pnpm/css-loader@6.8.1_webpack@5.102.1/node_modules/css-loader/dist/cjs.js!./styles.css */ 89204);
 return (function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ 46340:
/*!*****************************!*\
  !*** ./src/turnkey-core.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TKHQ: () => (/* binding */ TKHQ)
/* harmony export */ });
/* harmony import */ var _noble_ed25519__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @noble/ed25519 */ 3376);
/* harmony import */ var _noble_hashes_sha512__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @noble/hashes/sha512 */ 72719);
/* harmony import */ var _turnkey_crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @turnkey/crypto */ 13382);
/* harmony import */ var _turnkey_frames_shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @turnkey/frames-shared */ 28382);





const {
  initEmbeddedKey,
  generateTargetKey,
  setItemWithExpiry,
  getItemWithExpiry,
  getEmbeddedKey,
  setEmbeddedKey,
  onResetEmbeddedKey,
  p256JWKPrivateToPublic,
  base58Encode,
  base58Decode,
  encodeKey,
  sendMessageUp,
  logMessage,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  setParentFrameMessageChannelPort,
  normalizePadding,
  additionalAssociatedData,
  getSettings,
  setSettings,
  parsePrivateKey,
  unsafeSkipDoubleIframeCheck,
  validateStyles,
  verifyEnclaveSignature,
} = _turnkey_frames_shared__WEBPACK_IMPORTED_MODULE_3__;

/**
 * Returns the public key bytes for a hex-encoded Ed25519 private key.
 * @param {string} privateKeyHex
 */
function getEd25519PublicKey(privateKeyHex) {
  _noble_ed25519__WEBPACK_IMPORTED_MODULE_0__.etc.sha512Sync = (...m) =>
    _noble_hashes_sha512__WEBPACK_IMPORTED_MODULE_1__.sha512(_noble_ed25519__WEBPACK_IMPORTED_MODULE_0__.etc.concatBytes(...m));
  return _noble_ed25519__WEBPACK_IMPORTED_MODULE_0__.getPublicKey(privateKeyHex);
}

/**
 * Function to apply settings on this page. For now, the only settings that can be applied
 * are for "styles". Upon successful application, return the valid, sanitized settings JSON string.
 * @param {string} settings
 * @return {string}
 */
function applySettings(settings) {
  const validSettings = {};
  if (!settings) {
    return JSON.stringify(validSettings);
  }
  const settingsObj = JSON.parse(settings);
  if (settingsObj.styles) {
    // Valid styles will be applied the "key-div" div HTML element.
    const keyDivTextarea = document.getElementById("key-div");
    if (!keyDivTextarea) {
      throw new Error("no key-div HTML element found to apply settings to.");
    }

    // Validate, sanitize, and apply the styles to the "key-div" div element.
    const validStyles = validateStyles(settingsObj.styles);
    Object.entries(validStyles).forEach(([key, value]) => {
      keyDivTextarea.style[key] = value;
    });

    validSettings["styles"] = validStyles;
  }

  return JSON.stringify(validSettings);
}

const TKHQ = {
  initEmbeddedKey,
  generateTargetKey,
  setItemWithExpiry,
  getItemWithExpiry,
  getEmbeddedKey,
  setEmbeddedKey,
  onResetEmbeddedKey,
  p256JWKPrivateToPublic,
  base58Encode,
  base58Decode,
  encodeKey,
  sendMessageUp,
  logMessage,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  setParentFrameMessageChannelPort,
  normalizePadding,
  fromDerSignature: _turnkey_crypto__WEBPACK_IMPORTED_MODULE_2__.fromDerSignature,
  additionalAssociatedData,
  verifyEnclaveSignature,
  getEd25519PublicKey,
  applySettings,
  validateStyles,
  getSettings,
  setSettings,
  parsePrivateKey,
  unsafeSkipDoubleIframeCheck,
};


/***/ }),

/***/ 48677:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 60044:
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./turnkey-core.js */ 46340);
/* harmony import */ var _event_handlers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-handlers.js */ 92728);
/* harmony import */ var _turnkey_frames_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @turnkey/frames-shared */ 28382);
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.css */ 43654);
// This file is the main entrypoint of the webpack-bundled application

// Import relevant modules





// Surface TKHQ for external access
window.TKHQ = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ;

if (true) {
  console.warn("E2E TEST ENVIRONMENT DETECTED");
  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.unsafeSkipDoubleIframeCheck();
}

// Init app
document.addEventListener("DOMContentLoaded", async function () {
  console.warn("DOM CONTENT LOADED");

  await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.initEmbeddedKey();
  const embeddedKeyJwk = await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.getEmbeddedKey();
  const targetPubBuf = await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
  const targetPubHex = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayToHexString(targetPubBuf);
  document.getElementById("embedded-key").value = targetPubHex;

  (0,_event_handlers_js__WEBPACK_IMPORTED_MODULE_1__.initEventHandlers)(_turnkey_frames_shared__WEBPACK_IMPORTED_MODULE_2__.HpkeDecrypt);

  // If styles are saved in local storage, sanitize and apply them
  const styleSettings = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.getSettings();
  if (styleSettings) {
    _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.applySettings(styleSettings);
  }

  console.warn("SENDING MESSAGE UP");

  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("PUBLIC_KEY_READY", targetPubHex);
});


/***/ }),

/***/ 62081:
/*!***************************************!*\
  !*** ../shared/dist/crypto-utils.mjs ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HpkeDecrypt: () => (/* binding */ HpkeDecrypt),
/* harmony export */   HpkeEncrypt: () => (/* binding */ HpkeEncrypt)
/* harmony export */ });
/* harmony import */ var _turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./turnkey-core.mjs */ 67180);
/* harmony import */ var _hpke_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @hpke/core */ 44431);



/**
 * Crypto Utilities - Shared
 * Contains HPKE encryption and decryption functions
 */


// Pre-compute const (for perf)
const TURNKEY_HPKE_INFO = new TextEncoder().encode("turnkey_hpke");

/**
 * Decrypt the ciphertext (ArrayBuffer) given an encapsulation key (ArrayBuffer)
 * and the receivers private key (JSON Web Key).
 */
async function HpkeDecrypt({
  ciphertextBuf,
  encappedKeyBuf,
  receiverPrivJwk,
}) {
  const kemContext = new _hpke_core__WEBPACK_IMPORTED_MODULE_1__.DhkemP256HkdfSha256();
  var receiverPriv = await kemContext.importKey(
    "jwk",
    { ...receiverPrivJwk },
    false
  );

  var suite = new _hpke_core__WEBPACK_IMPORTED_MODULE_1__.CipherSuite({
    kem: kemContext,
    kdf: new _hpke_core__WEBPACK_IMPORTED_MODULE_1__.HkdfSha256(),
    aead: new _hpke_core__WEBPACK_IMPORTED_MODULE_1__.Aes256Gcm(),
  });

  var recipientCtx = await suite.createRecipientContext({
    recipientKey: receiverPriv,
    enc: encappedKeyBuf,
    info: TURNKEY_HPKE_INFO,
  });

  var receiverPubBuf = await (0,_turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_0__.p256JWKPrivateToPublic)(receiverPrivJwk);
  var aad = (0,_turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_0__.additionalAssociatedData)(encappedKeyBuf, receiverPubBuf);
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

/**
 * Encrypt plaintext using HPKE with the receiver's public key.
 * @param {Object} params
 * @param {Uint8Array} params.plaintextBuf - Plaintext to encrypt
 * @param {JsonWebKey} params.receiverPubJwk - Receiver's public key in JWK format
 * @returns {Promise<string>} JSON stringified encrypted bundle with encappedPublic and ciphertext
 */
async function HpkeEncrypt({ plaintextBuf, receiverPubJwk }) {
  const kemContext = new _hpke_core__WEBPACK_IMPORTED_MODULE_1__.DhkemP256HkdfSha256();
  const receiverPub = await kemContext.importKey(
    "jwk",
    { ...receiverPubJwk },
    true
  );

  const suite = new _hpke_core__WEBPACK_IMPORTED_MODULE_1__.CipherSuite({
    kem: kemContext,
    kdf: new _hpke_core__WEBPACK_IMPORTED_MODULE_1__.HkdfSha256(),
    aead: new _hpke_core__WEBPACK_IMPORTED_MODULE_1__.Aes256Gcm(),
  });

  const senderCtx = await suite.createSenderContext({
    recipientPublicKey: receiverPub,
    info: TURNKEY_HPKE_INFO,
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

  const aad = (0,_turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_0__.additionalAssociatedData)(encappedKeyBuf, receiverPubBuf);

  var ciphertextBuf;
  try {
    ciphertextBuf = await senderCtx.seal(plaintextBuf, aad);
  } catch (e) {
    throw new Error("failed to encrypt import bundle: " + e.toString());
  }

  const ciphertextHex = (0,_turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_0__.uint8arrayToHexString)(new Uint8Array(ciphertextBuf));
  const encappedKeyBufHex = (0,_turnkey_core_mjs__WEBPACK_IMPORTED_MODULE_0__.uint8arrayToHexString)(encappedKeyBuf);
  const encryptedBundle = JSON.stringify({
    encappedPublic: encappedKeyBufHex,
    ciphertext: ciphertextHex,
  });
  return encryptedBundle;
}


//# sourceMappingURL=crypto-utils.mjs.map


/***/ }),

/***/ 67180:
/*!***************************************!*\
  !*** ../shared/dist/turnkey-core.mjs ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   additionalAssociatedData: () => (/* binding */ additionalAssociatedData),
/* harmony export */   base58CheckDecode: () => (/* binding */ base58CheckDecode),
/* harmony export */   base58Decode: () => (/* binding */ base58Decode),
/* harmony export */   base58Encode: () => (/* binding */ base58Encode),
/* harmony export */   decodeKey: () => (/* binding */ decodeKey),
/* harmony export */   encodeKey: () => (/* binding */ encodeKey),
/* harmony export */   fromDerSignature: () => (/* binding */ fromDerSignature),
/* harmony export */   generateTargetKey: () => (/* binding */ generateTargetKey),
/* harmony export */   getEmbeddedKey: () => (/* binding */ getEmbeddedKey),
/* harmony export */   getItemWithExpiry: () => (/* binding */ getItemWithExpiry),
/* harmony export */   getSettings: () => (/* binding */ getSettings),
/* harmony export */   getSubtleCrypto: () => (/* binding */ getSubtleCrypto),
/* harmony export */   getTargetEmbeddedKey: () => (/* binding */ getTargetEmbeddedKey),
/* harmony export */   initEmbeddedKey: () => (/* binding */ initEmbeddedKey),
/* harmony export */   loadQuorumKey: () => (/* binding */ loadQuorumKey),
/* harmony export */   loadTargetKey: () => (/* binding */ loadTargetKey),
/* harmony export */   logMessage: () => (/* binding */ logMessage),
/* harmony export */   normalizePadding: () => (/* binding */ normalizePadding),
/* harmony export */   onResetEmbeddedKey: () => (/* binding */ onResetEmbeddedKey),
/* harmony export */   p256JWKPrivateToPublic: () => (/* binding */ p256JWKPrivateToPublic),
/* harmony export */   parsePrivateKey: () => (/* binding */ parsePrivateKey),
/* harmony export */   resetTargetEmbeddedKey: () => (/* binding */ resetTargetEmbeddedKey),
/* harmony export */   sendMessageUp: () => (/* binding */ sendMessageUp),
/* harmony export */   setCryptoProvider: () => (/* binding */ setCryptoProvider),
/* harmony export */   setEmbeddedKey: () => (/* binding */ setEmbeddedKey),
/* harmony export */   setItemWithExpiry: () => (/* binding */ setItemWithExpiry),
/* harmony export */   setParentFrameMessageChannelPort: () => (/* binding */ setParentFrameMessageChannelPort),
/* harmony export */   setSettings: () => (/* binding */ setSettings),
/* harmony export */   setTargetEmbeddedKey: () => (/* binding */ setTargetEmbeddedKey),
/* harmony export */   uint8arrayFromHexString: () => (/* binding */ uint8arrayFromHexString),
/* harmony export */   uint8arrayToHexString: () => (/* binding */ uint8arrayToHexString),
/* harmony export */   unsafeSkipDoubleIframeCheck: () => (/* binding */ unsafeSkipDoubleIframeCheck),
/* harmony export */   validateStyles: () => (/* binding */ validateStyles),
/* harmony export */   verifyEnclaveSignature: () => (/* binding */ verifyEnclaveSignature)
/* harmony export */ });
/* harmony import */ var bech32__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bech32 */ 23604);


/**
 * Turnkey Core Module - Shared
 * Contains all the core cryptographic and utility functions shared across frames
 */

/** constants for LocalStorage */
const TURNKEY_EMBEDDED_KEY = "TURNKEY_EMBEDDED_KEY";
const TURNKEY_TARGET_EMBEDDED_KEY = "TURNKEY_TARGET_EMBEDDED_KEY";
const TURNKEY_SETTINGS = "TURNKEY_SETTINGS";
/** 48 hours in milliseconds */
const TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS = 1000 * 60 * 60 * 48;
const TURNKEY_EMBEDDED_KEY_ORIGIN = "TURNKEY_EMBEDDED_KEY_ORIGIN";

let parentFrameMessageChannelPort = null;
var cryptoProviderOverride = null;

/*
 * Returns a reference to the WebCrypto subtle interface regardless of the host environment.
 */
function getSubtleCrypto() {
  if (cryptoProviderOverride && cryptoProviderOverride.subtle) {
    return cryptoProviderOverride.subtle;
  }
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    globalThis.crypto.subtle
  ) {
    return globalThis.crypto.subtle;
  }
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    return window.crypto.subtle;
  }
  if (typeof global !== "undefined" && global.crypto && global.crypto.subtle) {
    return global.crypto.subtle;
  }
  if (typeof crypto !== "undefined" && crypto.subtle) {
    return crypto.subtle;
  }

  return null;
}

/*
 * Allows tests to explicitly set the crypto provider (e.g. crypto.webcrypto) when the runtime
 * environment does not expose one on the global/window objects.
 */
function setCryptoProvider(cryptoProvider) {
  cryptoProviderOverride = cryptoProvider || null;
}

/* Security functions */

let unsafeDoubleFrameCheckSkipped = false;

function isDoublyIframed() {
  if (unsafeDoubleFrameCheckSkipped) return false;

  if (window.location.ancestorOrigins !== undefined) {
    // Does not exist in IE and firefox.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Location/ancestorOrigins for how this works
    return window.location.ancestorOrigins.length > 1;
  } else {
    return window.parent !== window.top;
  }
}

function unsafeSkipDoubleIframeCheck() {
  unsafeDoubleFrameCheckSkipped = true;
}

/*
 * Loads the quorum public key as a CryptoKey.
 */
async function loadQuorumKey(quorumPublic) {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto subtle API is unavailable");
  }
  return await subtle.importKey(
    "raw",
    quorumPublic,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"]
  );
}

/*
 * Load a key to encrypt to as a CryptoKey and return it as a JSON Web Key.
 */
async function loadTargetKey(targetPublic) {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto subtle API is unavailable");
  }
  const targetKey = await subtle.importKey(
    "raw",
    targetPublic,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );

  return await subtle.exportKey("jwk", targetKey);
}

/**
 * Creates a new public/private key pair and persists it in localStorage
 */
async function initEmbeddedKey() {
  if (isDoublyIframed()) {
    throw new Error("Doubly iframed");
  }
  const retrievedKey = await getEmbeddedKey();
  if (retrievedKey === null) {
    const targetKey = await generateTargetKey();
    setEmbeddedKey(targetKey);
  }
  // Nothing to do, key is correctly initialized!
}

/*
 * Generate a key to encrypt to and export it as a JSON Web Key.
 */
async function generateTargetKey() {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto subtle API is unavailable");
  }
  const p256key = await subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveBits"]
  );

  return await subtle.exportKey("jwk", p256key.privateKey);
}

/**
 * Gets the current embedded private key JWK. Returns `null` if not found.
 */
function getEmbeddedKey() {
  const jwtKey = getItemWithExpiry(TURNKEY_EMBEDDED_KEY);
  return jwtKey ? JSON.parse(jwtKey) : null;
}

/**
 * Sets the embedded private key JWK with the default expiration time.
 * @param {JsonWebKey} targetKey
 */
function setEmbeddedKey(targetKey) {
  setItemWithExpiry(
    TURNKEY_EMBEDDED_KEY,
    JSON.stringify(targetKey),
    TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS
  );
}

/**
 * Gets the current target embedded private key JWK. Returns `null` if not found.
 */
function getTargetEmbeddedKey() {
  const jwtKey = window.localStorage.getItem(TURNKEY_TARGET_EMBEDDED_KEY);
  return jwtKey ? JSON.parse(jwtKey) : null;
}

/**
 * Sets the target embedded public key JWK.
 * @param {JsonWebKey} targetKey
 */
function setTargetEmbeddedKey(targetKey) {
  window.localStorage.setItem(
    TURNKEY_TARGET_EMBEDDED_KEY,
    JSON.stringify(targetKey)
  );
}

/**
 * Resets the current embedded private key JWK.
 */
function onResetEmbeddedKey() {
  window.localStorage.removeItem(TURNKEY_EMBEDDED_KEY);
  window.localStorage.removeItem(TURNKEY_EMBEDDED_KEY_ORIGIN);
}

/**
 * Resets the current target embedded private key JWK.
 */
function resetTargetEmbeddedKey() {
  window.localStorage.removeItem(TURNKEY_TARGET_EMBEDDED_KEY);
}

function setParentFrameMessageChannelPort(port) {
  parentFrameMessageChannelPort = port;
}

/**
 * Gets the current settings.
 */
function getSettings() {
  const settings = window.localStorage.getItem(TURNKEY_SETTINGS);
  return settings ? JSON.parse(settings) : null;
}

/**
 * Sets the settings object.
 * @param {Object} settings
 */
function setSettings(settings) {
  window.localStorage.setItem(TURNKEY_SETTINGS, JSON.stringify(settings));
}

/**
 * Set an item in localStorage with an expiration time
 * @param {string} key
 * @param {string} value
 * @param {number} ttl expiration time in milliseconds
 */
function setItemWithExpiry(key, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  window.localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Get an item from localStorage. Returns `null` and
 * removes the item from localStorage if expired or
 * expiry time is missing.
 * @param {string} key
 */
function getItemWithExpiry(key) {
  const itemStr = window.localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  if (
    !Object.prototype.hasOwnProperty.call(item, "expiry") ||
    !Object.prototype.hasOwnProperty.call(item, "value")
  ) {
    window.localStorage.removeItem(key);
    return null;
  }
  const now = new Date();
  if (now.getTime() > item.expiry) {
    window.localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

/**
 * Takes a hex string (e.g. "e4567ab" or "0xe4567ab") and returns an array buffer (Uint8Array)
 * @param {string} hexString - Hex string with or without "0x" prefix
 * @returns {Uint8Array<ArrayBuffer>}
 */
function uint8arrayFromHexString(hexString) {
  if (!hexString || typeof hexString !== "string") {
    throw new Error("cannot create uint8array from invalid hex string");
  }

  // Remove 0x prefix if present
  const hexWithoutPrefix =
    hexString.startsWith("0x") || hexString.startsWith("0X")
      ? hexString.slice(2)
      : hexString;

  var hexRegex = /^[0-9A-Fa-f]+$/;
  if (hexWithoutPrefix.length % 2 != 0 || !hexRegex.test(hexWithoutPrefix)) {
    throw new Error("cannot create uint8array from invalid hex string");
  }
  return new Uint8Array(
    hexWithoutPrefix.match(/../g).map((h) => parseInt(h, 16))
  );
}

/**
 * Takes a Uint8Array and returns a hex string
 * @param {Uint8Array} buffer
 * @return {string}
 */
function uint8arrayToHexString(buffer) {
  return [...buffer].map((x) => x.toString(16).padStart(2, "0")).join("");
}

/**
 * Function to normalize padding of byte array with 0's to a target length
 */
function normalizePadding(byteArray, targetLength) {
  const paddingLength = targetLength - byteArray.length;

  // Add leading 0's to array
  if (paddingLength > 0) {
    const padding = new Uint8Array(paddingLength).fill(0);
    return new Uint8Array([...padding, ...byteArray]);
  }

  // Remove leading 0's from array
  if (paddingLength < 0) {
    const expectedZeroCount = paddingLength * -1;
    let zeroCount = 0;
    for (let i = 0; i < expectedZeroCount && i < byteArray.length; i++) {
      if (byteArray[i] === 0) {
        zeroCount++;
      }
    }
    // Check if the number of zeros found equals the number of zeroes expected
    if (zeroCount !== expectedZeroCount) {
      throw new Error(
        `invalid number of starting zeroes. Expected number of zeroes: ${expectedZeroCount}. Found: ${zeroCount}.`
      );
    }
    return byteArray.slice(expectedZeroCount, expectedZeroCount + targetLength);
  }
  return byteArray;
}

/**
 * Additional Associated Data (AAD) in the format dictated by the enclave_encrypt crate.
 */
function additionalAssociatedData(senderPubBuf, receiverPubBuf) {
  const s = Array.from(new Uint8Array(senderPubBuf));
  const r = Array.from(new Uint8Array(receiverPubBuf));
  return new Uint8Array([...s, ...r]);
}

/**
 * Converts an ASN.1 DER-encoded ECDSA signature to the raw format that WebCrypto uses.
 *
 * @param {string} derSignature - The DER-encoded signature as a hexadecimal string.
 * @returns {Uint8Array<ArrayBuffer>} - The raw signature as a Uint8Array.
 */
function fromDerSignature(derSignature) {
  const derSignatureBuf = uint8arrayFromHexString(derSignature);

  // Check and skip the sequence tag (0x30)
  let index = 2;

  // Parse 'r' and check for integer tag (0x02)
  if (derSignatureBuf[index] !== 0x02) {
    throw new Error(
      "failed to convert DER-encoded signature: invalid tag for r"
    );
  }
  index++; // Move past the INTEGER tag
  const rLength = derSignatureBuf[index];
  index++; // Move past the length byte
  const r = derSignatureBuf.slice(index, index + rLength);
  index += rLength; // Move to the start of s

  // Parse 's' and check for integer tag (0x02)
  if (derSignatureBuf[index] !== 0x02) {
    throw new Error(
      "failed to convert DER-encoded signature: invalid tag for s"
    );
  }
  index++; // Move past the INTEGER tag
  const sLength = derSignatureBuf[index];
  index++; // Move past the length byte
  const s = derSignatureBuf.slice(index, index + sLength);

  // Normalize 'r' and 's' to 32 bytes each
  const rPadded = normalizePadding(r, 32);
  const sPadded = normalizePadding(s, 32);

  // Concatenate and return the raw signature
  return new Uint8Array([...rPadded, ...sPadded]);
}

/**
 * Function to verify enclave signature on import bundle received from the server.
 * @param {string | null} enclaveQuorumPublic uncompressed public key for the quorum key which produced the signature
 * @param {string} publicSignature signature bytes encoded as a hexadecimal string
 * @param {string} signedData signed bytes encoded as a hexadecimal string. This could be public key bytes directly, or JSON-encoded bytes
 */
async function verifyEnclaveSignature(
  enclaveQuorumPublic,
  publicSignature,
  signedData
) {
  /** Turnkey Signer enclave's public keys */
  const TURNKEY_SIGNERS_ENCLAVES = {
    prod: "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
    preprod:
      "04f3422b8afbe425d6ece77b8d2469954715a2ff273ab7ac89f1ed70e0a9325eaa1698b4351fd1b23734e65c0b6a86b62dd49d70b37c94606aac402cbd84353212",
    dev: "048cf9ed5f579298cc1571823a3222b82d80c529c551f6070fbe712ae1a9e8d1a23b7006e306d27190358dfcd9c44624918a00f23c920a33cb14f5b026eafc865d",
  };

  // The TURNKEY_SIGNER_ENVIRONMENT must be defined either:
  //
  // - By webpack's DefinePlugin (TURNKEY_SIGNER_ENVIRONMENT_OVERRIDE)
  // - By nginx's envsubst applied to an index.html template (TURNKEY_SIGNER_ENVIRONMENT)
  // - By setting either of these in test environment
  const TURNKEY_SIGNER_ENVIRONMENT =
     false ||
    window.TURNKEY_SIGNER_ENVIRONMENT;
  if (TURNKEY_SIGNER_ENVIRONMENT === undefined) {
    throw new Error(
      `Configuration error: TURNKEY_SIGNER_ENVIRONMENT is undefined`
    );
  }

  const TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY =
    TURNKEY_SIGNERS_ENCLAVES[TURNKEY_SIGNER_ENVIRONMENT];

  if (TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY === undefined) {
    throw new Error(
      `Configuration error: TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY is undefined`
    );
  }

  // todo(olivia): throw error if enclave quorum public is null once server changes are deployed
  if (enclaveQuorumPublic) {
    if (enclaveQuorumPublic !== TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY) {
      throw new Error(
        `enclave quorum public keys from client and bundle do not match. Client: ${TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY}. Bundle: ${enclaveQuorumPublic}.`
      );
    }
  }

  const encryptionQuorumPublicBuf = new Uint8Array(
    uint8arrayFromHexString(TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY)
  );
  const quorumKey = await loadQuorumKey(encryptionQuorumPublicBuf);
  if (!quorumKey) {
    throw new Error("failed to load quorum key");
  }

  // The ECDSA signature is ASN.1 DER encoded but WebCrypto uses raw format
  const publicSignatureBuf = fromDerSignature(publicSignature);
  const signedDataBuf = uint8arrayFromHexString(signedData);
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto subtle API is unavailable");
  }
  return await subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    quorumKey,
    publicSignatureBuf,
    signedDataBuf
  );
}

/**
 * Function to send a message.
 *
 * If this page is embedded as an iframe we'll send a postMessage
 * in one of two ways depending on the version of @turnkey/iframe-stamper:
 *   1. newer versions (>=v2.1.0) pass a MessageChannel MessagePort from the parent frame for postMessages.
 *   2. older versions (<v2.1.0) still use the contentWindow so we will postMessage to the window.parent for backwards compatibility.
 *
 * Otherwise we'll display it in the DOM.
 * @param type message type. Can be "PUBLIC_KEY_CREATED" or "BUNDLE_INJECTED"
 * @param value message value
 * @param requestId serves as an idempotency key to match incoming requests. Backwards compatible: if not provided, it isn't passed in.
 */
function sendMessageUp(type, value, requestId) {
  const message = {
    type: type,
    value: value,
  };

  // Only include requestId if it was provided
  if (requestId) {
    message.requestId = requestId;
  }

  if (parentFrameMessageChannelPort) {
    parentFrameMessageChannelPort.postMessage(message);
  } else if (window.parent !== window) {
    window.parent.postMessage(
      {
        type: type,
        value: value,
      },
      "*"
    );
  }
  logMessage(`⬆️ Sent message ${type}: ${value}`);
}

/**
 * Function to log a message and persist it in the page's DOM.
 */
function logMessage(content) {
  const messageLog = document.getElementById("message-log");
  if (messageLog) {
    const message = document.createElement("p");
    message.innerText = content;
    messageLog.appendChild(message);
  }
}

/**
 * Convert a JSON Web Key private key to a public key and export the public
 * key in raw format.
 * @return {Uint8array}
 */
async function p256JWKPrivateToPublic(jwkPrivate) {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto subtle API is unavailable");
  }
  // make a copy so we don't modify the underlying object
  const jwkPrivateCopy = { ...jwkPrivate };
  // change jwk so it will be imported as a public key
  delete jwkPrivateCopy.d;
  jwkPrivateCopy.key_ops = ["verify"];

  const publicKey = await subtle.importKey(
    "jwk",
    jwkPrivateCopy,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"]
  );
  const buffer = await subtle.exportKey("raw", publicKey);
  return new Uint8Array(buffer);
}

/**
 * Encodes a buffer into a base58-encoded string.
 * @param {Uint8Array} bytes The buffer to encode.
 * @return {string} The base58-encoded string.
 */
function base58Encode(bytes) {
  // See https://en.bitcoin.it/wiki/Base58Check_encoding
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "";
  let digits = [0];
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; ++j) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }

    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  // Convert digits to a base58 string
  for (let k = 0; k < digits.length; k++) {
    result = alphabet[digits[k]] + result;
  }

  // Add '1' for each leading 0 byte
  for (let i = 0; bytes[i] === 0 && i < bytes.length - 1; i++) {
    result = "1" + result;
  }
  return result;
}

/**
 * Decodes a base58-encoded string into a buffer
 * This function throws an error when the string contains invalid characters.
 * @param {string} s The base58-encoded string.
 * @return {Uint8Array} The decoded buffer.
 */
function base58Decode(s) {
  // See https://en.bitcoin.it/wiki/Base58Check_encoding
  var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  var decodedBytes = [];
  var leadingZeros = [];
  for (var i = 0; i < s.length; i++) {
    if (alphabet.indexOf(s[i]) === -1) {
      throw new Error(`cannot base58-decode: ${s[i]} isn't a valid character`);
    }
    var carry = alphabet.indexOf(s[i]);

    // If the current base58 digit is 0, append a 0 byte.
    // "i == leadingZeros.length" can only be true if we have not seen non-zero bytes so far.
    // If we had seen a non-zero byte, carry wouldn't be 0, and i would be strictly more than `leadingZeros.length`
    if (carry == 0 && i === leadingZeros.length) {
      leadingZeros.push(0);
    }

    var j = 0;
    while (j < decodedBytes.length || carry > 0) {
      var currentByte = decodedBytes[j];

      // shift the current byte 58 units and add the carry amount
      // (or just add the carry amount if this is a new byte -- undefined case)
      if (currentByte === undefined) {
        currentByte = carry;
      } else {
        currentByte = currentByte * 58 + carry;
      }

      // find the new carry amount (1-byte shift of current byte value)
      carry = currentByte >> 8;
      // reset the current byte to the remainder (the carry amount will pass on the overflow)
      decodedBytes[j] = currentByte % 256;
      j++;
    }
  }

  var result = leadingZeros.concat(decodedBytes.reverse());
  return new Uint8Array(result);
}

/**
 * Decodes a base58check-encoded string and verifies the checksum.
 * Base58Check encoding includes a 4-byte checksum at the end to detect errors.
 * The checksum is the first 4 bytes of SHA256(SHA256(payload)).
 * This function throws an error if the checksum is invalid.
 * @param {string} s The base58check-encoded string.
 * @return {Promise<Uint8Array>} The decoded payload (without checksum).
 */
async function base58CheckDecode(s) {
  const decoded = base58Decode(s);

  if (decoded.length < 5) {
    throw new Error(
      `invalid base58check length: expected at least 5 bytes, got ${decoded.length}`
    );
  }

  const payload = decoded.subarray(0, decoded.length - 4);
  const checksum = decoded.subarray(decoded.length - 4);

  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto subtle API is unavailable");
  }

  // Compute double SHA256 hash
  const hash1Buf = await subtle.digest("SHA-256", payload);
  const hash1 = new Uint8Array(hash1Buf);
  const hash2Buf = await subtle.digest("SHA-256", hash1);
  const hash2 = new Uint8Array(hash2Buf);
  const computedChecksum = hash2.subarray(0, 4);

  // Verify checksum
  const mismatch =
    (checksum[0] ^ computedChecksum[0]) |
    (checksum[1] ^ computedChecksum[1]) |
    (checksum[2] ^ computedChecksum[2]) |
    (checksum[3] ^ computedChecksum[3]);
  if (mismatch !== 0) {
    throw new Error("invalid base58check checksum");
  }

  return payload;
}

/**
 * Returns private key bytes from a private key, represented in
 * the encoding and format specified by `keyFormat`. Defaults to
 * hex-encoding if `keyFormat` isn't passed.
 * @param {string} privateKey
 * @param {string} [keyFormat] Can be "HEXADECIMAL", "SUI_BECH32", "BITCOIN_MAINNET_WIF", "BITCOIN_TESTNET_WIF" or "SOLANA"
 * @return {Promise<Uint8Array>}
 */
async function decodeKey(privateKey, keyFormat) {
  switch (keyFormat) {
    case "SOLANA": {
      const decodedKeyBytes = base58Decode(privateKey);
      if (decodedKeyBytes.length !== 64) {
        throw new Error(
          `invalid key length. Expected 64 bytes. Got ${decodedKeyBytes.length}.`
        );
      }
      return decodedKeyBytes.subarray(0, 32);
    }
    case "HEXADECIMAL":
      if (privateKey.startsWith("0x")) {
        return uint8arrayFromHexString(privateKey.slice(2));
      }
      return uint8arrayFromHexString(privateKey);
    case "BITCOIN_MAINNET_WIF": {
      const payload = await base58CheckDecode(privateKey);

      const version = payload[0];
      const keyAndFlags = payload.subarray(1);

      // 0x80 = mainnet
      if (version !== 0x80) {
        throw new Error(
          `invalid WIF version byte: ${version}. Expected 0x80 (mainnet).`
        );
      }

      // Check for common mistake: uncompressed keys
      if (keyAndFlags.length === 32) {
        throw new Error("uncompressed WIF keys not supported");
      }

      // Validate compressed format
      if (keyAndFlags.length !== 33 || keyAndFlags[32] !== 0x01) {
        throw new Error("invalid WIF format: expected compressed private key");
      }

      return keyAndFlags.subarray(0, 32);
    }
    case "BITCOIN_TESTNET_WIF": {
      const payload = await base58CheckDecode(privateKey);

      const version = payload[0];
      const keyAndFlags = payload.subarray(1);

      // 0xEF = testnet
      if (version !== 0xef) {
        throw new Error(
          `invalid WIF version byte: ${version}. Expected 0xEF (testnet).`
        );
      }

      // Check for common mistake: uncompressed keys
      if (keyAndFlags.length === 32) {
        throw new Error("uncompressed WIF keys not supported");
      }

      // Validate compressed format
      if (keyAndFlags.length !== 33 || keyAndFlags[32] !== 0x01) {
        throw new Error("invalid WIF format: expected compressed private key");
      }

      return keyAndFlags.subarray(0, 32);
    }
    case "SUI_BECH32": {
      const { prefix, words } = bech32__WEBPACK_IMPORTED_MODULE_0__.bech32.decode(privateKey);

      if (prefix !== "suiprivkey") {
        throw new Error(
          `invalid SUI private key human-readable part (HRP): expected "suiprivkey"`
        );
      }

      const bytes = bech32__WEBPACK_IMPORTED_MODULE_0__.bech32.fromWords(words);
      if (bytes.length !== 33) {
        throw new Error(
          `invalid SUI private key length: expected 33 bytes, got ${bytes.length}`
        );
      }

      const schemeFlag = bytes[0];
      const privkey = bytes.slice(1);

      // schemeFlag = 0 is Ed25519; We currently only support Ed25519 keys for SUI.
      if (schemeFlag !== 0) {
        throw new Error(
          `invalid SUI private key scheme flag: expected 0 (Ed25519). Turnkey only supports Ed25519 keys for SUI.`
        );
      }

      return new Uint8Array(privkey);
    }
    default:
      console.warn(
        `invalid key format: ${keyFormat}. Defaulting to HEXADECIMAL.`
      );
      if (privateKey.startsWith("0x")) {
        return uint8arrayFromHexString(privateKey.slice(2));
      }
      return uint8arrayFromHexString(privateKey);
  }
}

/**
 * Returns a private key from private key bytes, represented in
 * the encoding and format specified by `keyFormat`. Defaults to
 * hex-encoding if `keyFormat` isn't passed.
 * @param {Uint8Array} privateKeyBytes
 * @param {string} [keyFormat] Can be "HEXADECIMAL" or "SOLANA"
 * @param {Uint8Array} [publicKeyBytes] Required if keyFormat is "SOLANA"
 * @return {string}
 */
async function encodeKey(privateKeyBytes, keyFormat, publicKeyBytes) {
  switch (keyFormat) {
    case "SOLANA":
      if (!publicKeyBytes) {
        throw new Error("public key must be specified for SOLANA key format");
      }
      if (privateKeyBytes.length !== 32) {
        throw new Error(
          `invalid private key length. Expected 32 bytes. Got ${privateKeyBytes.length}.`
        );
      }
      if (publicKeyBytes.length !== 32) {
        throw new Error(
          `invalid public key length. Expected 32 bytes. Got ${publicKeyBytes.length}.`
        );
      }
      {
        const concatenatedBytes = new Uint8Array(64);
        concatenatedBytes.set(privateKeyBytes, 0);
        concatenatedBytes.set(publicKeyBytes, 32);
        return base58Encode(concatenatedBytes);
      }
    case "HEXADECIMAL":
      return "0x" + uint8arrayToHexString(privateKeyBytes);
    default:
      // keeping console.warn for debugging purposes.
      // eslint-disable-next-line no-console
      console.warn(
        `invalid key format: ${keyFormat}. Defaulting to HEXADECIMAL.`
      );
      return "0x" + uint8arrayToHexString(privateKeyBytes);
  }
}

/**
 * Helper to parse a private key into a Solana base58 private key.
 * To be used if a wallet account is exported without the `SOLANA` address format.
 *
 * @param {string | Array<number>} privateKey
 * @returns {Uint8Array}
 */
function parsePrivateKey(privateKey) {
  if (Array.isArray(privateKey)) {
    return new Uint8Array(privateKey);
  }

  if (typeof privateKey === "string") {
    // Remove 0x prefix if present
    if (privateKey.startsWith("0x")) {
      privateKey = privateKey.slice(2);
    }

    // Check if it's hex-formatted correctly (i.e. 64 hex chars)
    if (privateKey.length === 64 && /^[0-9a-fA-F]+$/.test(privateKey)) {
      return uint8arrayFromHexString(privateKey);
    }

    // Otherwise assume it's base58 format (for Solana)
    try {
      return base58Decode(privateKey);
    } catch (error) {
      throw new Error(
        "Invalid private key format. Use hex (64 chars) or base58 format."
      );
    }
  }

  throw new Error("Private key must be a string (hex/base58) or number array");
}

/**
 * Function to validate and sanitize the styles object using the accepted map of style keys and values (as regular expressions).
 * Any invalid style throws an error. Returns an object of valid styles.
 * @param {Object} styles
 * @param {HTMLElement} [element] - Optional element parameter (for import frame)
 * @return {Object}
 */
function validateStyles(styles, element) {
  const validStyles = {};

  const cssValidationRegex = {
    padding: "^(\\d+(px|em|%|rem) ?){1,4}$",
    margin: "^(\\d+(px|em|%|rem) ?){1,4}$",
    borderWidth: "^(\\d+(px|em|rem) ?){1,4}$",
    borderStyle:
      "^(none|solid|dashed|dotted|double|groove|ridge|inset|outset)$",
    borderColor:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    borderRadius: "^(\\d+(px|em|%|rem) ?){1,4}$",
    fontSize: "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax))$",
    fontWeight: "^(normal|bold|bolder|lighter|\\d{3})$",
    fontFamily: '^[^";<>]*$', // checks for the absence of some characters that could lead to CSS/HTML injection
    color:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    labelColor:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    backgroundColor:
      "^(transparent|inherit|initial|#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)|hsla?\\(\\d{1,3}, \\d{1,3}%, \\d{1,3}%(, \\d?(\\.\\d{1,2})?)?\\))$",
    width: "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|auto)$",
    height: "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|auto)$",
    maxWidth: "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|none)$",
    maxHeight:
      "^(\\d+(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|none)$",
    lineHeight:
      "^(\\d+(\\.\\d+)?(px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax)|normal)$",
    boxShadow:
      "^(none|(\\d+(px|em|rem) ?){2,4} (#[0-9a-f]{3,8}|rgba?\\(\\d{1,3}, \\d{1,3}, \\d{1,3}(, \\d?(\\.\\d{1,2})?)?\\)) ?(inset)?)$",
    textAlign: "^(left|right|center|justify|initial|inherit)$",
    overflowWrap: "^(normal|break-word|anywhere)$",
    wordWrap: "^(normal|break-word)$",
    resize: "^(none|both|horizontal|vertical|block|inline)$",
  };

  Object.entries(styles).forEach(([property, value]) => {
    const styleProperty = property.trim();
    if (styleProperty.length === 0) {
      throw new Error("css style property cannot be empty");
    }
    const styleRegexStr = cssValidationRegex[styleProperty];
    if (!styleRegexStr) {
      throw new Error(
        `invalid or unsupported css style property: "${styleProperty}"`
      );
    }
    const styleRegex = new RegExp(styleRegexStr);
    const styleValue = value.trim();
    if (styleValue.length == 0) {
      throw new Error(`css style for "${styleProperty}" is empty`);
    }
    const isValidStyle = styleRegex.test(styleValue);
    if (!isValidStyle) {
      throw new Error(
        `invalid css style value for property "${styleProperty}"`
      );
    }
    validStyles[styleProperty] = styleValue;
  });

  return validStyles;
}


//# sourceMappingURL=turnkey-core.mjs.map


/***/ }),

/***/ 89204:
/*!*******************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/css-loader@6.8.1_webpack@5.102.1/node_modules/css-loader/dist/cjs.js!./src/styles.css ***!
  \*******************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/.pnpm/css-loader@6.8.1_webpack@5.102.1/node_modules/css-loader/dist/runtime/sourceMaps.js */ 41139);
/* harmony import */ var _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/.pnpm/css-loader@6.8.1_webpack@5.102.1/node_modules/css-loader/dist/runtime/api.js */ 81537);
/* harmony import */ var _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_pnpm_css_loader_6_8_1_webpack_5_102_1_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body {
  text-align: center;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  max-width: 1024px;
  margin: auto;
}

label {
  display: inline-block;
  width: 8em;
}

form {
  text-align: left;
}

input[type="text"],
input:not([type]),
select {
  width: 40em;
  margin: 0.5em;
  font-family: "Courier New", Courier, monospace;
  font-size: 1em;
  height: 1.8em;
  color: rgb(18, 87, 18);
  border: 1px rgb(217, 240, 221) solid;
  border-radius: 4px;
}

input:disabled {
  background-color: rgb(239, 243, 240);
}

#reset {
  color: white;
  width: 7em;
  font-size: 1em;
  padding: 0.38em;
  border-radius: 4px;
  background-color: rgb(187, 100, 100);
  border: 1px rgb(112, 42, 42) solid;
  cursor: pointer;
  display: inline;
}

#inject-key,
#inject-wallet,
#sign-transaction,
#sign-message {
  color: white;
  width: 7em;
  font-size: 1em;
  padding: 0.38em;
  border-radius: 4px;
  background-color: rgb(50, 44, 44);
  border: 1px rgb(33, 33, 33) solid;
  cursor: pointer;
  display: inline;
}

#message-log {
  border: 1px #2a2828 solid;
  padding: 0 0.7em;
  border-radius: 4px;
  margin-top: 2em;
  max-width: 800px;
  margin: auto;
  display: block;
}

#message-log p {
  font-size: 0.9em;
  text-align: left;
  word-break: break-all;
}

.hidden {
  display: none;
}
`, "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB;sDACoD;EACpD,iBAAiB;EACjB,YAAY;AACd;;AAEA;EACE,qBAAqB;EACrB,UAAU;AACZ;;AAEA;EACE,gBAAgB;AAClB;;AAEA;;;EAGE,WAAW;EACX,aAAa;EACb,8CAA8C;EAC9C,cAAc;EACd,aAAa;EACb,sBAAsB;EACtB,oCAAoC;EACpC,kBAAkB;AACpB;;AAEA;EACE,oCAAoC;AACtC;;AAEA;EACE,YAAY;EACZ,UAAU;EACV,cAAc;EACd,eAAe;EACf,kBAAkB;EAClB,oCAAoC;EACpC,kCAAkC;EAClC,eAAe;EACf,eAAe;AACjB;;AAEA;;;;EAIE,YAAY;EACZ,UAAU;EACV,cAAc;EACd,eAAe;EACf,kBAAkB;EAClB,iCAAiC;EACjC,iCAAiC;EACjC,eAAe;EACf,eAAe;AACjB;;AAEA;EACE,yBAAyB;EACzB,gBAAgB;EAChB,kBAAkB;EAClB,eAAe;EACf,gBAAgB;EAChB,YAAY;EACZ,cAAc;AAChB;;AAEA;EACE,gBAAgB;EAChB,gBAAgB;EAChB,qBAAqB;AACvB;;AAEA;EACE,aAAa;AACf","sourcesContent":["body {\n  text-align: center;\n  font-family: \"Lucida Sans\", \"Lucida Sans Regular\", \"Lucida Grande\",\n    \"Lucida Sans Unicode\", Geneva, Verdana, sans-serif;\n  max-width: 1024px;\n  margin: auto;\n}\n\nlabel {\n  display: inline-block;\n  width: 8em;\n}\n\nform {\n  text-align: left;\n}\n\ninput[type=\"text\"],\ninput:not([type]),\nselect {\n  width: 40em;\n  margin: 0.5em;\n  font-family: \"Courier New\", Courier, monospace;\n  font-size: 1em;\n  height: 1.8em;\n  color: rgb(18, 87, 18);\n  border: 1px rgb(217, 240, 221) solid;\n  border-radius: 4px;\n}\n\ninput:disabled {\n  background-color: rgb(239, 243, 240);\n}\n\n#reset {\n  color: white;\n  width: 7em;\n  font-size: 1em;\n  padding: 0.38em;\n  border-radius: 4px;\n  background-color: rgb(187, 100, 100);\n  border: 1px rgb(112, 42, 42) solid;\n  cursor: pointer;\n  display: inline;\n}\n\n#inject-key,\n#inject-wallet,\n#sign-transaction,\n#sign-message {\n  color: white;\n  width: 7em;\n  font-size: 1em;\n  padding: 0.38em;\n  border-radius: 4px;\n  background-color: rgb(50, 44, 44);\n  border: 1px rgb(33, 33, 33) solid;\n  cursor: pointer;\n  display: inline;\n}\n\n#message-log {\n  border: 1px #2a2828 solid;\n  padding: 0 0.7em;\n  border-radius: 4px;\n  margin-top: 2em;\n  max-width: 800px;\n  margin: auto;\n  display: block;\n}\n\n#message-log p {\n  font-size: 0.9em;\n  text-align: left;\n  word-break: break-all;\n}\n\n.hidden {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 92728:
/*!*******************************!*\
  !*** ./src/event-handlers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_TTL_MILLISECONDS: () => (/* binding */ DEFAULT_TTL_MILLISECONDS),
/* harmony export */   getKeyNotFoundErrorMessage: () => (/* binding */ getKeyNotFoundErrorMessage),
/* harmony export */   initEventHandlers: () => (/* binding */ initEventHandlers),
/* harmony export */   onClearEmbeddedPrivateKey: () => (/* binding */ onClearEmbeddedPrivateKey),
/* harmony export */   onInjectKeyBundle: () => (/* binding */ onInjectKeyBundle),
/* harmony export */   onResetToDefaultEmbeddedKey: () => (/* binding */ onResetToDefaultEmbeddedKey),
/* harmony export */   onSetEmbeddedKeyOverride: () => (/* binding */ onSetEmbeddedKeyOverride),
/* harmony export */   onSignMessage: () => (/* binding */ onSignMessage),
/* harmony export */   onSignTransaction: () => (/* binding */ onSignTransaction)
/* harmony export */ });
/* harmony import */ var _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./turnkey-core.js */ 46340);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/web3.js */ 31644);
/* harmony import */ var viem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! viem */ 82230);
/* harmony import */ var viem_accounts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! viem/accounts */ 91705);
/* harmony import */ var _noble_ed25519__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @noble/ed25519 */ 3376);
/* harmony import */ var _noble_hashes_sha512__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @noble/hashes/sha512 */ 72719);







// Persist keys in memory via mapping of { address --> pk }
let inMemoryKeys = {};

// Injected embedded key -- held in memory only, never persisted.
// When set, decryptBundle uses this P-256 JWK instead of the iframe's embedded key.
let injectedEmbeddedKey = null;

const DEFAULT_TTL_MILLISECONDS = 1000 * 24 * 60 * 60; // 24 hours or 86,400,000 milliseconds

console.warn("TextEncoder", typeof TextEncoder, typeof window.TextEncoder);

// Instantiate these once (for perf)
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Verifies the enclave signature on a v1.0.0 bundle and returns the parsed signed data.
 * @param {string} bundle - JSON-stringified bundle
 * @param {string} organizationId - Expected organization ID
 * @returns {Promise<Object>} - The parsed signed data {organizationId, encappedPublic, ciphertext}
 */
async function verifyAndParseBundleData(bundle, organizationId) {
  const bundleObj = JSON.parse(bundle);

  if (bundleObj.version !== "v1.0.0") {
    throw new Error(`unsupported version: ${bundleObj.version}`);
  }
  if (!bundleObj.data) {
    throw new Error('missing "data" in bundle');
  }
  if (!bundleObj.dataSignature) {
    throw new Error('missing "dataSignature" in bundle');
  }
  if (!bundleObj.enclaveQuorumPublic) {
    throw new Error('missing "enclaveQuorumPublic" in bundle');
  }

  if (!_turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.verifyEnclaveSignature) {
    throw new Error("method TKHQ.verifyEnclaveSignature not loaded");
  }
  const verified = await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.verifyEnclaveSignature(
    bundleObj.enclaveQuorumPublic,
    bundleObj.dataSignature,
    bundleObj.data
  );
  if (!verified) {
    throw new Error(
      `failed to verify enclave signature. Got signature: ${bundleObj.dataSignature}, enclaveQuorumPublic: ${bundleObj.enclaveQuorumPublic}`
    );
  }

  const signedData = JSON.parse(
    textDecoder.decode(_turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayFromHexString(bundleObj.data))
  );

  if (!organizationId) {
    throw new Error(
      `organization id is required. Please ensure you are using @turnkey/iframe-stamper >= v2.0.0 to pass "organizationId" for security purposes.`
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

  return signedData;
}

/**
 * Parse and decrypt the export bundle.
 * The `bundle` param is a JSON string of the encapsulated public
 * key, encapsulated public key signature, and the ciphertext.
 * @param {string} bundle
 * @param {string} organizationId
 * @param {Function} HpkeDecrypt
 */
async function decryptBundle(bundle, organizationId, HpkeDecrypt) {
  const signedData = await verifyAndParseBundleData(bundle, organizationId);

  const encappedKeyBuf = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayFromHexString(
    signedData.encappedPublic
  );
  const ciphertextBuf = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayFromHexString(signedData.ciphertext);

  // Use the injected embedded key if available, otherwise fall back to the embedded key
  const receiverPrivJwk = injectedEmbeddedKey || (await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.getEmbeddedKey());
  return await HpkeDecrypt({
    ciphertextBuf,
    encappedKeyBuf,
    receiverPrivJwk,
  });
}

/**
 * Function triggered when GET_EMBEDDED_PUBLIC_KEY event is received.
 * @param {string} requestId
 */
async function onGetPublicEmbeddedKey(requestId) {
  const embeddedKeyJwk = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.getEmbeddedKey();

  if (!embeddedKeyJwk) {
    _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("EMBEDDED_PUBLIC_KEY", "", requestId); // no key == empty string

    return;
  }

  const targetPubBuf = await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
  const targetPubHex = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayToHexString(targetPubBuf);

  // Send up EMBEDDED_PUBLIC_KEY message
  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("EMBEDDED_PUBLIC_KEY", targetPubHex, requestId);
}

/**
 * Encodes raw key bytes and loads them into the in-memory key store.
 * @param {string | undefined} address - Wallet address (case-sensitive)
 * @param {ArrayBuffer} keyBytes - Raw decrypted private key bytes
 * @param {string} keyFormat - "SOLANA" | "HEXADECIMAL"
 * @param {string} organizationId - Organization ID
 */
async function loadKeyIntoMemory(address, keyBytes, keyFormat, organizationId) {
  let key;
  const privateKeyBytes = new Uint8Array(keyBytes);

  if (keyFormat === "SOLANA") {
    const privateKeyHex = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayToHexString(
      privateKeyBytes.subarray(0, 32)
    );
    const publicKeyBytes = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.getEd25519PublicKey(privateKeyHex);
    key = await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.encodeKey(privateKeyBytes, keyFormat, publicKeyBytes);
  } else {
    key = await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.encodeKey(privateKeyBytes, keyFormat);
  }

  const keyAddress = address || "default";

  // Cache keypair for improved signing perf
  let cachedKeypair;
  if (keyFormat === "SOLANA") {
    cachedKeypair = _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.Keypair.fromSecretKey(_turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.base58Decode(key));
  } else if (keyFormat === "HEXADECIMAL") {
    cachedKeypair = await createSolanaKeypair(
      Array.from(_turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayFromHexString(key))
    );
  }

  inMemoryKeys = {
    ...inMemoryKeys,
    [keyAddress]: {
      organizationId,
      privateKey: key,
      format: keyFormat,
      expiry: new Date().getTime() + DEFAULT_TTL_MILLISECONDS,
      keypair: cachedKeypair,
    },
  };
}

/**
 * Function triggered when INJECT_KEY_EXPORT_BUNDLE event is received.
 * @param {string} requestId
 * @param {string} organizationId
 * @param {string} bundle
 * @param {string} keyFormat
 * @param {string | undefined} address
 * @param {Function} HpkeDecrypt // TODO: import this directly (instead of passing around)
 */
async function onInjectKeyBundle(
  requestId,
  organizationId,
  bundle,
  keyFormat,
  address,
  HpkeDecrypt
) {
  // Decrypt the export bundle
  const keyBytes = await decryptBundle(bundle, organizationId, HpkeDecrypt);

  // Load decrypted key into memory
  await loadKeyIntoMemory(address, keyBytes, keyFormat, organizationId);

  // Send up BUNDLE_INJECTED message
  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("BUNDLE_INJECTED", true, requestId);
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
  const validSettings = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.applySettings(settings);

  // Persist in local storage
  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.setSettings(validSettings);

  // Send up SETTINGS_APPLIED message
  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("SETTINGS_APPLIED", true, requestId);
}

/**
 * Function triggered when SIGN_TRANSACTION event is received.
 * @param {string} requestId
 * @param {string} transaction (serialized)
 * @param {string} [address] (case-sensitive --> enforce this, optional for backwards compatibility)
 */
async function onSignTransaction(requestId, serializedTransaction, address) {
  // If no address provided, use "default"
  const keyAddress = address || "default";
  const key = inMemoryKeys[keyAddress];

  // Validate key exists and is valid/non-expired
  if (!validateKey(key, keyAddress, requestId)) {
    return;
  }

  const transactionWrapper = JSON.parse(serializedTransaction);
  const transactionToSign = transactionWrapper.transaction;
  const transactionType = transactionWrapper.type;

  let signedTransaction;

  if (transactionType === "SOLANA") {
    // Get or create keypair (uses cached keypair if available)
    const keypair = await getOrCreateKeypair(key);

    // Fetch the transaction and sign
    const transactionBytes = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayFromHexString(transactionToSign);
    const transaction = _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.VersionedTransaction.deserialize(transactionBytes);
    transaction.sign([keypair]);

    signedTransaction = transaction.serialize();
  } else if (transactionType === "ETHEREUM") {
    // viem returns the fully serialized, broadcast-ready signed tx as a
    // 0x-prefixed hex string.
    signedTransaction = await signEthereumTransaction(key, transactionToSign);
  } else {
    throw new Error("unsupported transaction type");
  }

  // Solana signing returns raw bytes (encode to hex); Ethereum signing already
  // returns a 0x-prefixed hex string, which we pass through as-is.
  const signedTransactionHex =
    typeof signedTransaction === "string"
      ? signedTransaction
      : _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayToHexString(signedTransaction);

  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("TRANSACTION_SIGNED", signedTransactionHex, requestId);
}

/**
 * Function triggered when SIGN_MESSAGE event is received.
 * @param {string} requestId
 * @param {string} message (serialized, JSON-stringified)
 * @param {string} [address] (case-sensitive --> enforce this, optional for backwards compatibility)
 */
async function onSignMessage(requestId, serializedMessage, address) {
  // Backwards compatibility: if no address provided, use "default"
  const keyAddress = address || "default";
  const key = inMemoryKeys[keyAddress];

  // Validate key exists and has not expired
  if (!validateKey(key, keyAddress, requestId)) {
    return;
  }

  const messageWrapper = JSON.parse(serializedMessage);
  const messageToSign = messageWrapper.message;
  const messageType = messageWrapper.type;
  const messageBytes = textEncoder.encode(messageToSign);

  let signatureHex;

  if (messageType === "SOLANA") {
    // Get or create keypair (uses cached keypair if available)
    const keypair = await getOrCreateKeypair(key);

    // Set up sha512 for nobleEd25519 (required for signing)
    _noble_ed25519__WEBPACK_IMPORTED_MODULE_4__.etc.sha512Sync = (...m) =>
      _noble_hashes_sha512__WEBPACK_IMPORTED_MODULE_5__.sha512(_noble_ed25519__WEBPACK_IMPORTED_MODULE_4__.etc.concatBytes(...m));

    // Extract the 32-byte private key from the 64-byte secretKey
    // Solana keypair.secretKey format: [32-byte private key][32-byte public key]
    const privateKey = keypair.secretKey.slice(0, 32);
    // Sign the message using nobleEd25519
    const signature = _noble_ed25519__WEBPACK_IMPORTED_MODULE_4__.sign(messageBytes, privateKey);

    // Note: Signature verification is skipped for performance. The signature will always be valid if signing succeeds with a valid keypair.
    // Clients can verify the signature returned.

    signatureHex = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayToHexString(signature);
  } else if (messageType === "ETHEREUM") {
    const account = await getOrCreateEthereumAccount(key);

    // Match the Solana path: sign the message as a plain UTF-8 string
    // (EIP-191 personal_sign). viem returns a 0x-prefixed signature.
    signatureHex = await account.signMessage({ message: messageToSign });
  } else {
    _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", "unsupported message type", requestId);

    return;
  }

  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("MESSAGE_SIGNED", signatureHex, requestId);
}

/**
 * Function triggered when CLEAR_EMBEDDED_PRIVATE_KEY event is received.
 * @param {string} requestId
 * @param {string} address - Optional: The address of the key to clear (case-sensitive). If not provided, clears all keys.
 */
async function onClearEmbeddedPrivateKey(requestId, address) {
  // If no address is provided, clear all keys
  if (!address) {
    inMemoryKeys = {};
    _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("EMBEDDED_PRIVATE_KEY_CLEARED", true, requestId);

    return;
  }

  // Check if key exists for the specific address
  if (!inMemoryKeys[address]) {
    _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp(
      "ERROR",
      new Error(
        `key not found for address ${address}. Note that address is case sensitive.`
      ).toString(),
      requestId
    );

    return;
  }

  // Clear the specific key from memory
  delete inMemoryKeys[address];

  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("EMBEDDED_PRIVATE_KEY_CLEARED", true, requestId);
}

/**
 * Handler for SET_EMBEDDED_KEY_OVERRIDE events.
 * Decrypts a P-256 private key bundle using the iframe's embedded key and
 * overrides the embedded key with it for subsequent bundle decryptions.
 * @param {string} requestId
 * @param {string} organizationId
 * @param {string} bundle - v1.0.0 bundle containing the P-256 private key
 * @param {Function} HpkeDecrypt
 */
async function onSetEmbeddedKeyOverride(
  requestId,
  organizationId,
  bundle,
  HpkeDecrypt
) {
  // Decrypt the private key using the iframe's embedded key.
  // The decrypted payload is a raw 32-byte P-256 private key scalar.
  const keyBytes = await decryptBundle(bundle, organizationId, HpkeDecrypt);

  // Convert raw P-256 bytes to a full JWK (derives public key via WebCrypto)
  const keyJwk = await rawP256PrivateKeyToJwk(new Uint8Array(keyBytes));

  // Store in module-level variable (memory only)
  injectedEmbeddedKey = keyJwk;

  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("EMBEDDED_KEY_OVERRIDE_SET", true, requestId);
}

/**
 * Handler for RESET_TO_DEFAULT_EMBEDDED_KEY events.
 * Clears the embedded key from memory, replacing it with the iframe's default embedded key.
 * @param {string} requestId
 */
function onResetToDefaultEmbeddedKey(requestId) {
  injectedEmbeddedKey = null;
  _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("RESET_TO_DEFAULT_EMBEDDED_KEY", true, requestId);
}

// Utility functions
async function createSolanaKeypair(privateKey) {
  const privateKeyBytes = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.parsePrivateKey(privateKey);

  let keypair;
  if (privateKeyBytes.length === 32) {
    // 32-byte private key (seed)
    keypair = _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.Keypair.fromSeed(privateKeyBytes);
  } else if (privateKeyBytes.length === 64) {
    // 64-byte secret key (private + public)
    keypair = _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.Keypair.fromSecretKey(privateKeyBytes);
  } else {
    throw new Error(
      `Invalid private key length: ${privateKeyBytes.length}. Expected 32 or 64 bytes.`
    );
  }

  return keypair;
}

/**
 * Converts raw P-256 private key bytes (32-byte scalar) to a JWK.
 * Constructs a PKCS8 wrapper around the raw bytes, imports via WebCrypto
 * (which derives the public key), then exports as JWK.
 * @param {Uint8Array} rawPrivateKeyBytes - 32-byte P-256 private key scalar
 * @returns {Promise<JsonWebKey>} - Full P-256 ECDH private key JWK
 */
async function rawP256PrivateKeyToJwk(rawPrivateKeyBytes) {
  if (rawPrivateKeyBytes.length !== 32) {
    throw new Error(
      `invalid decryption key length: expected 32 bytes, got ${rawPrivateKeyBytes.length}`
    );
  }

  // Fixed PKCS#8 DER prefix for a P-256 private key (36 bytes).
  // This wraps a raw 32-byte scalar into the PrivateKeyInfo structure
  // that WebCrypto's importKey("pkcs8", ...) expects.
  //
  // Structure (per RFC 5958 §2 / RFC 5208 §5):
  //   SEQUENCE {
  //     INTEGER 0                              -- version (v1)
  //     SEQUENCE {                             -- AlgorithmIdentifier (RFC 5480 §2.1.1)
  //       OID 1.2.840.10045.2.1               -- id-ecPublicKey
  //       OID 1.2.840.10045.3.1.7             -- secp256r1 (P-256)
  //     }
  //     OCTET STRING {                         -- privateKey (SEC 1 §C.4 / RFC 5915 §3)
  //       SEQUENCE {
  //         INTEGER 1                          -- version
  //         OCTET STRING (32 bytes)            -- raw private key scalar
  //       }
  //     }
  //   }
  //
  // References:
  //   - RFC 5958 / RFC 5208: PKCS#8 PrivateKeyInfo
  //   - RFC 5480 §2.1.1: ECC AlgorithmIdentifier (OIDs)
  //   - RFC 5915 / SEC 1 v2 §C.4: ECPrivateKey encoding
  const pkcs8Prefix = new Uint8Array([
    0x30, 0x41, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48,
    0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03,
    0x01, 0x07, 0x04, 0x27, 0x30, 0x25, 0x02, 0x01, 0x01, 0x04, 0x20,
  ]);

  const pkcs8 = new Uint8Array(pkcs8Prefix.length + 32);
  pkcs8.set(pkcs8Prefix);
  pkcs8.set(rawPrivateKeyBytes, pkcs8Prefix.length);

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );

  return await crypto.subtle.exportKey("jwk", cryptoKey);
}

/**
 * Generates the error message for missing or expired keys.
 * @param {string} keyAddress - The address of the key
 * @returns {string} - The error message string
 */
function getKeyNotFoundErrorMessage(keyAddress) {
  return `key bytes have expired. Please re-inject export bundle for address ${keyAddress} into iframe. Note that address is case sensitive.`;
}

/**
 * Clears an expired key from memory. This is an internal helper function
 * that clears the key without sending messages to the parent frame.
 * @param {string} keyAddress - The address of the key to clear
 */
function clearExpiredKey(keyAddress) {
  if (inMemoryKeys[keyAddress]) {
    delete inMemoryKeys[keyAddress];
  }
}

/**
 * Clears all expired keys from memory.
 * This function iterates through all keys and removes any that have expired.
 */
function clearAllExpiredKeys() {
  const now = new Date().getTime();
  const addressesToRemove = [];

  for (const [address, key] of Object.entries(inMemoryKeys)) {
    if (key.expiry && now >= key.expiry) {
      addressesToRemove.push(address);
    }
  }

  for (const address of addressesToRemove) {
    clearExpiredKey(address);
  }
}

/**
 * Validates that a key exists and has not expired.
 * Clears the key from memory if it has expired.
 * Throws error if validation fails (and caller will send message up back to parent).
 * @param {Object} key - The key object from inMemoryKeys
 * @param {string} keyAddress - The address of the key
 * @returns {boolean} - True if key is valid, false otherwise
 */
function validateKey(key, keyAddress) {
  if (!key) {
    throw new Error(
      `key bytes not found. Please re-inject export bundle for address ${keyAddress} into iframe. Note that address is case sensitive.`
    ).toString();
  }

  const now = new Date().getTime();
  if (now >= key.expiry) {
    // Clear all expired keys before processing the signing request
    clearAllExpiredKeys();
    throw new Error(getKeyNotFoundErrorMessage(keyAddress)).toString();
  }

  return true;
}

/**
 * Gets or creates a Solana keypair from a key object.
 * Uses cached keypair if available, otherwise creates a new one.
 * @param {Object} key - The key object containing format and privateKey
 * @returns {Promise<Keypair>} - The Solana keypair
 */
async function getOrCreateKeypair(key) {
  if (key.keypair) {
    return key.keypair;
  }

  if (key.format === "SOLANA") {
    return _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.Keypair.fromSecretKey(_turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.base58Decode(key.privateKey));
  } else {
    return await createSolanaKeypair(
      Array.from(_turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayFromHexString(key.privateKey))
    );
  }
}

/**
 * Gets or creates a viem Ethereum account from a key object.
 * Caches the account on the key object for improved signing perf.
 * @param {Object} key - The key object containing the privateKey and format
 * @returns {Promise<Object>} - The viem account (from privateKeyToAccount)
 */
async function getOrCreateEthereumAccount(key) {
  if (key.ethereumAccount) {
    return key.ethereumAccount;
  }

  // Ethereum keys are exported in HEXADECIMAL format, where privateKey is a
  // 0x-prefixed hex string — exactly what viem's privateKeyToAccount expects.
  if (key.format !== "HEXADECIMAL") {
    throw new Error(
      `cannot sign Ethereum payload with key format "${key.format}"; expected "HEXADECIMAL"`
    );
  }

  key.ethereumAccount = (0,viem_accounts__WEBPACK_IMPORTED_MODULE_3__.privateKeyToAccount)(key.privateKey);
  return key.ethereumAccount;
}

/**
 * Signs a serialized Ethereum transaction and returns the broadcast-ready,
 * 0x-prefixed serialized signed transaction.
 *
 * Mirrors the Solana path: the caller builds and serializes the *unsigned*
 * transaction with any library, then passes the 0x-prefixed serialized hex.
 * We parse it back into viem's transaction shape, sign, and re-serialize.
 *
 * Note: for legacy (non-typed) transactions, the serialized unsigned tx must
 * include the chainId so the resulting signature carries EIP-155 replay
 * protection. Typed txs (EIP-1559/2930) always encode the chainId.
 * @param {Object} key - The key object containing the privateKey and format
 * @param {string} transactionToSign - 0x-prefixed serialized unsigned transaction
 * @returns {Promise<string>} - The 0x-prefixed serialized signed transaction
 */
async function signEthereumTransaction(key, transactionToSign) {
  const account = await getOrCreateEthereumAccount(key);
  return await account.signTransaction((0,viem__WEBPACK_IMPORTED_MODULE_2__.parseTransaction)(transactionToSign));
}

/**
 * DOM Event handlers to power the export flow in standalone mode
 * Instead of receiving events from the parent page, forms trigger them.
 * This is useful for debugging as well.
 */
function addDOMEventListeners() {
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

  // Add wallet injection support
  const injectWalletBtn = document.getElementById("inject-wallet");
  if (injectWalletBtn) {
    injectWalletBtn.addEventListener(
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
  }
}

/**
 * Message Event Handlers to process messages from the parent frame
 */
function initMessageEventListener(HpkeDecrypt) {
  return async function messageEventListener(event) {
    if (event.data && event.data["type"] == "INJECT_KEY_EXPORT_BUNDLE") {
      _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}, ${event.data["keyFormat"]}, ${event.data["organizationId"]}`
      );
      try {
        await onInjectKeyBundle(
          event.data["requestId"],
          event.data["organizationId"],
          event.data["value"], // bundle
          event.data["keyFormat"],
          event.data["address"],
          HpkeDecrypt
        );
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "INJECT_WALLET_EXPORT_BUNDLE") {
      _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}, ${event.data["organizationId"]}`
      );
      try {
        await onInjectKeyBundle(
          event.data["requestId"],
          event.data["organizationId"],
          event.data["value"],
          undefined, // keyFormat - default to HEXADECIMAL
          undefined, // address - default to "default"
          HpkeDecrypt
        );
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "APPLY_SETTINGS") {
      try {
        await onApplySettings(event.data["value"], event.data["requestId"]);
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "RESET_EMBEDDED_KEY") {
      _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.onResetEmbeddedKey();
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString());
      }
    }
    if (event.data && event.data["type"] == "SIGN_TRANSACTION") {
      _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}`
      );
      try {
        await onSignTransaction(
          event.data["requestId"],
          event.data["value"],
          event.data["address"] // signing address (case sensitive)
        );
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "SIGN_MESSAGE") {
      _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.logMessage(
        `⬇️ Received message ${event.data["type"]}: ${event.data["value"]}`
      );
      try {
        await onSignMessage(
          event.data["requestId"],
          event.data["value"],
          event.data["address"] // signing address (case sensitive)
        );
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "CLEAR_EMBEDDED_PRIVATE_KEY") {
      _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        await onClearEmbeddedPrivateKey(
          event.data["requestId"],
          event.data["address"]
        );
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "GET_EMBEDDED_PUBLIC_KEY") {
      _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        await onGetPublicEmbeddedKey(event.data["requestId"]);
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "SET_EMBEDDED_KEY_OVERRIDE") {
      _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        await onSetEmbeddedKeyOverride(
          event.data["requestId"],
          event.data["organizationId"],
          event.data["value"],
          HpkeDecrypt
        );
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
    if (event.data && event.data["type"] == "RESET_TO_DEFAULT_EMBEDDED_KEY") {
      _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.logMessage(`⬇️ Received message ${event.data["type"]}`);
      try {
        onResetToDefaultEmbeddedKey(event.data["requestId"]);
      } catch (e) {
        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("ERROR", e.toString(), event.data["requestId"]);
      }
    }
  };
}

/**
 * Set up event handlers for both DOM and message events
 * @param {Function} HpkeDecrypt
 */
function initEventHandlers(HpkeDecrypt) {
  const messageEventListener = initMessageEventListener(HpkeDecrypt);

  // controllers to remove event listeners
  const messageListenerController = new AbortController();
  const turnkeyInitController = new AbortController();

  // Add DOM event listeners for standalone mode
  addDOMEventListeners();

  // Add window message listener for iframe mode
  window.addEventListener("message", messageEventListener, {
    capture: false,
    signal: messageListenerController.signal,
  });

  // Guard to prevent concurrent channel establishment from multiple senders
  let channelEstablished = false;

  // Handle MessageChannel initialization for iframe communication
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
        // Synchronously check-and-set the flag before any await. This prevents
        // a second concurrent invocation from racing through while the first is
        // suspended at an await, which would allow multiple origins to establish
        // a channel before turnkeyInitController.abort() is reached.
        if (channelEstablished) {
          return;
        }
        channelEstablished = true;

        // remove the message event listener that was added in the DOMContentLoaded event
        messageListenerController.abort();

        const iframeMessagePort = event.ports[0];
        iframeMessagePort.onmessage = messageEventListener;

        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.setParentFrameMessageChannelPort(iframeMessagePort);

        await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.initEmbeddedKey(event.origin);
        var embeddedKeyJwk = await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.getEmbeddedKey();
        var targetPubBuf = await _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
        var targetPubHex = _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.uint8arrayToHexString(targetPubBuf);
        document.getElementById("embedded-key").value = targetPubHex;

        _turnkey_core_js__WEBPACK_IMPORTED_MODULE_0__.TKHQ.sendMessageUp("PUBLIC_KEY_READY", targetPubHex);

        // remove the listener for TURNKEY_INIT_MESSAGE_CHANNEL after it's been processed
        turnkeyInitController.abort();
      }
    },
    { signal: turnkeyInitController.signal }
  );

  return { messageEventListener };
}
/**
 * Expose internal handlers for targeted testing.
 */



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 		__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 		module = execOptions.module;
/******/ 		execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "bundle." + {"96":"66081135e788558705b7","431":"77e88eb7f82ae97bfd0f","792":"e220688a77c354e49dd5"}[chunkId] + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("64f01884e34c70cf088b")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "@turnkey/frames-export-and-sign:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 				if (script.src.indexOf(window.location.origin + '/') !== 0) {
/******/ 					script.crossOrigin = "anonymous";
/******/ 				}
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				// inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results).then(function () {});
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								}
/******/ 								return setStatus("ready").then(function () {
/******/ 									return updatedModules;
/******/ 								});
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 		
/******/ 			var onAccepted = function () {
/******/ 				return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 					// handle errors in accept handlers and self accepted module load
/******/ 					if (error) {
/******/ 						return setStatus("fail").then(function () {
/******/ 							throw error;
/******/ 						});
/******/ 					}
/******/ 		
/******/ 					if (queuedInvalidatedModules) {
/******/ 						return internalApply(options).then(function (list) {
/******/ 							outdatedModules.forEach(function (moduleId) {
/******/ 								if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 							});
/******/ 							return list;
/******/ 						});
/******/ 					}
/******/ 		
/******/ 					return setStatus("idle").then(function () {
/******/ 						return outdatedModules;
/******/ 					});
/******/ 				});
/******/ 			};
/******/ 		
/******/ 			return Promise.all(
/******/ 				results
/******/ 					.filter(function (result) {
/******/ 						return result.apply;
/******/ 					})
/******/ 					.map(function (result) {
/******/ 						return result.apply(reportError);
/******/ 					})
/******/ 			)
/******/ 				.then(function (applyResults) {
/******/ 					applyResults.forEach(function (modules) {
/******/ 						if (modules) {
/******/ 							for (var i = 0; i < modules.length; i++) {
/******/ 								outdatedModules.push(modules[i]);
/******/ 							}
/******/ 						}
/******/ 					});
/******/ 				})
/******/ 				.then(onAccepted);
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			792: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdate_turnkey_frames_export_and_sign"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					var result = newModuleFactory
/******/ 						? getAffectedModuleEffects(moduleId)
/******/ 						: {
/******/ 								type: "disposed",
/******/ 								moduleId: moduleId
/******/ 							};
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					var acceptPromises = [];
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									var result;
/******/ 									try {
/******/ 										result = callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 									if (result && typeof result.then === "function") {
/******/ 										acceptPromises.push(result);
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					var onAccepted = function () {
/******/ 						// Load self accepted modules
/******/ 						for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 							var item = outdatedSelfAcceptedModules[o];
/******/ 							var moduleId = item.module;
/******/ 							try {
/******/ 								item.require(moduleId);
/******/ 							} catch (err) {
/******/ 								if (typeof item.errorHandler === "function") {
/******/ 									try {
/******/ 										item.errorHandler(err, {
/******/ 											moduleId: moduleId,
/******/ 											module: __webpack_require__.c[moduleId]
/******/ 										});
/******/ 									} catch (err1) {
/******/ 										if (options.onErrored) {
/******/ 											options.onErrored({
/******/ 												type: "self-accept-error-handler-errored",
/******/ 												moduleId: moduleId,
/******/ 												error: err1,
/******/ 												originalError: err
/******/ 											});
/******/ 										}
/******/ 										if (!options.ignoreErrored) {
/******/ 											reportError(err1);
/******/ 											reportError(err);
/******/ 										}
/******/ 									}
/******/ 								} else {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					};
/******/ 		
/******/ 					return Promise.all(acceptPromises)
/******/ 						.then(onAccepted)
/******/ 						.then(function () {
/******/ 							return outdatedModules;
/******/ 						});
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_turnkey_frames_export_and_sign"] = self["webpackChunk_turnkey_frames_export_and_sign"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__.O(undefined, [96], () => (__webpack_require__(70336)))
/******/ 	__webpack_require__.O(undefined, [96], () => (__webpack_require__(79001)))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [96], () => (__webpack_require__(60044)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.e220688a77c354e49dd5.js.map