import { getByText } from "@testing-library/dom"
import "@testing-library/jest-dom"
import { JSDOM } from "jsdom"
import fs from "fs"
import path from "path"
import * as crypto from "crypto";


const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let dom
let container
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
    container = dom.window.document.body
  })

  it("renders a Init Recovery heading", () => {
    expect(container.querySelector("h2")).not.toBeNull()
    expect(getByText(container, "Init Recovery")).toBeInTheDocument()
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

  it("imports recovery credentials", async () => {
    var pkcs8ByteBuffer =  TKHQ.bufferFromHexString("308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b02010104207632de7338577bc12c1731fa29f08019206af381f74af60f4d5e0395218f205ca144034200040af4c5e293412d76867af92a19fc90cd621fd0078c39eb14e9ed7bdf38752ec853f1439b9ae8ed4414de7f9c5431d917261ffee14cf06b3c34a0e8a59a845310");
    let key = await TKHQ.importRecoveryCredential(pkcs8ByteBuffer);
    expect(key.constructor.name).toEqual("CryptoKey");
    expect(key.algorithm).toEqual({ name: "ECDSA", namedCurve: "P-256"});
  })

  it("compresses raw P-256 public keys", async () => {
    let compressed = await TKHQ.compressRawPublicKey(Buffer.from("04c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4f510c344715f84cf0ba0cc71bd04136c0fb2633a3f459e68ffb8620be16900f0", "hex"));
    expect(compressed).toEqual(Buffer.from("02c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4", "hex").buffer);
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

  it("contains bufferToHexString", () => {
    expect(TKHQ.bufferToHexString(Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]))).toEqual("627566666572");
  })
  
  it("contains bufferFromHexString", () => {
    expect(TKHQ.bufferFromHexString("627566666572")).toEqual(new ArrayBuffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]));
  })


  it("logs messages and sends messages up", async () => {
    // TODO: test logMessage / sendMessageUp
    expect(true).toBe(true);
  })
})