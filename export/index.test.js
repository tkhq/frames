import "@testing-library/jest-dom"
import { JSDOM } from "jsdom"
import fs from "fs"
import path from "path"
import * as crypto from "crypto";
import { rejects } from "assert";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let dom;
let TKHQ;

describe("TKHQ", () => {
  beforeEach(() => {
    dom = new JSDOM(html, {
      // Necessary to run script tags
      runScripts: "dangerously",
      // Necessary to have access to localStorage
      url: "http://localhost",
      // Necessary for TextDecoder to be available.
      // See https://github.com/jsdom/jsdom/issues/2524
      beforeParse(window) {
        window.TextDecoder = TextDecoder;
        window.TextEncoder = TextEncoder;
      }
    })

    // Necessary for crypto to be available.
    // See https://github.com/jsdom/jsdom/issues/1612
    Object.defineProperty(dom.window, 'crypto', {
      value: crypto.webcrypto,
    });

    TKHQ = dom.window.TKHQ
  })

  it("gets and sets items with expiry localStorage", async () => {
    // Set a TTL of 1000ms
    TKHQ.setItemWithExpiry("k", "v", 1000);
    let item = JSON.parse(dom.window.localStorage.getItem("k"));
    expect(item.value).toBe("v");
    expect(item.expiry).toBeTruthy();

    // Get item that has not expired yet
    item = TKHQ.getItemWithExpiry("k");
    expect(item).toBe("v");

    // Set a TTL of 500ms
    TKHQ.setItemWithExpiry("a", "b", 500);
    setTimeout(() => {
      const expiredItem = TKHQ.getItemWithExpiry("a");
      expect(expiredItem).toBeNull();
    }, 600); // Wait for 600ms to ensure the item has expired

    // Returns null if getItemWithExpiry is called for item without expiry
    dom.window.localStorage.setItem("k", JSON.stringify({ value: "v" }));
    item = TKHQ.getItemWithExpiry("k");
    expect(item).toBeNull();
  })

  it("gets and sets embedded key in localStorage", async () => {
    expect(TKHQ.getEmbeddedKey()).toBe(null);
    
    // Set a dummy "key"
    TKHQ.setEmbeddedKey({"foo": "bar"});
    expect(TKHQ.getEmbeddedKey()).toEqual({"foo": "bar"});
  })
  
  it("inits embedded key and is idempotent", async () => {
    expect(TKHQ.getEmbeddedKey()).toBe(null);
    await TKHQ.initEmbeddedKey();
    const generatedKey = TKHQ.getEmbeddedKey();
    expect(generatedKey).not.toBeNull()

    // This should have no effect; generated key should stay the same
    await TKHQ.initEmbeddedKey();
    expect(TKHQ.getEmbeddedKey()).toEqual(generatedKey);
  })

  it("generates P256 keys", async () => {
    let key = await TKHQ.generateTargetKey();
    expect(key.kty).toEqual("EC");
    expect(key.ext).toBe(true);
    expect(key.crv).toBe("P-256");
    expect(key.key_ops).toContain("deriveBits");
  })

  it("encodes hex-encoded private key correctly by default", async () => {
    const keyHex = "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
    const encodedKey = await TKHQ.encodeKey(TKHQ.uint8arrayFromHexString(keyHex.slice(2)));
    expect(encodedKey).toEqual(keyHex);
  })

  it("encodes hex-encoded private key correctly", async () => {
    const keyHex = "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
    const encodedKey = await TKHQ.encodeKey(TKHQ.uint8arrayFromHexString(keyHex.slice(2)), "HEXADECIMAL");
    expect(encodedKey).toEqual(keyHex);
  })

  it("encodes solana private key correctly", async () => {
    const keySol = "2P3qgS5A18gGmZJmYHNxYrDYPyfm6S3dJgs8tPW6ki6i2o4yx7K8r5N8CF7JpEtQiW8mx1kSktpgyDG1xuWNzfsM";
    const keySolBytes = TKHQ.base58Decode(keySol);
    expect(keySolBytes.length).toEqual(64);
    const keyPrivBytes = keySolBytes.subarray(0, 32);
    const keyPubBytes = keySolBytes.subarray(32, 64);
    const encodedKey = await TKHQ.encodeKey(keyPrivBytes, "SOLANA", keyPubBytes);
    expect(encodedKey).toEqual(keySol);
  })

  it("encodes wallet with only mnemonic correctly", async () => {
    const mnemonic = "suffer surround soup duck goose patrol add unveil appear eye neglect hurry alpha project tomorrow embody hen wish twenty join notable amused burden treat";
    const encodedWallet  = TKHQ.encodeWallet(new TextEncoder("utf-8").encode(mnemonic));
    expect(encodedWallet.mnemonic).toEqual(mnemonic);
    expect(encodedWallet.passphrase).toBeNull();
  })

  it("encodes wallet mnemonic and passphrase correctly", async () => {
    const mnemonic = "suffer surround soup duck goose patrol add unveil appear eye neglect hurry alpha project tomorrow embody hen wish twenty join notable amused burden treat";
    const passphrase = "secret!";
    const encodedWallet  = TKHQ.encodeWallet(new TextEncoder("utf-8").encode(mnemonic + "\n" + passphrase));
    expect(encodedWallet.mnemonic).toEqual(mnemonic);
    expect(encodedWallet.passphrase).toEqual(passphrase);
  })

  it("contains p256JWKPrivateToPublic", async () => {
    // TODO: test this
    expect(true).toBe(true);
  })

  it("contains additionalAssociatedData", async () => {
    // This is a trivial helper; concatenates the 2 arrays!
    expect(TKHQ.additionalAssociatedData(new Uint8Array([1, 2]), new Uint8Array([3, 4])).buffer).toEqual(new Uint8Array([1, 2, 3, 4]).buffer);
  })

  it("contains uint8arrayToHexString", () => {
    expect(TKHQ.uint8arrayToHexString(new Uint8Array([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]))).toEqual("627566666572");
  })
  
  it("contains uint8arrayFromHexString", () => {
    expect(TKHQ.uint8arrayFromHexString("627566666572").toString()).toEqual("98,117,102,102,101,114");
    
    // Error case: bad value
    expect(() => {
      TKHQ.uint8arrayFromHexString({});
    }).toThrow('cannot create uint8array from invalid hex string: "[object Object]"');
    // Error case: empty string
    expect(() => {
      TKHQ.uint8arrayFromHexString("");
    }).toThrow('cannot create uint8array from invalid hex string: ""');
    // Error case: odd number of characters
    expect(() => {
      TKHQ.uint8arrayFromHexString("123");
    }).toThrow('cannot create uint8array from invalid hex string: "123"');
    // Error case: bad characters outside of hex range
    expect(() => {
      TKHQ.uint8arrayFromHexString("oops");
    }).toThrow('cannot create uint8array from invalid hex string: "oops"');
  })

  it("logs messages and sends messages up", async () => {
    // TODO: test logMessage / sendMessageUp
    expect(true).toBe(true);
  })

  it("verifies enclave signature", async () => {
    // No "enclaveQuorumPublic" field in the export bundle. Valid signature
    let verified = await TKHQ.verifyEnclaveSignature(null, "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5", "04e479640d6d3487bbf132f6258ee24073411b8325ea68bb28883e45b650d059f82c48db965b8f777b30ab9e7810826bfbe8ad1789f9f10bf76dcd36b2ee399bc5");
    expect(verified).toBe(true);

    // "enclaveQuorumPublic" field present in the export bundle. Valid signature
    verified = await TKHQ.verifyEnclaveSignature("04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569", "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5", "04e479640d6d3487bbf132f6258ee24073411b8325ea68bb28883e45b650d059f82c48db965b8f777b30ab9e7810826bfbe8ad1789f9f10bf76dcd36b2ee399bc5");
    expect(verified).toBe(true);

    // "enclaveQuorumPublic" field present in the export bundle but doesn't match what's pinned on export.turnkey.com
    await expect(
      TKHQ.verifyEnclaveSignature("04ca7c0d624c75de6f34af342e87a21e0d8c83efd1bd5b5da0c0177c147f744fba6f01f9f37356f9c617659aafa55f6e0af8d169a8f054d153ab3201901fb63ecb", "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5", "04e479640d6d3487bbf132f6258ee24073411b8325ea68bb28883e45b650d059f82c48db965b8f777b30ab9e7810826bfbe8ad1789f9f10bf76dcd36b2ee399bc5")
      ).rejects.toThrow("enclave quorum public keys from client and bundle do not match. Client: 04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569. Bundle: 04ca7c0d624c75de6f34af342e87a21e0d8c83efd1bd5b5da0c0177c147f744fba6f01f9f37356f9c617659aafa55f6e0af8d169a8f054d153ab3201901fb63ecb.");

    // Invalid signature
    verified = await TKHQ.verifyEnclaveSignature("04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569", "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5", "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4");
    expect(verified).toBe(false);

    // Invalid DER-encoding for signature
    await expect(
      TKHQ.verifyEnclaveSignature(null, "300220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5", "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4")
    ).rejects.toThrow("failed to convert DER-encoded signature: invalid tag for r");

    // Invalid hex-encoding for signature
    await expect(
      TKHQ.verifyEnclaveSignature(null, "", "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4")
    ).rejects.toThrow('cannot create uint8array from invalid hex string: ""');

    // Invalid hex-encoding for public key
    await expect(
      TKHQ.verifyEnclaveSignature(null, "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5", "")
    ).rejects.toThrow('cannot create uint8array from invalid hex string: ""');
  })
})
