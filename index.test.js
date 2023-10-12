import "@testing-library/jest-dom"
import { JSDOM } from "jsdom"
import fs from "fs"
import path from "path"
import * as crypto from "crypto";


const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let dom
let TKHQ

describe("TKHQ", () => {
  beforeEach(() => {
    dom = new JSDOM(html, {
        // Necessary to run script tags
        runScripts: "dangerously",
        // Necessary to have access to localStorage
        url: "http://localhost"
    })

    // Necessary for crypto to be available.
    // See https://github.com/jsdom/jsdom/issues/1612
    Object.defineProperty(dom.window, 'crypto', {
        value: crypto.webcrypto,
    });

    TKHQ = dom.window.TKHQ
  })

  it("gets, sets, and removes values in localStorage", async () => {
    expect(TKHQ.getEmbeddedKey()).toBe(null);
    
    // Set a dummy "key"
    TKHQ.setEmbeddedKey({"foo": "bar"});
    expect(TKHQ.getEmbeddedKey()).toEqual({"foo": "bar"});

    // Now clear and assert we're back to no embedded key
    TKHQ.clearEmbeddedKey();
    expect(TKHQ.getEmbeddedKey()).toBe(null);
  })
  
  it("inits embedded key and is idempotent", async () => {
    expect(TKHQ.getEmbeddedKey()).toBe(null);
    await TKHQ.initEmbeddedKey();
    var generatedKey = TKHQ.getEmbeddedKey();
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
  })

  it("imports recovery credentials without errors", async () => {
    let key = await TKHQ.importRecoveryCredential(TKHQ.uint8arrayFromHexString("7632de7338577bc12c1731fa29f08019206af381f74af60f4d5e0395218f205c"));
    expect(key.constructor.name).toEqual("CryptoKey");
    expect(key.algorithm).toEqual({ name: "ECDSA", namedCurve: "P-256"});
  })

  it("imports recovery credentials correctly", async () => {
    let key = await TKHQ.importRecoveryCredential(TKHQ.uint8arrayFromHexString("7632de7338577bc12c1731fa29f08019206af381f74af60f4d5e0395218f205c"));
    let jwkPrivateKey = await crypto.subtle.exportKey("jwk", key);
    let publicKey = await TKHQ.p256JWKPrivateToPublic(jwkPrivateKey);
    let compressedPublicKey = TKHQ.compressRawPublicKey(publicKey);
    expect(TKHQ.uint8arrayToHexString(compressedPublicKey)).toEqual("020af4c5e293412d76867af92a19fc90cd621fd0078c39eb14e9ed7bdf38752ec8");
  })

  it("compresses raw P-256 public keys", async () => {
    let compressed = await TKHQ.compressRawPublicKey(TKHQ.uint8arrayFromHexString("04c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4f510c344715f84cf0ba0cc71bd04136c0fb2633a3f459e68ffb8620be16900f0"));
    expect(compressed).toEqual(TKHQ.uint8arrayFromHexString("02c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4", "hex"));
  })

  it("contains p256JWKPrivateToPublic", async () => {
    // TODO: test this
    expect(true).toBe(true);
  })

  it("contains convertEcdsaIeee1363ToDer", async () => {
    // TODO: find good test vectors
    expect(true).toBe(true);
  })

  it("contains additionalAssociatedData", async () => {
    // This is a trivial helper; concatenates the 2 arrays!
    expect(TKHQ.additionalAssociatedData(new Uint8Array([1, 2]), new Uint8Array([3, 4])).buffer).toEqual(new Uint8Array([1, 2, 3, 4]).buffer);
  })

  it("stringToBase64urlString", () => {
    expect(TKHQ.stringToBase64urlString("hello from TKHQ!")).toEqual("aGVsbG8gZnJvbSBUS0hRIQ");
  })
  
  it("contains base64urlEncode", () => {
    expect(TKHQ.base64urlEncode(new Uint8Array([1, 2, 3]))).toEqual("AQID");
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