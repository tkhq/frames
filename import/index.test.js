import "@testing-library/jest-dom"
import { JSDOM } from "jsdom"
import fs from "fs"
import path from "path"
import * as crypto from "crypto";

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

  it("gets and sets embedded target key in localStorage", async () => {
    expect(TKHQ.getTargetEmbeddedKey()).toBe(null);
    
    // Set a dummy "key"
    TKHQ.setTargetEmbeddedKey({"foo": "bar"});
    expect(TKHQ.getTargetEmbeddedKey()).toEqual({"foo": "bar"});
  })

  it("imports P256 keys", async () => {
    const targetPubHex = "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f";
    const targetPublicBuf = TKHQ.uint8arrayFromHexString(targetPubHex);
    const key = await TKHQ.importTargetKey(new Uint8Array(targetPublicBuf));
    expect(key.kty).toEqual("EC");
    expect(key.ext).toBe(true);
    expect(key.crv).toBe("P-256");
    expect(key.key_ops).toEqual([]);
  })

  it("decodes hex-encoded private key correctly by default", async () => {
    const keyHex = "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
    const keyBytes = TKHQ.uint8arrayFromHexString(keyHex.slice(2));
    const decodedKey = TKHQ.decodeKey(keyHex);
    expect(decodedKey.length).toEqual(keyBytes.length);
    for (let i = 0; i < decodedKey.length; i++) {
      expect(decodedKey[i]).toEqual(keyBytes[i]);
    }
  })

  it("decodes hex-encoded private key correctly", async () => {
    const keyHex = "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
    const keyBytes = TKHQ.uint8arrayFromHexString(keyHex.slice(2));
    const decodedKey = TKHQ.decodeKey(keyHex, "HEXADECIMAL");
    expect(decodedKey.length).toEqual(keyBytes.length);
    for (let i = 0; i < decodedKey.length; i++) {
      expect(decodedKey[i]).toEqual(keyBytes[i]);
    }
  })

  it("decodes solana private key correctly", async () => {
    const keySol = "2P3qgS5A18gGmZJmYHNxYrDYPyfm6S3dJgs8tPW6ki6i2o4yx7K8r5N8CF7JpEtQiW8mx1kSktpgyDG1xuWNzfsM";
    const keyBytes = TKHQ.base58Decode(keySol);
    expect(keyBytes.length).toEqual(64);
    const keyPrivBytes = keyBytes.subarray(0, 32);
    const decodedKey = TKHQ.decodeKey(keySol, "SOLANA");
    expect(decodedKey.length).toEqual(keyPrivBytes.length);
    for (let i = 0; i < decodedKey.length; i++) {
      expect(decodedKey[i]).toEqual(keyPrivBytes[i]);
    }
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
  })

  it("logs messages and sends messages up", async () => {
    // TODO: test logMessage / sendMessageUp
    expect(true).toBe(true);
  })
})
