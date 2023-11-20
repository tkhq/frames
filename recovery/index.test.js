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
    expect(key.key_ops).toContain("deriveBits");
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
    let compressed02 = TKHQ.compressRawPublicKey(TKHQ.uint8arrayFromHexString("04c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4f510c344715f84cf0ba0cc71bd04136c0fb2633a3f459e68ffb8620be16900f0"));
    expect(compressed02).toEqual(TKHQ.uint8arrayFromHexString("02c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4", "hex"));
    let compressed03 = TKHQ.compressRawPublicKey(TKHQ.uint8arrayFromHexString("04be3c8147b75405c94e24280a1759374688bf689549cc1c0afd8e8af20621d734dab002b3cced5db9d9cd343b7d2197c757f42dea13f6689b3553ab1c667a8c67"));
    expect(compressed03).toEqual(TKHQ.uint8arrayFromHexString("03be3c8147b75405c94e24280a1759374688bf689549cc1c0afd8e8af20621d734", "hex"));
  })

  it("uncompresses raw P-256 public keys", async () => {
    let uncompressedFrom02 = TKHQ.uncompressRawPublicKey(TKHQ.uint8arrayFromHexString("02c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4"));
    expect(uncompressedFrom02).toEqual(TKHQ.uint8arrayFromHexString("04c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4f510c344715f84cf0ba0cc71bd04136c0fb2633a3f459e68ffb8620be16900f0", "hex"));
    let uncompressedFrom03 = TKHQ.uncompressRawPublicKey(TKHQ.uint8arrayFromHexString("03be3c8147b75405c94e24280a1759374688bf689549cc1c0afd8e8af20621d734"));
    expect(uncompressedFrom03).toEqual(TKHQ.uint8arrayFromHexString("04be3c8147b75405c94e24280a1759374688bf689549cc1c0afd8e8af20621d734dab002b3cced5db9d9cd343b7d2197c757f42dea13f6689b3553ab1c667a8c67", "hex"));
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

  it("contains base64urlDecode", () => {
    expect(Array.from(TKHQ.base64urlDecode("AQID"))).toEqual([1, 2, 3]);
  })

  it("contains base58checkDecode", async () => {
    await expect(TKHQ.base58checkDecode("N0PE")).rejects.toThrow("cannot base58-decode a string of length < 5 (found length 4)");
    await expect(TKHQ.base58checkDecode("NOOOO")).rejects.toThrow("cannot base58-decode: O isn't a valid character");

    // Satoshi's Bitcoin address
    expect(Array.from(await TKHQ.base58checkDecode("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"))).toEqual(
      // Note: checksum is missing from this expected value since we chop the checksum as part of decoding.
      // Decoded value on http://lenschulwitz.com/base58 has C29B7D93 (4 bytes) at the end, that's expected and normal.
      Array.from(TKHQ.uint8arrayFromHexString("0062E907B15CBF27D5425399EBF6F0FB50EBB88F18"))
    );

    // Same input as above, except last digit changed.
    await expect(TKHQ.base58checkDecode("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb")).rejects.toThrow("checksums do not match: computed 194,155,125,147 but found 194,155,125,148");

    // Realistic recovery code: concatenation of a 33 bytes P-256 public key + a 80-bytes long encrypted credential
    // Test vector from our internal repo, which uses Rust to encode in base58check.
    expect(Array.from(await TKHQ.base58checkDecode("Mobo835D8oQBX4BWPSrtYFcVHFNGgsp1X14t1MM18QpZD3aJdZJ4MioQk6ChU2mZ6b7gM3RxyiV5ArnwK2TH8bTU19zNG29q4w9WbBEp8HWuJLYqBTCh3KJPbnCxVcvDdhHZQ5nmghUB7noTXLTXeu3nnHbnuEz"))).toEqual(
      Array.from(TKHQ.uint8arrayFromHexString("03d61d659ab8485f30cfe261ff965179519b2aeb16223ccc217e99b09d5aeb94f1ce9e701341d6ab5b330bf39a3488dfe37a7fc0d04b556de1f7c4beaf4f3c131c2fbb5e28e9c3056d621b66a9bb0dac7c11759767c3ff10ca0f686a06c4a30b6e57902fadc9a2a840cf1356592220fc80"))
    );
  })

  it("contains uint8arrayToHexString", () => {
    expect(TKHQ.uint8arrayToHexString(new Uint8Array([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]))).toEqual("627566666572");
  })
  
  it("contains uint8arrayFromHexString", () => {
    expect(TKHQ.uint8arrayFromHexString("627566666572").toString()).toEqual("98,117,102,102,101,114");
  })

  it("contains bigIntToHex", () => {
    expect(TKHQ.bigIntToHex(BigInt(1, 1))).toEqual("1");
    expect(TKHQ.bigIntToHex(BigInt(1), 2)).toEqual("01");
    expect(TKHQ.bigIntToHex(BigInt(1), 4)).toEqual("0001");
    expect(TKHQ.bigIntToHex(BigInt(23), 2)).toEqual("17");
    expect(TKHQ.bigIntToHex(BigInt(255), 2)).toEqual("ff");
    expect(() => { TKHQ.bigIntToHex(BigInt(256), 2) }).toThrow("number cannot fit in a hex string of 2 characters");
  })

  it("logs messages and sends messages up", async () => {
    // TODO: test logMessage / sendMessageUp
    expect(true).toBe(true);
  })
})
