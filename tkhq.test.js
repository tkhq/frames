import "@testing-library/jest-dom"
import { JSDOM } from "jsdom"
import fs from "fs"
import path from "path"
import * as crypto from "crypto";
import TKHQ from './tkhq.js';

describe("TKHQ", () => {
  

  // it("gets and sets items with expiry localStorage", async () => {
  //   // Set a TTL of 1000ms
  //   TKHQ.setItemWithExpiry("k", "v", 1000);
  //   let item = JSON.parse(dom.window.localStorage.getItem("k"));
  //   expect(item.value).toBe("v");
  //   expect(item.expiry).toBeTruthy();

  //   // Get item that has not expired yet
  //   item = TKHQ.getItemWithExpiry("k");
  //   expect(item).toBe("v");

  //   // Set a TTL of 500ms
  //   TKHQ.setItemWithExpiry("a", "b", 500);
  //   setTimeout(() => {
  //     const expiredItem = TKHQ.getItemWithExpiry("a");
  //     expect(expiredItem).toBeNull();
  //   }, 600); // Wait for 600ms to ensure the item has expired

  //   // Returns null if getItemWithExpiry is called for item without expiry
  //   dom.window.localStorage.setItem("k", JSON.stringify({ value: "v" }));
  //   item = TKHQ.getItemWithExpiry("k");
  //   expect(item).toBeNull();
  // })

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

  // it("parses private key correctly", async () => {
  //   const keyHex = "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
  //   const parsedKey = TKHQ.parseKey(TKHQ.uint8arrayFromHexString(keyHex.slice(2)));
  //   expect(parsedKey).toEqual(keyHex);
  // })

  // it("parses wallet with only mnemonic correctly", async () => {
  //   const mnemonic = "suffer surround soup duck goose patrol add unveil appear eye neglect hurry alpha project tomorrow embody hen wish twenty join notable amused burden treat";
  //   const encoder = new TextEncoder("utf-8");
  //   const encodedWallet = encoder.encode(mnemonic);
  //   const parsedWallet  = TKHQ.parseWallet(encodedWallet);
  //   expect(parsedWallet.mnemonic).toEqual(mnemonic);
  //   expect(parsedWallet.passphrase).toBeNull();
  // })

  // it("parses wallet mnemonic and passphrase correctly", async () => {
  //   const mnemonic = "suffer surround soup duck goose patrol add unveil appear eye neglect hurry alpha project tomorrow embody hen wish twenty join notable amused burden treat";
  //   const passphrase = "secret!";
  //   const encoder = new TextEncoder("utf-8");
  //   const encodedWallet = encoder.encode(mnemonic + "\n" + passphrase);
  //   const parsedWallet  = TKHQ.parseWallet(encodedWallet);
  //   expect(parsedWallet.mnemonic).toEqual(mnemonic);
  //   expect(parsedWallet.passphrase).toEqual(passphrase);
  // })

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
    expect(TKHQ.base64urlDecode("AQID").buffer).toEqual(new Uint8Array([1, 2, 3]).buffer);
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