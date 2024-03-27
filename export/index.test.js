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

  it("parses private key correctly", async () => {
    const keyHex = "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
    const parsedKey = TKHQ.parseKey(TKHQ.uint8arrayFromHexString(keyHex.slice(2)));
    expect(parsedKey).toEqual(keyHex);
  })

  it("parses wallet with only mnemonic correctly", async () => {
    const mnemonic = "suffer surround soup duck goose patrol add unveil appear eye neglect hurry alpha project tomorrow embody hen wish twenty join notable amused burden treat";
    const encoder = new TextEncoder("utf-8");
    const encodedWallet = encoder.encode(mnemonic);
    const parsedWallet  = TKHQ.parseWallet(encodedWallet);
    expect(parsedWallet.mnemonic).toEqual(mnemonic);
    expect(parsedWallet.passphrase).toBeNull();
  })

  it("parses wallet mnemonic and passphrase correctly", async () => {
    const mnemonic = "suffer surround soup duck goose patrol add unveil appear eye neglect hurry alpha project tomorrow embody hen wish twenty join notable amused burden treat";
    const passphrase = "secret!";
    const encoder = new TextEncoder("utf-8");
    const encodedWallet = encoder.encode(mnemonic + "\n" + passphrase);
    const parsedWallet  = TKHQ.parseWallet(encodedWallet);
    expect(parsedWallet.mnemonic).toEqual(mnemonic);
    expect(parsedWallet.passphrase).toEqual(passphrase);
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
})
