import "@testing-library/jest-dom";
import * as crypto from "crypto";
import * as TKHQ from "./src/turnkey-core.js";
import { bech32 } from "bech32";

// Mock the TURNKEY_SIGNER_ENVIRONMENT replacement that webpack would do
const verifyEnclaveSignature = async function (
  enclaveQuorumPublic,
  publicSignature,
  signedData
) {
  // Replace the template string with actual environment
  const TURNKEY_SIGNERS_ENCLAVES = {
    prod: "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
    preprod:
      "04f3422b8afbe425d6ece77b8d2469954715a2ff273ab7ac89f1ed70e0a9325eaa1698b4351fd1b23734e65c0b6a86b62dd49d70b37c94606aac402cbd84353212",
  };

  const TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY =
    TURNKEY_SIGNERS_ENCLAVES["prod"];

  if (TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY === undefined) {
    throw new Error(
      "Configuration error: TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY is undefined"
    );
  }

  if (enclaveQuorumPublic) {
    if (enclaveQuorumPublic !== TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY) {
      throw new Error(
        `enclave quorum public keys from client and bundle do not match. Client: ${TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY}. Bundle: ${enclaveQuorumPublic}.`
      );
    }
  }

  const encryptionQuorumPublicBuf = new Uint8Array(
    TKHQ.uint8arrayFromHexString(TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY)
  );
  const quorumKey = await loadQuorumKey(encryptionQuorumPublicBuf);
  if (!quorumKey) {
    throw new Error("failed to load quorum key");
  }

  const publicSignatureBuf = TKHQ.fromDerSignature(publicSignature);
  const signedDataBuf = TKHQ.uint8arrayFromHexString(signedData);
  return await crypto.webcrypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    quorumKey,
    publicSignatureBuf,
    signedDataBuf
  );
};

async function loadQuorumKey(quorumPublic) {
  return await crypto.webcrypto.subtle.importKey(
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

describe("TKHQ", () => {
  beforeEach(() => {
    window.TextDecoder = global.TextDecoder;
    window.TextEncoder = global.TextEncoder;
    window.__TURNKEY_SIGNER_ENVIRONMENT__ = "prod";

    global.crypto = crypto.webcrypto;
    window.crypto = crypto.webcrypto;
    TKHQ.setCryptoProvider(crypto.webcrypto);

    window.localStorage.clear();
  });

  it("gets and sets embedded target key in localStorage", async () => {
    expect(TKHQ.getTargetEmbeddedKey()).toBe(null);

    // Set a dummy "key"
    TKHQ.setTargetEmbeddedKey({ foo: "bar" });
    expect(TKHQ.getTargetEmbeddedKey()).toEqual({ foo: "bar" });
  });

  it("imports P256 keys", async () => {
    const targetPubHex =
      "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f";
    const targetPublicBuf = TKHQ.uint8arrayFromHexString(targetPubHex);
    const key = await TKHQ.loadTargetKey(new Uint8Array(targetPublicBuf));
    expect(key.kty).toEqual("EC");
    expect(key.ext).toBe(true);
    expect(key.crv).toBe("P-256");
    expect(key.key_ops).toEqual([]);
  });

  it("decodes bitcoin wif private key correctly", async () => {
    const keyBtcWif = "L1sF5SF3CnCN9gA7vh7MAtbiVu9igdr3C1BYPKZduw4yaezdeCTV";
    const keyBytes = TKHQ.base58Decode(keyBtcWif);
    expect(keyBytes.length).toBeGreaterThan(32);
    const keyPrivBytes = keyBytes.subarray(1, 33); // Remove version byte at start and compression flag at end
    const decodedKey = await TKHQ.decodeKey(keyBtcWif, "BITCOIN_MAINNET_WIF");
    expect(decodedKey.length).toEqual(keyPrivBytes.length);
    for (let i = 0; i < decodedKey.length; i++) {
      expect(decodedKey[i]).toEqual(keyPrivBytes[i]);
    }
  });

  // Bitcoin WIF negative tests
  it("rejects bitcoin WIF with invalid base58 characters", async () => {
    const invalidWif = "L1sF5SF3CnCN9gA7vh7MAtbiVu9igdr3C1BYPKZduw4yaezdeCT0"; // contains '0'
    await expect(
      TKHQ.decodeKey(invalidWif, "BITCOIN_MAINNET_WIF")
    ).rejects.toThrow();
  });

  it("rejects bitcoin WIF with invalid checksum", async () => {
    const invalidChecksumWif =
      "L1sF5SF3CnCN9gA7vh7MAtbiVu9igdr3C1BYPKZduw4yaezdeXXX";
    await expect(
      TKHQ.decodeKey(invalidChecksumWif, "BITCOIN_MAINNET_WIF")
    ).rejects.toThrow("invalid base58check checksum");
  });

  it("decodes sui bech32 private key correctly", async () => {
    const keySuiBech32 =
      "suiprivkey1qpj5xd9396rxsu7h45tzccalhuf95e4pygls3ps9txszn9ywpwsnznaeq0l";
    const { words } = bech32.decode(keySuiBech32);
    const keyBytes = Uint8Array.from(bech32.fromWords(words)).subarray(1); // Remove version byte at start
    expect(keyBytes.length).toEqual(32);
    const decodedKey = await TKHQ.decodeKey(keySuiBech32, "SUI_BECH32");
    expect(decodedKey.length).toEqual(keyBytes.length);
    for (let i = 0; i < decodedKey.length; i++) {
      expect(decodedKey[i]).toEqual(keyBytes[i]);
    }
  });

  // SUI Bech32 negative tests
  it("rejects sui private key with wrong HRP", async () => {
    // Create a valid bech32 string with wrong prefix
    const schemeFlag = 0x00;
    const privateKey = new Uint8Array(32).fill(0x42);
    const payload = new Uint8Array([schemeFlag, ...privateKey]);
    const words = bech32.toWords(payload);
    const wrongHrp = bech32.encode("sui", words); // Wrong prefix, should be "suiprivkey"

    await expect(TKHQ.decodeKey(wrongHrp, "SUI_BECH32")).rejects.toThrow(
      'invalid SUI private key human-readable part (HRP): expected "suiprivkey"'
    );
  });

  it("rejects sui private key with invalid scheme flag", async () => {
    // Construct a valid bech32 string with scheme flag = 0x01 (Secp256k1)
    // Format: scheme_flag (1 byte) + private_key (32 bytes) = 33 bytes total
    const schemeFlag = 0x01; // Secp256k1
    const privateKey = new Uint8Array(32).fill(0x42); // dummy 32-byte key
    const payload = new Uint8Array([schemeFlag, ...privateKey]);

    // Convert to bech32 words and encode
    const words = bech32.toWords(payload);
    const secp256k1Key = bech32.encode("suiprivkey", words);

    await expect(TKHQ.decodeKey(secp256k1Key, "SUI_BECH32")).rejects.toThrow(
      "invalid SUI private key scheme flag: expected 0 (Ed25519)"
    );
  });

  it("decodes hex-encoded private key correctly by default", async () => {
    const keyHex =
      "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
    const keyBytes = TKHQ.uint8arrayFromHexString(keyHex.slice(2));
    const decodedKey = await TKHQ.decodeKey(keyHex);
    expect(decodedKey.length).toEqual(keyBytes.length);
    for (let i = 0; i < decodedKey.length; i++) {
      expect(decodedKey[i]).toEqual(keyBytes[i]);
    }
  });

  it("decodes hex-encoded private key correctly", async () => {
    const keyHex =
      "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
    const keyBytes = TKHQ.uint8arrayFromHexString(keyHex.slice(2));
    const decodedKey = await TKHQ.decodeKey(keyHex, "HEXADECIMAL");
    expect(decodedKey.length).toEqual(keyBytes.length);
    for (let i = 0; i < decodedKey.length; i++) {
      expect(decodedKey[i]).toEqual(keyBytes[i]);
    }
  });

  it("decodes solana private key correctly", async () => {
    const keySol =
      "2P3qgS5A18gGmZJmYHNxYrDYPyfm6S3dJgs8tPW6ki6i2o4yx7K8r5N8CF7JpEtQiW8mx1kSktpgyDG1xuWNzfsM";
    const keyBytes = TKHQ.base58Decode(keySol);
    expect(keyBytes.length).toEqual(64);
    const keyPrivBytes = keyBytes.subarray(0, 32);
    const decodedKey = await TKHQ.decodeKey(keySol, "SOLANA");
    expect(decodedKey.length).toEqual(keyPrivBytes.length);
    for (let i = 0; i < decodedKey.length; i++) {
      expect(decodedKey[i]).toEqual(keyPrivBytes[i]);
    }
  });

  it("contains additionalAssociatedData", async () => {
    // This is a trivial helper; concatenates the 2 arrays!
    expect(
      TKHQ.additionalAssociatedData(
        new Uint8Array([1, 2]),
        new Uint8Array([3, 4])
      ).buffer
    ).toEqual(new Uint8Array([1, 2, 3, 4]).buffer);
  });

  it("contains uint8arrayToHexString", () => {
    expect(
      TKHQ.uint8arrayToHexString(
        new Uint8Array([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])
      )
    ).toEqual("627566666572");
  });

  it("contains uint8arrayFromHexString", () => {
    expect(TKHQ.uint8arrayFromHexString("627566666572").toString()).toEqual(
      "98,117,102,102,101,114"
    );
  });

  it("logs messages and sends messages up", async () => {
    // TODO: test logMessage / sendMessageUp
    expect(true).toBe(true);
  });

  it("normalizes padding in a byte array", () => {
    // Array with no leading 0's and a valid target length
    const arr = new Uint8Array(32).fill(1);
    expect(TKHQ.normalizePadding(arr, 32).length).toBe(32);
    expect(TKHQ.normalizePadding(arr, 32)).toBe(arr);

    // Array with an extra leading 0 and valid target length
    const zeroesArr = new Uint8Array(1).fill(0);
    const zeroesLeadingArr = new Uint8Array([...zeroesArr, ...arr]);
    expect(TKHQ.normalizePadding(zeroesLeadingArr, 32).length).toBe(32);
    expect(TKHQ.normalizePadding(zeroesLeadingArr, 32)).toStrictEqual(arr);

    // Array with a missing leading 0 and valid target length
    const zeroesMissingArr = new Uint8Array(31).fill(1);
    const paddedArr = new Uint8Array(32);
    paddedArr.fill(1, 1);
    expect(TKHQ.normalizePadding(zeroesMissingArr, 32).length).toBe(32);
    expect(
      Array.from(TKHQ.normalizePadding(zeroesMissingArr, 32))
    ).toStrictEqual(Array.from(paddedArr));

    // Array with an extra leading 0 and invalid zero count
    expect(() => TKHQ.normalizePadding(zeroesLeadingArr, 31)).toThrow(
      "invalid number of starting zeroes. Expected number of zeroes: 2. Found: 1."
    );
  });

  it("decodes a ASN.1 DER-encoded signature to raw format", () => {
    // Valid signature where r and s don't need padding
    expect(
      TKHQ.fromDerSignature(
        "304402202b769b6dd410ff8a1cbcd5dd7fb2733e80f11922443b1eb629e6e538d1054c3b022020b9715d140f079190123411370971cc6daba8e61b6b58d36321c31ae331799b"
      ).length
    ).toBe(64);

    // Valid signature where r and s have extra padding
    expect(
      TKHQ.fromDerSignature(
        "3046022100b71f5a377a7ae6d245d1aa22145f52f7c7d87fcaf7c68c60f43fecf3817b22cf022100cdea30eb54c099a8c86b14c3d2c4accd59c21fbeacd878842d5e9bdd39d19d55"
      ).length
    ).toBe(64);

    // Valid signature where r has extra padding
    expect(
      TKHQ.fromDerSignature(
        "304502210088f4f3b59e277f30cb16c05541551eca702ce925002dbc3de3a7c0a7f76b23f902202a0f272c3e5724848dc5232c3409918277d65fd7e8c6eb1630bf6eb2eeb472e3"
      ).length
    ).toBe(64);

    // Invalid signature. Wrong integer tag for r
    expect(() =>
      TKHQ.fromDerSignature(
        "304503210088f4f3b59e277f30cb16c05541551eca702ce925002dbc3de3a7c0a7f76b23f902202a0f272c3e5724848dc5232c3409918277d65fd7e8c6eb1630bf6eb2eeb472e3"
      )
    ).toThrow("failed to convert DER-encoded signature: invalid tag for r");

    // Invalid signature. Wrong integer tag for s
    expect(() =>
      TKHQ.fromDerSignature(
        "304502210088f4f3b59e277f30cb16c05541551eca702ce925002dbc3de3a7c0a7f76b23f903202a0f272c3e5724848dc5232c3409918277d65fd7e8c6eb1630bf6eb2eeb472e3"
      )
    ).toThrow("failed to convert DER-encoded signature: invalid tag for s");
  });

  it("verifies enclave signature", async () => {
    // No "enclaveQuorumPublic" field in the export bundle. Valid signature
    let verified = await verifyEnclaveSignature(
      null,
      "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
      "04e479640d6d3487bbf132f6258ee24073411b8325ea68bb28883e45b650d059f82c48db965b8f777b30ab9e7810826bfbe8ad1789f9f10bf76dcd36b2ee399bc5"
    );
    expect(verified).toBe(true);

    // "enclaveQuorumPublic" field present in the export bundle. Valid signature
    verified = await verifyEnclaveSignature(
      "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
      "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
      "04e479640d6d3487bbf132f6258ee24073411b8325ea68bb28883e45b650d059f82c48db965b8f777b30ab9e7810826bfbe8ad1789f9f10bf76dcd36b2ee399bc5"
    );
    expect(verified).toBe(true);

    // "enclaveQuorumPublic" field present in the export bundle but doesn't match what's pinned on export.turnkey.com
    await expect(
      verifyEnclaveSignature(
        "04ca7c0d624c75de6f34af342e87a21e0d8c83efd1bd5b5da0c0177c147f744fba6f01f9f37356f9c617659aafa55f6e0af8d169a8f054d153ab3201901fb63ecb",
        "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
        "04e479640d6d3487bbf132f6258ee24073411b8325ea68bb28883e45b650d059f82c48db965b8f777b30ab9e7810826bfbe8ad1789f9f10bf76dcd36b2ee399bc5"
      )
    ).rejects.toThrow(
      "enclave quorum public keys from client and bundle do not match. Client: 04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569. Bundle: 04ca7c0d624c75de6f34af342e87a21e0d8c83efd1bd5b5da0c0177c147f744fba6f01f9f37356f9c617659aafa55f6e0af8d169a8f054d153ab3201901fb63ecb."
    );

    // Invalid signature
    verified = await verifyEnclaveSignature(
      "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
      "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
      "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4"
    );
    expect(verified).toBe(false);

    // Invalid DER-encoding for signature
    await expect(
      verifyEnclaveSignature(
        null,
        "300220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
        "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4"
      )
    ).rejects.toThrow(
      "failed to convert DER-encoded signature: invalid tag for r"
    );

    // Invalid hex-encoding for signature
    await expect(
      verifyEnclaveSignature(
        null,
        "",
        "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4"
      )
    ).rejects.toThrow("cannot create uint8array from invalid hex string");

    // Invalid hex-encoding for public key
    await expect(
      verifyEnclaveSignature(
        null,
        "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
        ""
      )
    ).rejects.toThrow("cannot create uint8array from invalid hex string");
  });

  it("validates styles", async () => {
    let simpleValid = { padding: "10px" };
    expect(TKHQ.validateStyles(simpleValid)).toEqual(simpleValid);

    simpleValid = { padding: "10px", margin: "10px", fontSize: "16px" };
    expect(TKHQ.validateStyles(simpleValid)).toEqual(simpleValid);

    let simpleValidPadding = {
      "padding  ": "10px",
      margin: "10px",
      fontSize: "16px",
    };
    expect(TKHQ.validateStyles(simpleValidPadding)).toEqual(simpleValid);

    let simpleInvalidCase = {
      padding: "10px",
      margin: "10px",
      "font-size": "16px",
    };
    expect(() => TKHQ.validateStyles(simpleInvalidCase)).toThrow(
      `invalid or unsupported css style property: "font-size"`
    );

    let fontFamilyInvalid = { fontFamily: "<script>malicious</script>" };
    expect(() => TKHQ.validateStyles(fontFamilyInvalid)).toThrow(
      `invalid css style value for property "fontFamily"`
    );

    fontFamilyInvalid = { fontFamily: '"Courier"' };
    expect(() => TKHQ.validateStyles(fontFamilyInvalid)).toThrow(
      `invalid css style value for property "fontFamily"`
    );

    fontFamilyInvalid = { fontFamily: "San Serif;" };
    expect(() => TKHQ.validateStyles(fontFamilyInvalid)).toThrow(
      `invalid css style value for property "fontFamily"`
    );

    let allStylesValid = {
      padding: "10px",
      margin: "10px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "transparent",
      borderRadius: "5px",
      fontSize: "16px",
      fontWeight: "bold",
      fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      color: "#000000",
      backgroundColor: "rgb(128, 0, 128)",
      width: "100%",
      height: "auto",
      maxWidth: "100%",
      maxHeight: "100%",
      lineHeight: "1.25rem",
      boxShadow: "0px 0px 10px #aaa",
      textAlign: "center",
      overflowWrap: "break-word",
      wordWrap: "break-word",
      resize: "none",
    };
    expect(TKHQ.validateStyles(allStylesValid)).toEqual(allStylesValid);
  });
});

// ---------------------------------------------------------------------------
// TURNKEY_INIT_MESSAGE_CHANNEL gate validation (INT-783)
//
// These tests verify that the second window.addEventListener("message", ...)
// handler in index.js — the one that establishes the MessageChannel — now
// enforces the same cross-origin gate added to export-and-sign in PR #129:
//   • event.source === window.parent  (direct parent only)
//   • event.origin && event.origin !== "null"  (no opaque origins)
//   • event.ports?.length === 1  (exactly one transferred port)
// ---------------------------------------------------------------------------

describe("TURNKEY_INIT_MESSAGE_CHANNEL gate (import frame)", () => {
  let dom;
  let TKHQModule;
  let parentWindow;

  /**
   * index.js registers its listeners as module-level side effects.
   * We use jest.isolateModules + require() to force a fresh module evaluation
   * per test.  The listeners bind to the jest-environment's built-in `window`
   * (which is already JSDOM), so AbortSignal instanceof checks pass correctly.
   */
  beforeEach(async () => {
    parentWindow = {};

    // Override window.parent on the jest-environment window so that
    // `event.source === window.parent` comparisons work as expected.
    Object.defineProperty(window, "parent", {
      configurable: true,
      value: parentWindow,
    });

    global.crypto = crypto.webcrypto;

    // Isolate and load the module so its top-level addEventListener calls fire
    // against the jest-env window.
    await new Promise((resolve) => {
      jest.isolateModules(() => {
        jest.mock("./src/styles.css", () => {}, { virtual: true });
        jest.mock("@shared/crypto-utils.js", () => ({
          HpkeEncrypt: jest.fn(),
        }));

        // Load turnkey-core inside isolation so we can spy on it.
        TKHQModule = require("./src/turnkey-core.js");
        jest.spyOn(TKHQModule, "sendMessageUp").mockImplementation(() => {});
        jest
          .spyOn(TKHQModule, "setParentFrameMessageChannelPort")
          .mockImplementation(() => {});

        require("./src/index.js");
        resolve();
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    // Restore window.parent to its original value (itself, in standalone JSDOM)
    Object.defineProperty(window, "parent", {
      configurable: true,
      value: window,
    });
  });

  /** Build a well-formed TURNKEY_INIT_MESSAGE_CHANNEL MessageEvent. */
  function makeInitEvent(
    origin = "https://app.turnkey.com",
    source = parentWindow,
    portCount = 1
  ) {
    const ports = Array.from({ length: portCount }, () => ({
      onmessage: null,
      postMessage: jest.fn(),
    }));
    const event = new window.MessageEvent("message", {
      data: { type: "TURNKEY_INIT_MESSAGE_CHANNEL" },
      ports,
      origin,
    });
    Object.defineProperty(event, "source", { value: source });
    return { event, ports };
  }

  it("accepts a valid TURNKEY_INIT_MESSAGE_CHANNEL from the parent", async () => {
    const { event } = makeInitEvent();
    window.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(TKHQModule.setParentFrameMessageChannelPort).toHaveBeenCalledTimes(
      1
    );
    expect(TKHQModule.sendMessageUp).toHaveBeenCalledWith(
      "PUBLIC_KEY_READY",
      ""
    );
  });

  it("rejects a message whose source is not window.parent", async () => {
    const { event } = makeInitEvent(
      "https://app.turnkey.com",
      {} // a different object — not parentWindow
    );
    window.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(TKHQModule.setParentFrameMessageChannelPort).not.toHaveBeenCalled();
  });

  it("rejects a message with an opaque ('null') origin", async () => {
    const { event } = makeInitEvent("null");
    window.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(TKHQModule.setParentFrameMessageChannelPort).not.toHaveBeenCalled();
  });

  it("rejects a message with an empty origin", async () => {
    const { event } = makeInitEvent("");
    window.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(TKHQModule.setParentFrameMessageChannelPort).not.toHaveBeenCalled();
  });

  it("rejects a message with zero transferred ports", async () => {
    const { event } = makeInitEvent("https://app.turnkey.com", parentWindow, 0);
    window.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(TKHQModule.setParentFrameMessageChannelPort).not.toHaveBeenCalled();
  });

  it("rejects a message with more than one transferred port", async () => {
    const { event } = makeInitEvent("https://app.turnkey.com", parentWindow, 2);
    window.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(TKHQModule.setParentFrameMessageChannelPort).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// onInjectImportBundle org/user binding (ENG-4597)
//
// These tests verify that onInjectImportBundle now THROWS (instead of warning
// and proceeding) when organizationId or userId is missing from the caller.
// ---------------------------------------------------------------------------

describe("onInjectImportBundle org/user binding (import frame)", () => {
  let TKHQModule;

  /**
   * Encode a JavaScript object as a hex string (matching what the server does:
   * JSON.stringify → TextEncoder → hex).
   */
  function hexEncodeData(obj) {
    const jsonStr = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(jsonStr);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Build a minimal v1.0.0 import bundle whose enclave signature will be
   * accepted (because we mock verifyEnclaveSignature to return true), and
   * whose signed data contains the provided fields.
   */
  function makeBundleV1(signedDataFields) {
    const data = hexEncodeData(signedDataFields);
    return JSON.stringify({
      version: "v1.0.0",
      data,
      dataSignature: "aabbcc", // value doesn't matter — we mock verify
      enclaveQuorumPublic: "04aabbcc", // value doesn't matter — we mock verify
    });
  }

  /**
   * Dispatch an INJECT_IMPORT_BUNDLE message event and wait for the async
   * handler to settle.  Returns sendMessageUp call args since this dispatch.
   */
  async function dispatchInjectBundle(bundle, organizationId, userId) {
    // Clear previous calls (e.g. PUBLIC_KEY_READY from DOMContentLoaded)
    TKHQModule.sendMessageUp.mockClear();

    const event = new window.MessageEvent("message", {
      data: {
        type: "INJECT_IMPORT_BUNDLE",
        value: bundle,
        organizationId,
        userId,
        requestId: "req-test",
      },
    });
    window.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 0));
    return TKHQModule.sendMessageUp.mock.calls;
  }

  beforeEach(async () => {
    global.crypto = crypto.webcrypto;

    await new Promise((resolve) => {
      jest.isolateModules(() => {
        jest.mock("./src/styles.css", () => {}, { virtual: true });
        jest.mock("@shared/crypto-utils.js", () => ({
          HpkeEncrypt: jest.fn(),
        }));

        TKHQModule = require("./src/turnkey-core.js");

        // Mock sendMessageUp so we can assert which message type was sent
        jest.spyOn(TKHQModule, "sendMessageUp").mockImplementation(() => {});
        jest
          .spyOn(TKHQModule, "setParentFrameMessageChannelPort")
          .mockImplementation(() => {});

        // Mock verifyEnclaveSignature so ALL bundles pass the signature check.
        // This lets us test the org/user binding logic in isolation.
        jest
          .spyOn(TKHQModule, "verifyEnclaveSignature")
          .mockResolvedValue(true);

        // Mock loadTargetKey so we don't need a real crypto key
        jest
          .spyOn(TKHQModule, "loadTargetKey")
          .mockResolvedValue({ kty: "EC" });
        jest
          .spyOn(TKHQModule, "setTargetEmbeddedKey")
          .mockImplementation(() => {});

        require("./src/index.js");

        // Trigger DOMContentLoaded so that index.js registers its
        // window "message" listener for INJECT_IMPORT_BUNDLE events.
        document.dispatchEvent(new Event("DOMContentLoaded"));

        resolve();
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("throws when organizationId is missing (undefined)", async () => {
    const bundle = makeBundleV1({
      organizationId: "org-123",
      userId: "user-456",
      targetPublic:
        "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f",
    });
    const calls = await dispatchInjectBundle(bundle, undefined, "user-456");

    // The catch block in messageEventListener sends ERROR
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe("ERROR");
    expect(calls[0][1]).toContain('missing "organizationId"');
  });

  it("throws when organizationId is empty string", async () => {
    const bundle = makeBundleV1({
      organizationId: "org-123",
      userId: "user-456",
      targetPublic:
        "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f",
    });
    const calls = await dispatchInjectBundle(bundle, "", "user-456");

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe("ERROR");
    expect(calls[0][1]).toContain('missing "organizationId"');
  });

  it("throws when userId is missing (undefined)", async () => {
    const bundle = makeBundleV1({
      organizationId: "org-123",
      userId: "user-456",
      targetPublic:
        "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f",
    });
    const calls = await dispatchInjectBundle(bundle, "org-123", undefined);

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe("ERROR");
    expect(calls[0][1]).toContain('missing "userId"');
  });

  it("throws when userId is empty string", async () => {
    const bundle = makeBundleV1({
      organizationId: "org-123",
      userId: "user-456",
      targetPublic:
        "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f",
    });
    const calls = await dispatchInjectBundle(bundle, "org-123", "");

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe("ERROR");
    expect(calls[0][1]).toContain('missing "userId"');
  });

  it("throws when organizationId does not match the bundle's signedData", async () => {
    const bundle = makeBundleV1({
      organizationId: "org-DIFFERENT",
      userId: "user-456",
      targetPublic:
        "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f",
    });
    const calls = await dispatchInjectBundle(bundle, "org-123", "user-456");

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe("ERROR");
    expect(calls[0][1]).toContain(
      "organization id does not match expected value"
    );
  });

  it("throws when userId does not match the bundle's signedData", async () => {
    const bundle = makeBundleV1({
      organizationId: "org-123",
      userId: "user-DIFFERENT",
      targetPublic:
        "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f",
    });
    const calls = await dispatchInjectBundle(bundle, "org-123", "user-456");

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe("ERROR");
    expect(calls[0][1]).toContain("user id does not match expected value");
  });

  it("succeeds (BUNDLE_INJECTED) when organizationId and userId match", async () => {
    const bundle = makeBundleV1({
      organizationId: "org-123",
      userId: "user-456",
      targetPublic:
        "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f",
    });
    const calls = await dispatchInjectBundle(bundle, "org-123", "user-456");

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toBe("BUNDLE_INJECTED");
    expect(calls[0][1]).toBe(true);
  });
});
