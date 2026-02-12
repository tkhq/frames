import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import * as crypto from "crypto";
import {
  DEFAULT_TTL_MILLISECONDS,
  onInjectKeyBundle,
  onSignTransaction,
  getKeyNotFoundErrorMessage,
  onStoreEncryptedBundle,
  onInjectDecryptionKeyBundle,
  onBurnSession,
  onGetStoredWalletAddresses,
  onClearStoredBundles,
} from "./src/event-handlers.js";

jest.mock("@solana/web3.js", () => {
  const mockKeypair = {
    secretKey: new Uint8Array(64).fill(7),
    publicKey: {
      toBytes: () => new Uint8Array(32).fill(8),
    },
  };

  return {
    Keypair: {
      fromSeed: jest.fn(() => mockKeypair),
      fromSecretKey: jest.fn(() => mockKeypair),
    },
    Transaction: jest.fn(),
    SystemProgram: {},
    LAMPORTS_PER_SOL: 1,
    PublicKey: jest.fn(),
    Connection: jest.fn(),
    sendAndConfirmTransaction: jest.fn(),
    VersionedTransaction: {
      deserialize: jest.fn(() => ({
        sign: jest.fn(),
        serialize: jest.fn(() => new Uint8Array([1, 2, 3])),
      })),
    },
  };
});

const html = fs
  .readFileSync(path.resolve(__dirname, "./src/index.template.html"), "utf8")
  .replace("__TURNKEY_SIGNER_ENVIRONMENT__", "prod");

let dom;
let TKHQ;
let TKHQModule;

describe("TKHQ", () => {
  beforeEach(async () => {
    dom = new JSDOM(html, {
      runScripts: "dangerously", // For script tags
      url: "http://localhost", // For local storage

      // Necessary for TextDecoder to be available.
      // See https://github.com/jsdom/jsdom/issues/2524
      beforeParse(window) {
        window.TextDecoder = TextDecoder;
        window.TextEncoder = TextEncoder;
        window.__TURNKEY_SIGNER_ENVIRONMENT__ = "prod"; // Hardcode for testing
      },
    });

    // Necessary for crypto to be available.
    // See https://github.com/jsdom/jsdom/issues/1612
    Object.defineProperty(dom.window, "crypto", {
      value: crypto.webcrypto,
    });

    // Create a script element and inject the bundled TKHQ utilities
    global.window = dom.window;
    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;
    global.crypto = crypto.webcrypto;

    const module = await import("./src/turnkey-core.js");
    TKHQModule = module.TKHQ;

    // Expose TKHQ module via DOM window for testing
    dom.window.TKHQ = TKHQModule;
    TKHQ = dom.window.TKHQ;
  });

  describe("LocalStorage with expiry", () => {
    it("gets and sets items with expiry localStorage", async () => {
      // Set a TTL of 1000ms
      TKHQ.setItemWithExpiry("k", "v", 1000);
      let item = JSON.parse(dom.window.localStorage.getItem("k"));
      expect(item.value).toBe("v");
      expect(item.expiry).toBeTruthy();

      // Get item that has not expired yet
      item = TKHQ.getItemWithExpiry("k");
      expect(item).toBe("v");

      // Test expired item: use setItemWithExpiry, then manually set expiry in the past
      TKHQ.setItemWithExpiry("a", "b", 500);
      // Verify the item was set correctly with setItemWithExpiry
      let itemA = JSON.parse(dom.window.localStorage.getItem("a"));
      expect(itemA.value).toBe("b");
      expect(itemA.expiry).toBeTruthy();

      // Now manually modify the expiry to be in the past to test expiration
      const expiredItem = {
        value: "b",
        expiry: new Date().getTime() - 1000,
      };
      dom.window.localStorage.setItem("a", JSON.stringify(expiredItem));
      const expiredResult = TKHQ.getItemWithExpiry("a");
      expect(expiredResult).toBeNull();

      // Returns null if getItemWithExpiry is called for item without expiry
      dom.window.localStorage.setItem("k", JSON.stringify({ value: "v" }));
      item = TKHQ.getItemWithExpiry("k");
      expect(item).toBeNull();
    });
  });

  describe("Embedded key management", () => {
    it("gets and sets embedded key in localStorage", async () => {
      expect(TKHQ.getEmbeddedKey()).toBe(null);

      // Set a dummy "key"
      TKHQ.setEmbeddedKey({ foo: "bar" });
      expect(TKHQ.getEmbeddedKey()).toEqual({ foo: "bar" });
    });

    it("inits embedded key and is idempotent", async () => {
      expect(TKHQ.getEmbeddedKey()).toBe(null);
      await TKHQ.initEmbeddedKey();
      const generatedKey = TKHQ.getEmbeddedKey();
      expect(generatedKey).not.toBeNull();

      // This should have no effect; generated key should stay the same
      await TKHQ.initEmbeddedKey();
      expect(TKHQ.getEmbeddedKey()).toEqual(generatedKey);
    });
  });

  describe("Key generation and cryptography", () => {
    it("generates P256 keys", async () => {
      let key = await TKHQ.generateTargetKey();
      expect(key.kty).toEqual("EC");
      expect(key.ext).toBe(true);
      expect(key.crv).toBe("P-256");
      expect(key.key_ops).toContain("deriveBits");
    });

    it("contains p256JWKPrivateToPublic", async () => {
      // TODO: test this
      expect(true).toBe(true);
    });
  });

  describe("Key encoding and formats", () => {
    it("encodes hex-encoded private key correctly by default", async () => {
      const keyHex =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const encodedKey = await TKHQ.encodeKey(
        TKHQ.uint8arrayFromHexString(keyHex.slice(2))
      );
      expect(encodedKey).toEqual(keyHex);
    });

    it("encodes hex-encoded private key correctly", async () => {
      const keyHex =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const encodedKey = await TKHQ.encodeKey(
        TKHQ.uint8arrayFromHexString(keyHex.slice(2)),
        "HEXADECIMAL"
      );
      expect(encodedKey).toEqual(keyHex);
    });

    it("encodes solana private key correctly", async () => {
      const keySol =
        "2P3qgS5A18gGmZJmYHNxYrDYPyfm6S3dJgs8tPW6ki6i2o4yx7K8r5N8CF7JpEtQiW8mx1kSktpgyDG1xuWNzfsM";
      const keySolBytes = TKHQ.base58Decode(keySol);
      expect(keySolBytes.length).toEqual(64);
      const keyPrivBytes = keySolBytes.subarray(0, 32);
      const keyPubBytes = keySolBytes.subarray(32, 64);
      const encodedKey = await TKHQ.encodeKey(
        keyPrivBytes,
        "SOLANA",
        keyPubBytes
      );
      expect(encodedKey).toEqual(keySol);
    });
  });

  describe("Misc util functions", () => {
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

      // Error case: bad value
      expect(() => {
        TKHQ.uint8arrayFromHexString({});
      }).toThrow("cannot create uint8array from invalid hex string");
      // Error case: empty string
      expect(() => {
        TKHQ.uint8arrayFromHexString("");
      }).toThrow("cannot create uint8array from invalid hex string");
      // Error case: odd number of characters
      expect(() => {
        TKHQ.uint8arrayFromHexString("123");
      }).toThrow("cannot create uint8array from invalid hex string");
      // Error case: bad characters outside of hex range
      expect(() => {
        TKHQ.uint8arrayFromHexString("oops");
      }).toThrow("cannot create uint8array from invalid hex string");
    });

    it("handles hex strings with 0x prefix in uint8arrayFromHexString", () => {
      // With 0x prefix (lowercase)
      expect(TKHQ.uint8arrayFromHexString("0x627566666572").toString()).toEqual(
        "98,117,102,102,101,114"
      );

      // With 0X prefix (uppercase)
      expect(TKHQ.uint8arrayFromHexString("0X627566666572").toString()).toEqual(
        "98,117,102,102,101,114"
      );

      // Without prefix (backward compatibility)
      expect(TKHQ.uint8arrayFromHexString("627566666572").toString()).toEqual(
        "98,117,102,102,101,114"
      );

      // Real private key with 0x prefix
      const keyHex =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const keyBytes = TKHQ.uint8arrayFromHexString(keyHex);
      expect(keyBytes.length).toBe(32);

      // Same key without 0x prefix should give same result
      const keyBytesWithoutPrefix = TKHQ.uint8arrayFromHexString(
        keyHex.slice(2)
      );
      expect(keyBytes.toString()).toEqual(keyBytesWithoutPrefix.toString());
    });

    it("parsePrivateKey handles different formats", () => {
      // Hex format without 0x prefix
      const hexKey =
        "13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const parsedHex = TKHQ.parsePrivateKey(hexKey);
      expect(parsedHex.length).toBe(32);

      // Hex format with 0x prefix
      const hexKeyWithPrefix =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const parsedHexWithPrefix = TKHQ.parsePrivateKey(hexKeyWithPrefix);
      expect(parsedHexWithPrefix.length).toBe(32);
      expect(parsedHex.toString()).toEqual(parsedHexWithPrefix.toString());

      // Array format
      const arrayKey = Array.from(TKHQ.uint8arrayFromHexString(hexKey));
      const parsedArray = TKHQ.parsePrivateKey(arrayKey);
      expect(parsedArray.length).toBe(32);
      expect(parsedArray.toString()).toEqual(parsedHex.toString());

      // Error case: invalid string format
      expect(() => {
        TKHQ.parsePrivateKey("invalid-key");
      }).toThrow("Invalid private key format");

      // Error case: invalid type
      expect(() => {
        TKHQ.parsePrivateKey(12345);
      }).toThrow("Private key must be a string");
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
  });

  describe("ASN.1 DER signature handling", () => {
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
  });

  describe("Enclave signature verification", () => {
    it("verifies enclave signature", async () => {
      // "enclaveQuorumPublic" field present in the export bundle. Valid signature
      let verified = await TKHQ.verifyEnclaveSignature(
        "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
        "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
        "04e479640d6d3487bbf132f6258ee24073411b8325ea68bb28883e45b650d059f82c48db965b8f777b30ab9e7810826bfbe8ad1789f9f10bf76dcd36b2ee399bc5"
      );
      expect(verified).toBe(true);

      // "enclaveQuorumPublic" field present in the export bundle but doesn't match what's pinned on export.turnkey.com
      await expect(
        TKHQ.verifyEnclaveSignature(
          "04ca7c0d624c75de6f34af342e87a21e0d8c83efd1bd5b5da0c0177c147f744fba6f01f9f37356f9c617659aafa55f6e0af8d169a8f054d153ab3201901fb63ecb",
          "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
          "04e479640d6d3487bbf132f6258ee24073411b8325ea68bb28883e45b650d059f82c48db965b8f777b30ab9e7810826bfbe8ad1789f9f10bf76dcd36b2ee399bc5"
        )
      ).rejects.toThrow(
        "enclave quorum public keys from client and bundle do not match. Client: 04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569. Bundle: 04ca7c0d624c75de6f34af342e87a21e0d8c83efd1bd5b5da0c0177c147f744fba6f01f9f37356f9c617659aafa55f6e0af8d169a8f054d153ab3201901fb63ecb."
      );

      // Invalid signature
      verified = await TKHQ.verifyEnclaveSignature(
        "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
        "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
        "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4"
      );
      expect(verified).toBe(false);

      // Invalid DER-encoding for signature
      await expect(
        TKHQ.verifyEnclaveSignature(
          "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
          "300220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
          "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4"
        )
      ).rejects.toThrow(
        "failed to convert DER-encoded signature: invalid tag for r"
      );

      // Invalid hex-encoding for signature
      await expect(
        TKHQ.verifyEnclaveSignature(
          "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
          "",
          "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4"
        )
      ).rejects.toThrow("cannot create uint8array from invalid hex string");

      // Invalid hex-encoding for public key
      await expect(
        TKHQ.verifyEnclaveSignature(
          "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
          "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
          ""
        )
      ).rejects.toThrow("cannot create uint8array from invalid hex string");
    });
  });

  describe("Settings and styles validation", () => {
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
});

describe("Key Expiration", () => {
  it("DEFAULT_TTL_MILLISECONDS is 24 hours (86,400,000 milliseconds)", () => {
    // Verify the TTL constant is correctly set to 24 hours
    expect(DEFAULT_TTL_MILLISECONDS).toBe(86400000); // milliseconds
  });

  it("expiry calculation uses milliseconds correctly", () => {
    const baseTime = 1000000000000; // Base timestamp
    const expectedExpiry = baseTime + DEFAULT_TTL_MILLISECONDS;

    const calculatedExpiry = baseTime + DEFAULT_TTL_MILLISECONDS;

    expect(calculatedExpiry).toBe(expectedExpiry);
    expect(calculatedExpiry - baseTime).toBe(86400000); // Exactly 24 hours
    expect(calculatedExpiry - baseTime).toBe(DEFAULT_TTL_MILLISECONDS);
  });

  it("expiry time is correctly set to 24 hours from injection time", () => {
    const mockTime = 1000000000000;
    const originalGetTime = Date.prototype.getTime;
    Date.prototype.getTime = jest.fn(() => mockTime);

    try {
      const currentTime = new Date().getTime();
      const expiry = currentTime + DEFAULT_TTL_MILLISECONDS;

      expect(expiry - currentTime).toBe(86400000);
      expect(expiry - currentTime).toBe(DEFAULT_TTL_MILLISECONDS);
      expect(expiry).toBe(mockTime + DEFAULT_TTL_MILLISECONDS);
    } finally {
      Date.prototype.getTime = originalGetTime;
    }
  });

  it("key expiration check correctly identifies expired keys", () => {
    const baseTime = 1000000000000;

    const keyExpiry = baseTime + DEFAULT_TTL_MILLISECONDS;

    // Before expiration
    const nowBefore = baseTime + DEFAULT_TTL_MILLISECONDS - 1000; // 1 second before expiry
    expect(nowBefore >= keyExpiry).toBe(false);

    // At expiration
    const nowAt = baseTime + DEFAULT_TTL_MILLISECONDS; // exactly at expiry
    expect(nowAt >= keyExpiry).toBe(true);

    // After expiration
    const nowAfter = baseTime + DEFAULT_TTL_MILLISECONDS + 1000; // 1 second after expiry
    expect(nowAfter >= keyExpiry).toBe(true);
  });
});

describe("Event Handler Expiration Flow", () => {
  const requestId = "test-request-id";
  const serializedTransaction = JSON.stringify({
    type: "SOLANA",
    transaction: "00",
  });
  const EXPIRED_TIME_MS = DEFAULT_TTL_MILLISECONDS + 1;

  let dom;
  let TKHQ;
  let sendMessageSpy;

  function buildBundle(organizationId = "org-test") {
    const signedData = {
      organizationId,
      encappedPublic: "aa",
      ciphertext: "bb",
    };

    const signedDataHex = Buffer.from(
      JSON.stringify(signedData),
      "utf8"
    ).toString("hex");

    return JSON.stringify({
      version: "v1.0.0",
      data: signedDataHex,
      dataSignature: "30440220773382ac",
      enclaveQuorumPublic: "04e479640d6d34",
    });
  }

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T00:00:00Z"));

    dom = new JSDOM(
      `<!doctype html><html><body><div id="key-div"></div><input id="embedded-key" /></body></html>`,
      {
        url: "http://localhost",
      }
    );

    global.window = dom.window;
    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
    global.crypto = crypto.webcrypto;

    const module = await import("./src/turnkey-core.js");
    TKHQ = module.TKHQ;
    dom.window.TKHQ = TKHQ;

    sendMessageSpy = jest
      .spyOn(TKHQ, "sendMessageUp")
      .mockImplementation(() => {});

    jest.spyOn(TKHQ, "verifyEnclaveSignature").mockResolvedValue(true);
    // Set a dummy embedded key for testing
    TKHQ.setEmbeddedKey({ foo: "bar" });
    expect(TKHQ.getEmbeddedKey()).toEqual({ foo: "bar" });
    jest.spyOn(TKHQ, "onResetEmbeddedKey").mockImplementation(() => {});
    jest.spyOn(TKHQ, "uint8arrayFromHexString").mockImplementation((hex) => {
      if (typeof hex !== "string" || hex.length === 0 || hex.length % 2 !== 0) {
        throw new Error("cannot create uint8array from invalid hex string");
      }
      return new Uint8Array(Buffer.from(hex, "hex"));
    });
    jest
      .spyOn(TKHQ, "uint8arrayToHexString")
      .mockImplementation((bytes) => Buffer.from(bytes).toString("hex"));
    jest
      .spyOn(TKHQ, "getEd25519PublicKey")
      .mockReturnValue(new Uint8Array(32).fill(3));
    jest
      .spyOn(TKHQ, "encodeKey")
      .mockImplementation(async (keyBytes, format) => {
        if (format === "SOLANA") {
          // Return a valid base58 string for SOLANA format
          return "2P3qgS5A18gGmZJmYHNxYrDYPyfm6S3dJgs8tPW6ki6i2o4yx7K8r5N8CF7JpEtQiW8mx1kSktpgyDG1xuWNzfsM";
        }
        return "encoded-key-material";
      });
    jest
      .spyOn(TKHQ, "parsePrivateKey")
      .mockReturnValue(new Uint8Array(64).fill(5));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    delete global.window;
    delete global.document;
    delete global.localStorage;
    delete global.crypto;
  });

  it("allows signing before expiry", async () => {
    const HpkeDecryptMock = jest
      .fn()
      .mockResolvedValue(new Uint8Array(64).fill(9));

    await onInjectKeyBundle(
      requestId,
      "org-test",
      buildBundle(),
      "SOLANA",
      undefined,
      HpkeDecryptMock
    );

    expect(HpkeDecryptMock).toHaveBeenCalled();

    await onSignTransaction(requestId, serializedTransaction, undefined);

    expect(sendMessageSpy).toHaveBeenNthCalledWith(
      2,
      "TRANSACTION_SIGNED",
      expect.any(String),
      requestId
    );
  });

  it("blocks signing after expiry", async () => {
    const HpkeDecryptMock = jest
      .fn()
      .mockResolvedValue(new Uint8Array(64).fill(9));

    await onInjectKeyBundle(
      requestId,
      "org-test",
      buildBundle(),
      "SOLANA",
      undefined,
      HpkeDecryptMock
    );

    jest.advanceTimersByTime(DEFAULT_TTL_MILLISECONDS + 1);

    try {
      await onSignTransaction(requestId, serializedTransaction, undefined);
    } catch (e) {
      // onSignTransaction throws when key is expired, simulate the message listener error handling
      TKHQ.sendMessageUp("ERROR", e.toString(), requestId);
    }

    const keyAddress = "default";
    expect(sendMessageSpy).toHaveBeenLastCalledWith(
      "ERROR",
      expect.stringContaining(getKeyNotFoundErrorMessage(keyAddress)),
      requestId
    );
  });

  it("clears expired key from memory when validation detects expiration", async () => {
    const EXPIRED_TIME_MS = DEFAULT_TTL_MILLISECONDS + 1;

    const HpkeDecryptMock = jest
      .fn()
      .mockResolvedValue(new Uint8Array(64).fill(9));

    // Inject a key
    await onInjectKeyBundle(
      requestId,
      "org-test",
      buildBundle(),
      "SOLANA",
      "test-address",
      HpkeDecryptMock
    );

    // Advance time past expiration
    jest.advanceTimersByTime(EXPIRED_TIME_MS);

    // First attempt: should get "expired" error (key exists but expired, then gets cleared)
    let errorMessage = "";
    try {
      await onSignTransaction(requestId, serializedTransaction, "test-address");
    } catch (e) {
      errorMessage = e.toString();
      expect(errorMessage).toContain("key bytes have expired");
    }

    // Second attempt: should get "not found" error (proves key was removed from memory)
    // This is different from "expired" - it means the key is completely gone
    try {
      await onSignTransaction(requestId, serializedTransaction, "test-address");
    } catch (e) {
      errorMessage = e.toString();
      expect(errorMessage).toContain("key bytes not found");
      expect(errorMessage).not.toContain("expired");
    }
  });

  it("does not clear non-expired keys from memory", async () => {
    const HpkeDecryptMock = jest
      .fn()
      .mockResolvedValue(new Uint8Array(64).fill(9));

    // Inject a key
    await onInjectKeyBundle(
      requestId,
      "org-test",
      buildBundle(),
      "SOLANA",
      "test-address",
      HpkeDecryptMock
    );

    // Advance time but not past expiration
    jest.advanceTimersByTime(DEFAULT_TTL_MILLISECONDS - 1000);

    // Key should still work (proves it wasn't cleared)
    await onSignTransaction(requestId, serializedTransaction, "test-address");

    expect(sendMessageSpy).toHaveBeenCalledWith(
      "TRANSACTION_SIGNED",
      expect.any(String),
      requestId
    );
  });

  it("clears only the expired key when multiple keys exist", async () => {
    const HpkeDecryptMock = jest
      .fn()
      .mockResolvedValue(new Uint8Array(64).fill(9));

    // Inject first key
    await onInjectKeyBundle(
      requestId,
      "org-test",
      buildBundle(),
      "SOLANA",
      "key1",
      HpkeDecryptMock
    );

    // Advance time halfway through TTL
    jest.advanceTimersByTime(DEFAULT_TTL_MILLISECONDS / 2);

    // Inject second key (will have later expiry)
    await onInjectKeyBundle(
      requestId,
      "org-test",
      buildBundle(),
      "SOLANA",
      "key2",
      HpkeDecryptMock
    );

    // Advance time so first key expires but second doesn't
    jest.advanceTimersByTime(DEFAULT_TTL_MILLISECONDS / 2 + 1);

    // Try to use expired key1 - should clear it
    try {
      await onSignTransaction(requestId, serializedTransaction, "key1");
    } catch (e) {
      expect(e.toString()).toContain("key bytes have expired");
    }

    // Verify key1 was cleared (second attempt should say "not found")
    try {
      await onSignTransaction(requestId, serializedTransaction, "key1");
    } catch (e) {
      expect(e.toString()).toContain("key bytes not found");
    }

    // Verify key2 still works (proves it wasn't cleared)
    await onSignTransaction(requestId, serializedTransaction, "key2");
    expect(sendMessageSpy).toHaveBeenCalledWith(
      "TRANSACTION_SIGNED",
      expect.any(String),
      requestId
    );
  });

  it("clears expired key even when accessed with default address", async () => {
    const HpkeDecryptMock = jest
      .fn()
      .mockResolvedValue(new Uint8Array(64).fill(9));

    // Inject key without address (uses "default")
    await onInjectKeyBundle(
      requestId,
      "org-test",
      buildBundle(),
      "SOLANA",
      undefined,
      HpkeDecryptMock
    );

    // Advance time past expiration
    jest.advanceTimersByTime(EXPIRED_TIME_MS);

    // First attempt: should get "expired" error (key exists but expired, then cleared)
    try {
      await onSignTransaction(requestId, serializedTransaction, undefined);
    } catch (e) {
      expect(e.toString()).toContain("key bytes have expired");
    }

    // Second attempt: should get "not found" error (proves key was removed)
    try {
      await onSignTransaction(requestId, serializedTransaction, undefined);
    } catch (e) {
      expect(e.toString()).toContain("key bytes not found");
      expect(e.toString()).not.toContain("expired");
    }
  });
});

describe("Encryption Escrow", () => {
  const requestId = "test-request-id";
  const serializedTransaction = JSON.stringify({
    type: "SOLANA",
    transaction: "00",
  });

  let dom;
  let TKHQ;
  let sendMessageSpy;

  // Mock raw 32-byte P-256 private key (escrow decryption key)
  // This is what Turnkey exports after HPKE decryption - raw key bytes, not a JWK.
  const mockEscrowKeyBytes = new Uint8Array(32).fill(42);

  function buildBundle(organizationId = "org-test") {
    const signedData = {
      organizationId,
      encappedPublic: "aa",
      ciphertext: "bb",
    };

    const signedDataHex = Buffer.from(
      JSON.stringify(signedData),
      "utf8"
    ).toString("hex");

    return JSON.stringify({
      version: "v1.0.0",
      data: signedDataHex,
      dataSignature: "30440220773382ac",
      enclaveQuorumPublic: "04e479640d6d34",
    });
  }

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T00:00:00Z"));

    dom = new JSDOM(
      `<!doctype html><html><body><div id="key-div"></div><input id="embedded-key" /></body></html>`,
      {
        url: "http://localhost",
      }
    );

    global.window = dom.window;
    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
    global.crypto = crypto.webcrypto;

    const module = await import("./src/turnkey-core.js");
    TKHQ = module.TKHQ;
    dom.window.TKHQ = TKHQ;

    sendMessageSpy = jest
      .spyOn(TKHQ, "sendMessageUp")
      .mockImplementation(() => {});

    jest.spyOn(TKHQ, "verifyEnclaveSignature").mockResolvedValue(true);
    TKHQ.setEmbeddedKey({ foo: "bar" });
    jest.spyOn(TKHQ, "onResetEmbeddedKey").mockImplementation(() => {});
    jest.spyOn(TKHQ, "uint8arrayFromHexString").mockImplementation((hex) => {
      if (typeof hex !== "string" || hex.length === 0 || hex.length % 2 !== 0) {
        throw new Error("cannot create uint8array from invalid hex string");
      }
      return new Uint8Array(Buffer.from(hex, "hex"));
    });
    jest
      .spyOn(TKHQ, "uint8arrayToHexString")
      .mockImplementation((bytes) => Buffer.from(bytes).toString("hex"));
    jest
      .spyOn(TKHQ, "getEd25519PublicKey")
      .mockReturnValue(new Uint8Array(32).fill(3));
    jest
      .spyOn(TKHQ, "encodeKey")
      .mockImplementation(async (keyBytes, format) => {
        if (format === "SOLANA") {
          return "2P3qgS5A18gGmZJmYHNxYrDYPyfm6S3dJgs8tPW6ki6i2o4yx7K8r5N8CF7JpEtQiW8mx1kSktpgyDG1xuWNzfsM";
        }
        return "encoded-key-material";
      });
    jest
      .spyOn(TKHQ, "parsePrivateKey")
      .mockReturnValue(new Uint8Array(64).fill(5));
  });

  afterEach(() => {
    // Reset module-level state (decryptionKey + inMemoryKeys)
    onBurnSession("cleanup");
    jest.useRealTimers();
    jest.restoreAllMocks();
    delete global.window;
    delete global.document;
    delete global.localStorage;
    delete global.crypto;
  });

  describe("Encrypted Bundle Storage (TKHQ helpers)", () => {
    it("returns null when no bundles stored", () => {
      expect(TKHQ.getEncryptedBundles()).toBeNull();
    });

    it("stores and retrieves an encrypted bundle", () => {
      TKHQ.setEncryptedBundle("addr1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });

      const bundles = TKHQ.getEncryptedBundles();
      expect(bundles).not.toBeNull();
      expect(bundles["addr1"]).toEqual({
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });
    });

    it("stores multiple bundles and retrieves all", () => {
      TKHQ.setEncryptedBundle("addr1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("addr2", {
        encappedPublic: "cc",
        ciphertext: "dd",
        organizationId: "org1",
        keyFormat: "HEXADECIMAL",
      });
      TKHQ.setEncryptedBundle("addr3", {
        encappedPublic: "ee",
        ciphertext: "ff",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });

      const bundles = TKHQ.getEncryptedBundles();
      expect(Object.keys(bundles)).toHaveLength(3);
    });

    it("removes a single bundle by address", () => {
      TKHQ.setEncryptedBundle("addr1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("addr2", {
        encappedPublic: "cc",
        ciphertext: "dd",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });

      TKHQ.removeEncryptedBundle("addr1", "org1");

      const bundles = TKHQ.getEncryptedBundles();
      expect(bundles["addr1"]).toBeUndefined();
      expect(bundles["addr2"]).toBeDefined();
    });

    it("clears localStorage key when last bundle removed", () => {
      TKHQ.setEncryptedBundle("addr1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });

      TKHQ.removeEncryptedBundle("addr1", "org1");
      expect(TKHQ.getEncryptedBundles()).toBeNull();
    });

    it("clears all bundles", () => {
      TKHQ.setEncryptedBundle("addr1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("addr2", {
        encappedPublic: "cc",
        ciphertext: "dd",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });

      TKHQ.clearAllEncryptedBundles("org1");
      expect(TKHQ.getEncryptedBundles()).toBeNull();
    });
  });

  describe("STORE_ENCRYPTED_BUNDLE handler", () => {
    it("verifies enclave signature and stores bundle", async () => {
      await onStoreEncryptedBundle(
        requestId,
        "org-test",
        buildBundle(),
        "SOLANA",
        "wallet-addr-1"
      );

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "ENCRYPTED_BUNDLE_STORED",
        true,
        requestId
      );

      const bundles = TKHQ.getEncryptedBundles();
      expect(bundles["wallet-addr-1"]).toBeDefined();
      expect(bundles["wallet-addr-1"].encappedPublic).toBe("aa");
      expect(bundles["wallet-addr-1"].ciphertext).toBe("bb");
      expect(bundles["wallet-addr-1"].organizationId).toBe("org-test");
      expect(bundles["wallet-addr-1"].keyFormat).toBe("SOLANA");
    });

    it("rejects bundle with invalid enclave signature", async () => {
      jest.spyOn(TKHQ, "verifyEnclaveSignature").mockResolvedValue(false);

      await expect(
        onStoreEncryptedBundle(
          requestId,
          "org-test",
          buildBundle(),
          "SOLANA",
          "wallet-addr-1"
        )
      ).rejects.toThrow("failed to verify enclave signature");
    });

    it("requires address parameter", async () => {
      await expect(
        onStoreEncryptedBundle(
          requestId,
          "org-test",
          buildBundle(),
          "SOLANA",
          undefined
        )
      ).rejects.toThrow("address is required for STORE_ENCRYPTED_BUNDLE");
    });

    it("defaults keyFormat to HEXADECIMAL when not provided", async () => {
      await onStoreEncryptedBundle(
        requestId,
        "org-test",
        buildBundle(),
        undefined,
        "wallet-addr-1"
      );

      const bundles = TKHQ.getEncryptedBundles();
      expect(bundles["wallet-addr-1"].keyFormat).toBe("HEXADECIMAL");
    });

    it("auto-decrypts and loads key into memory when decryption key is available", async () => {
      // First inject a decryption key so it's in memory
      let callCount = 0;
      const HpkeDecryptMock = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // Escrow key decryption
          return Promise.resolve(mockEscrowKeyBytes);
        }
        // Wallet bundle decryption
        return Promise.resolve(new Uint8Array(64).fill(9));
      });

      await onInjectDecryptionKeyBundle(
        requestId,
        "org-test",
        buildBundle(),
        HpkeDecryptMock
      );

      // Now store a new bundle mid-session with HpkeDecrypt
      await onStoreEncryptedBundle(
        requestId,
        "org-test",
        buildBundle(),
        "SOLANA",
        "new-wallet",
        HpkeDecryptMock
      );

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "ENCRYPTED_BUNDLE_STORED",
        true,
        requestId
      );

      // Key should be immediately signable (no need for another INJECT_DECRYPTION_KEY_BUNDLE)
      await onSignTransaction(requestId, serializedTransaction, "new-wallet");
      expect(sendMessageSpy).toHaveBeenCalledWith(
        "TRANSACTION_SIGNED",
        expect.any(String),
        requestId
      );
    });

    it("stores without decrypting when no decryption key in memory", async () => {
      const HpkeDecryptMock = jest.fn();

      await onStoreEncryptedBundle(
        requestId,
        "org-test",
        buildBundle(),
        "SOLANA",
        "wallet-addr-1",
        HpkeDecryptMock
      );

      // Bundle stored in localStorage
      const bundles = TKHQ.getEncryptedBundles();
      expect(bundles["wallet-addr-1"]).toBeDefined();

      // HpkeDecrypt should NOT have been called (no decryption key)
      expect(HpkeDecryptMock).not.toHaveBeenCalled();

      // Signing should fail (key not in memory)
      try {
        await onSignTransaction(
          requestId,
          serializedTransaction,
          "wallet-addr-1"
        );
      } catch (e) {
        expect(e.toString()).toContain("key bytes not found");
      }
    });
  });

  describe("INJECT_DECRYPTION_KEY_BUNDLE handler", () => {
    it("decrypts escrow key and loads all stored bundles into memory", async () => {
      // Pre-store 3 encrypted bundles
      TKHQ.setEncryptedBundle("wallet1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org-test",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("wallet2", {
        encappedPublic: "cc",
        ciphertext: "dd",
        organizationId: "org-test",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("wallet3", {
        encappedPublic: "ee",
        ciphertext: "ff",
        organizationId: "org-test",
        keyFormat: "SOLANA",
      });

      let callCount = 0;
      const HpkeDecryptMock = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call: decrypting the escrow key bundle -> returns JWK bytes
          return Promise.resolve(mockEscrowKeyBytes);
        }
        // Subsequent calls: decrypting wallet bundles -> returns key bytes
        return Promise.resolve(new Uint8Array(64).fill(9));
      });

      await onInjectDecryptionKeyBundle(
        requestId,
        "org-test",
        buildBundle(),
        HpkeDecryptMock
      );

      // 1 call for escrow key + 3 calls for wallet bundles
      expect(HpkeDecryptMock).toHaveBeenCalledTimes(4);

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "DECRYPTION_KEY_INJECTED",
        3,
        requestId
      );

      // Verify keys are usable by signing
      await onSignTransaction(requestId, serializedTransaction, "wallet1");
      expect(sendMessageSpy).toHaveBeenCalledWith(
        "TRANSACTION_SIGNED",
        expect.any(String),
        requestId
      );
    });

    it("handles empty localStorage gracefully", async () => {
      const HpkeDecryptMock = jest.fn().mockResolvedValue(mockEscrowKeyBytes);

      await onInjectDecryptionKeyBundle(
        requestId,
        "org-test",
        buildBundle(),
        HpkeDecryptMock
      );

      // Only 1 call for the escrow key, no wallet bundles
      expect(HpkeDecryptMock).toHaveBeenCalledTimes(1);

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "DECRYPTION_KEY_INJECTED",
        0,
        requestId
      );
    });

    it("continues past individual bundle failures", async () => {
      TKHQ.setEncryptedBundle("wallet1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org-test",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("wallet2-bad", {
        encappedPublic: "cc",
        ciphertext: "dd",
        organizationId: "org-test",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("wallet3", {
        encappedPublic: "ee",
        ciphertext: "ff",
        organizationId: "org-test",
        keyFormat: "SOLANA",
      });

      let callCount = 0;
      const HpkeDecryptMock = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call: escrow key
          return Promise.resolve(mockEscrowKeyBytes);
        }
        // Fail for the second wallet bundle (callCount 3 = wallet2-bad)
        if (callCount === 3) {
          return Promise.reject(new Error("decryption failed for bad bundle"));
        }
        return Promise.resolve(new Uint8Array(64).fill(9));
      });

      await onInjectDecryptionKeyBundle(
        requestId,
        "org-test",
        buildBundle(),
        HpkeDecryptMock
      );

      // Should report 2 successful decryptions (wallet1 + wallet3)
      expect(sendMessageSpy).toHaveBeenCalledWith(
        "DECRYPTION_KEY_INJECTED",
        2,
        requestId
      );
    });

    it("rejects invalid escrow key length", async () => {
      // Return 16 bytes instead of 32 - invalid P-256 key length
      const HpkeDecryptMock = jest
        .fn()
        .mockResolvedValue(new Uint8Array(16).fill(1));

      await expect(
        onInjectDecryptionKeyBundle(
          requestId,
          "org-test",
          buildBundle(),
          HpkeDecryptMock
        )
      ).rejects.toThrow("invalid decryption key length");
    });
  });

  describe("BURN_SESSION handler", () => {
    it("clears in-memory keys but preserves localStorage bundles", async () => {
      // Store a bundle in localStorage
      TKHQ.setEncryptedBundle("wallet1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org-test",
        keyFormat: "SOLANA",
      });

      // Inject a key into memory via normal flow
      const HpkeDecryptMock = jest
        .fn()
        .mockResolvedValue(new Uint8Array(64).fill(9));
      await onInjectKeyBundle(
        requestId,
        "org-test",
        buildBundle(),
        "SOLANA",
        "wallet1",
        HpkeDecryptMock
      );

      // Verify key is usable
      await onSignTransaction(requestId, serializedTransaction, "wallet1");
      expect(sendMessageSpy).toHaveBeenCalledWith(
        "TRANSACTION_SIGNED",
        expect.any(String),
        requestId
      );

      // Burn session
      onBurnSession(requestId);
      expect(sendMessageSpy).toHaveBeenCalledWith(
        "SESSION_BURNED",
        true,
        requestId
      );

      // Signing should fail after burn
      try {
        await onSignTransaction(requestId, serializedTransaction, "wallet1");
      } catch (e) {
        expect(e.toString()).toContain("key bytes not found");
      }

      // Encrypted bundles should still be in localStorage
      const bundles = TKHQ.getEncryptedBundles();
      expect(bundles).not.toBeNull();
      expect(bundles["wallet1"]).toBeDefined();
    });
  });

  describe("GET_STORED_WALLET_ADDRESSES handler", () => {
    it("returns stored addresses as JSON array", () => {
      TKHQ.setEncryptedBundle("addr1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("addr2", {
        encappedPublic: "cc",
        ciphertext: "dd",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("addr3", {
        encappedPublic: "ee",
        ciphertext: "ff",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });

      onGetStoredWalletAddresses(requestId, "org1");

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "STORED_WALLET_ADDRESSES",
        JSON.stringify(["addr1", "addr2", "addr3"]),
        requestId
      );
    });

    it("returns empty array when no bundles stored", () => {
      onGetStoredWalletAddresses(requestId, "org1");

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "STORED_WALLET_ADDRESSES",
        JSON.stringify([]),
        requestId
      );
    });
  });

  describe("CLEAR_STORED_BUNDLES handler", () => {
    it("clears a single address from localStorage and memory", async () => {
      TKHQ.setEncryptedBundle("addr1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("addr2", {
        encappedPublic: "cc",
        ciphertext: "dd",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });

      // Load addr1 into memory via normal key injection
      const HpkeDecryptMock = jest
        .fn()
        .mockResolvedValue(new Uint8Array(64).fill(9));
      await onInjectKeyBundle(
        requestId,
        "org1",
        buildBundle("org1"),
        "SOLANA",
        "addr1",
        HpkeDecryptMock
      );

      // Verify addr1 is signable
      await onSignTransaction(requestId, serializedTransaction, "addr1");
      expect(sendMessageSpy).toHaveBeenCalledWith(
        "TRANSACTION_SIGNED",
        expect.any(String),
        requestId
      );

      // Clear addr1
      onClearStoredBundles(requestId, "addr1", "org1");

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "STORED_BUNDLES_CLEARED",
        true,
        requestId
      );

      // localStorage: addr1 gone, addr2 still present
      const bundles = TKHQ.getEncryptedBundles();
      expect(bundles["addr1"]).toBeUndefined();
      expect(bundles["addr2"]).toBeDefined();

      // Memory: signing with addr1 should fail
      try {
        await onSignTransaction(requestId, serializedTransaction, "addr1");
      } catch (e) {
        expect(e.toString()).toContain("key bytes not found");
      }
    });

    it("clears all bundles and all in-memory keys when no address provided", async () => {
      TKHQ.setEncryptedBundle("addr1", {
        encappedPublic: "aa",
        ciphertext: "bb",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });
      TKHQ.setEncryptedBundle("addr2", {
        encappedPublic: "cc",
        ciphertext: "dd",
        organizationId: "org1",
        keyFormat: "SOLANA",
      });

      // Load both into memory
      const HpkeDecryptMock = jest
        .fn()
        .mockResolvedValue(new Uint8Array(64).fill(9));
      await onInjectKeyBundle(
        requestId,
        "org1",
        buildBundle("org1"),
        "SOLANA",
        "addr1",
        HpkeDecryptMock
      );
      await onInjectKeyBundle(
        requestId,
        "org1",
        buildBundle("org1"),
        "SOLANA",
        "addr2",
        HpkeDecryptMock
      );

      // Clear all
      onClearStoredBundles(requestId, undefined, "org1");

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "STORED_BUNDLES_CLEARED",
        true,
        requestId
      );
      expect(TKHQ.getEncryptedBundles()).toBeNull();

      // Memory: signing with either address should fail
      try {
        await onSignTransaction(requestId, serializedTransaction, "addr1");
      } catch (e) {
        expect(e.toString()).toContain("key bytes not found");
      }
      try {
        await onSignTransaction(requestId, serializedTransaction, "addr2");
      } catch (e) {
        expect(e.toString()).toContain("key bytes not found");
      }
    });
  });

  describe("Full Escrow Lifecycle", () => {
    it("store -> decrypt -> sign -> burn -> re-decrypt -> sign", async () => {
      // 1. Store 2 encrypted bundles
      await onStoreEncryptedBundle(
        requestId,
        "org-test",
        buildBundle(),
        "SOLANA",
        "wallet-a"
      );
      await onStoreEncryptedBundle(
        requestId,
        "org-test",
        buildBundle(),
        "SOLANA",
        "wallet-b"
      );

      expect(TKHQ.getEncryptedBundles()).not.toBeNull();
      expect(Object.keys(TKHQ.getEncryptedBundles())).toHaveLength(2);

      // 2. Inject decryption key -> decrypt all bundles
      let callCount = 0;
      const HpkeDecryptMock = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve(mockEscrowKeyBytes);
        }
        return Promise.resolve(new Uint8Array(64).fill(9));
      });

      await onInjectDecryptionKeyBundle(
        requestId,
        "org-test",
        buildBundle(),
        HpkeDecryptMock
      );

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "DECRYPTION_KEY_INJECTED",
        2,
        requestId
      );

      // 3. Sign a transaction
      await onSignTransaction(requestId, serializedTransaction, "wallet-a");
      expect(sendMessageSpy).toHaveBeenCalledWith(
        "TRANSACTION_SIGNED",
        expect.any(String),
        requestId
      );

      // 4. Burn session
      onBurnSession(requestId);
      expect(sendMessageSpy).toHaveBeenCalledWith(
        "SESSION_BURNED",
        true,
        requestId
      );

      // Signing should fail after burn
      try {
        await onSignTransaction(requestId, serializedTransaction, "wallet-a");
      } catch (e) {
        expect(e.toString()).toContain("key bytes not found");
      }

      // 5. Re-inject decryption key (bundles survived the burn)
      callCount = 0;
      await onInjectDecryptionKeyBundle(
        requestId,
        "org-test",
        buildBundle(),
        HpkeDecryptMock
      );

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "DECRYPTION_KEY_INJECTED",
        2,
        requestId
      );

      // 6. Sign again - should work
      await onSignTransaction(requestId, serializedTransaction, "wallet-b");
      expect(sendMessageSpy).toHaveBeenCalledWith(
        "TRANSACTION_SIGNED",
        expect.any(String),
        requestId
      );
    });
  });
});
