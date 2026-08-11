import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import * as crypto from "crypto";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

// Extract the body of the <script type="module"> block so we can evaluate it
// directly in JSDOM window contexts (JSDOM does not handle ES module imports).
// We strip the `import` statement and inject a stub for `hpke` instead.
const MODULE_SCRIPT_BODY = (() => {
  const match = html.match(
    /<script type="module">([\s\S]*?)<\/script>\s*<\/body>/
  );
  if (!match) {
    throw new Error("Could not extract module script from index.html");
  }
  // Remove the `import * as hpke from ...` line; we inject a stub below.
  return match[1].replace(/^\s*import\s+\*\s+as\s+hpke.*?;\s*\n/m, "");
})();

let dom;
let TKHQ;

describe("TKHQ", () => {
  beforeEach(() => {
    dom = new JSDOM(html, {
      // Necessary to run script tags
      runScripts: "dangerously",
      // Necessary to have access to localStorage
      url: "http://localhost",
    });

    // Necessary for crypto to be available.
    // See https://github.com/jsdom/jsdom/issues/1612
    Object.defineProperty(dom.window, "crypto", {
      value: crypto.webcrypto,
    });

    TKHQ = dom.window.TKHQ;
  });

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
  });

  it("gets and sets embedded key (after init)", async () => {
    // Must init with an origin before set/get
    await TKHQ.initEmbeddedKey("http://localhost");
    expect(TKHQ.getEmbeddedKey()).not.toBeNull();

    // Override with a dummy key
    TKHQ.setEmbeddedKey({ foo: "bar" });
    expect(TKHQ.getEmbeddedKey()).toEqual({ foo: "bar" });
  });

  it("returns null for getEmbeddedKey before init", async () => {
    expect(TKHQ.getEmbeddedKey()).toBe(null);
  });

  it("inits embedded key and is idempotent", async () => {
    expect(TKHQ.getEmbeddedKey()).toBe(null);
    await TKHQ.initEmbeddedKey("http://localhost");
    var generatedKey = TKHQ.getEmbeddedKey();
    expect(generatedKey).not.toBeNull();

    // This should have no effect; generated key should stay the same
    await TKHQ.initEmbeddedKey("http://localhost");
    expect(TKHQ.getEmbeddedKey()).toEqual(generatedKey);
  });

  it("inits ephemeral key and stores in memory only", async () => {
    expect(TKHQ.getEmbeddedKey()).toBe(null);
    await TKHQ.initEphemeralEmbeddedKey();
    var ephemeralKey = TKHQ.getEmbeddedKey();
    expect(ephemeralKey).not.toBeNull();

    // Should NOT be in localStorage
    var lsKeys = Object.keys(dom.window.localStorage);
    var hasPersistedKey = lsKeys.some((k) =>
      k.startsWith("TURNKEY_EMBEDDED_KEY_V2")
    );
    expect(hasPersistedKey).toBe(false);
  });

  it("persistent key is stored in origin-scoped localStorage key", async () => {
    await TKHQ.initEmbeddedKey("http://localhost");
    // Key should be stored under a V2 scoped name, not the legacy name
    expect(dom.window.localStorage.getItem("TURNKEY_EMBEDDED_KEY")).toBeNull();
    var lsKeys = Object.keys(dom.window.localStorage);
    var scopedKey = lsKeys.find((k) => k.startsWith("TURNKEY_EMBEDDED_KEY_V2"));
    expect(scopedKey).toBeTruthy();
    expect(scopedKey).toContain(encodeURIComponent("http://localhost"));
  });

  it("different parent origins produce different embedded keys", async () => {
    // Origin A
    await TKHQ.initEmbeddedKey("http://app-a.example.com");
    var keyA = TKHQ.getEmbeddedKey();
    expect(keyA).not.toBeNull();

    // Simulate a second document (fresh JSDOM) for origin B
    var dom2 = new JSDOM(html, {
      runScripts: "dangerously",
      url: "http://localhost",
    });
    Object.defineProperty(dom2.window, "crypto", {
      value: crypto.webcrypto,
    });
    var TKHQ2 = dom2.window.TKHQ;

    await TKHQ2.initEmbeddedKey("http://app-b.example.com");
    var keyB = TKHQ2.getEmbeddedKey();
    expect(keyB).not.toBeNull();

    // The keys should be different (different origins => different localStorage slots)
    expect(JSON.stringify(keyA)).not.toEqual(JSON.stringify(keyB));
  });

  it("refuses to bind to a second persistent origin", async () => {
    await TKHQ.initEmbeddedKey("http://first.example.com");
    await expect(
      TKHQ.initEmbeddedKey("http://second.example.com")
    ).rejects.toThrow("parent origin is already bound");
  });

  it("rejects invalid origin in initEmbeddedKey", async () => {
    await expect(TKHQ.initEmbeddedKey("null")).rejects.toThrow(
      "a non-opaque parent origin is required"
    );
    await expect(TKHQ.initEmbeddedKey("")).rejects.toThrow(
      "a non-opaque parent origin is required"
    );
    await expect(TKHQ.initEmbeddedKey()).rejects.toThrow(
      "a non-opaque parent origin is required"
    );
  });

  it("purges legacy TURNKEY_EMBEDDED_KEY on init", async () => {
    // Plant a legacy key
    dom.window.localStorage.setItem(
      "TURNKEY_EMBEDDED_KEY",
      JSON.stringify({ value: "old", expiry: Date.now() + 9999999 })
    );
    await TKHQ.initEmbeddedKey("http://localhost");
    expect(dom.window.localStorage.getItem("TURNKEY_EMBEDDED_KEY")).toBeNull();
  });

  it("getBoundOrigin returns null before init and origin after init", async () => {
    expect(TKHQ.getBoundOrigin()).toBeNull();
    await TKHQ.initEmbeddedKey("https://test.example.com");
    expect(TKHQ.getBoundOrigin()).toBe("https://test.example.com");
  });

  it("getBoundOrigin returns null for ephemeral key", async () => {
    await TKHQ.initEphemeralEmbeddedKey();
    expect(TKHQ.getBoundOrigin()).toBeNull();
  });

  it("generates P256 keys", async () => {
    let key = await TKHQ.generateTargetKey();
    expect(key.kty).toEqual("EC");
    expect(key.ext).toBe(true);
    expect(key.crv).toBe("P-256");
    expect(key.key_ops).toContain("deriveBits");
  });

  it("imports credentials (for recovery or auth) without errors", async () => {
    let key = await TKHQ.importCredential(
      TKHQ.uint8arrayFromHexString(
        "7632de7338577bc12c1731fa29f08019206af381f74af60f4d5e0395218f205c"
      )
    );
    expect(key.constructor.name).toEqual("CryptoKey");
    expect(key.algorithm).toEqual({ name: "ECDSA", namedCurve: "P-256" });
  });

  it("imports credentials (for recovery or auth) correctly", async () => {
    let key = await TKHQ.importCredential(
      TKHQ.uint8arrayFromHexString(
        "7632de7338577bc12c1731fa29f08019206af381f74af60f4d5e0395218f205c"
      )
    );
    let jwkPrivateKey = await crypto.subtle.exportKey("jwk", key);
    let publicKey = await TKHQ.p256JWKPrivateToPublic(jwkPrivateKey);
    let compressedPublicKey = TKHQ.compressRawPublicKey(publicKey);
    expect(TKHQ.uint8arrayToHexString(compressedPublicKey)).toEqual(
      "020af4c5e293412d76867af92a19fc90cd621fd0078c39eb14e9ed7bdf38752ec8"
    );
  });

  it("compresses raw P-256 public keys", async () => {
    let compressed02 = TKHQ.compressRawPublicKey(
      TKHQ.uint8arrayFromHexString(
        "04c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4f510c344715f84cf0ba0cc71bd04136c0fb2633a3f459e68ffb8620be16900f0"
      )
    );
    expect(compressed02).toEqual(
      TKHQ.uint8arrayFromHexString(
        "02c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4"
      )
    );
    let compressed03 = TKHQ.compressRawPublicKey(
      TKHQ.uint8arrayFromHexString(
        "04be3c8147b75405c94e24280a1759374688bf689549cc1c0afd8e8af20621d734dab002b3cced5db9d9cd343b7d2197c757f42dea13f6689b3553ab1c667a8c67"
      )
    );
    expect(compressed03).toEqual(
      TKHQ.uint8arrayFromHexString(
        "03be3c8147b75405c94e24280a1759374688bf689549cc1c0afd8e8af20621d734"
      )
    );
  });

  it("uncompresses raw P-256 public keys", async () => {
    let uncompressedFrom02 = TKHQ.uncompressRawPublicKey(
      TKHQ.uint8arrayFromHexString(
        "02c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4"
      )
    );
    expect(uncompressedFrom02).toEqual(
      TKHQ.uint8arrayFromHexString(
        "04c6de3e1d08270d39076651a2b14fd38031dae89892dc124d2f9557816e7e5da4f510c344715f84cf0ba0cc71bd04136c0fb2633a3f459e68ffb8620be16900f0"
      )
    );
    let uncompressedFrom03 = TKHQ.uncompressRawPublicKey(
      TKHQ.uint8arrayFromHexString(
        "03be3c8147b75405c94e24280a1759374688bf689549cc1c0afd8e8af20621d734"
      )
    );
    expect(uncompressedFrom03).toEqual(
      TKHQ.uint8arrayFromHexString(
        "04be3c8147b75405c94e24280a1759374688bf689549cc1c0afd8e8af20621d734dab002b3cced5db9d9cd343b7d2197c757f42dea13f6689b3553ab1c667a8c67"
      )
    );
  });

  it("contains p256JWKPrivateToPublic", async () => {
    // TODO: test this
    expect(true).toBe(true);
  });

  it("contains convertEcdsaIeee1363ToDer", async () => {
    // TODO: find good test vectors
    expect(true).toBe(true);
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

  it("stringToBase64urlString", () => {
    expect(TKHQ.stringToBase64urlString("hello from TKHQ!")).toEqual(
      "aGVsbG8gZnJvbSBUS0hRIQ"
    );
  });

  it("contains base64urlEncode", () => {
    expect(TKHQ.base64urlEncode(new Uint8Array([1, 2, 3]))).toEqual("AQID");
  });

  it("contains base64urlDecode", () => {
    expect(Array.from(TKHQ.base64urlDecode("AQID"))).toEqual([1, 2, 3]);
  });

  it("contains base58checkDecode", async () => {
    await expect(TKHQ.base58checkDecode("N0PE")).rejects.toThrow(
      "cannot base58-decode a string of length < 5 (found length 4)"
    );
    await expect(TKHQ.base58checkDecode("NOOOO")).rejects.toThrow(
      "cannot base58-decode: O isn't a valid character"
    );

    // Satoshi's Bitcoin address
    expect(
      Array.from(
        await TKHQ.base58checkDecode("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
      )
    ).toEqual(
      // Note: checksum is missing from this expected value since we chop the checksum as part of decoding.
      // Decoded value on http://lenschulwitz.com/base58 has C29B7D93 (4 bytes) at the end, that's expected and normal.
      Array.from(
        TKHQ.uint8arrayFromHexString(
          "0062E907B15CBF27D5425399EBF6F0FB50EBB88F18"
        )
      )
    );

    // Same input as above, except last digit changed.
    await expect(
      TKHQ.base58checkDecode("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb")
    ).rejects.toThrow(
      "checksums do not match: computed 194,155,125,147 but found 194,155,125,148"
    );

    // Realistic recovery code: concatenation of a 33 bytes P-256 public key + a 48-bytes long encrypted credential
    // Test vector from our internal repo, which uses Rust to encode in base58check.
    expect(
      Array.from(
        await TKHQ.base58checkDecode(
          "szrFBNGDkhXyVvRoqjjDT6xd7kRhDXHmtQH3NVkPuVVkeiPFjn6UkyjbiTzuxH9wKH4QdEJUaWxZLM1ZLzByUFN1TNjxVh5aoZENCnKYrSEdZBnRWcK"
        )
      )
    ).toEqual(
      Array.from(
        TKHQ.uint8arrayFromHexString(
          "02cb30f1f44d411383cc2a7bb7135d87e0fbf265d0e002b460c9d38d97b14cd0d26114254d213cd77887293644d942a62516a3f174f01ed1ccb57dea1f8ac88664759bb6febcd8b060e7a11d23c614dd66"
        )
      )
    );
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
    // Happy path: if length parameter is included, pad the resulting buffer
    expect(TKHQ.uint8arrayFromHexString("01", 2).toString()).toEqual("0,1");
    // Happy path: if length parameter is omitted, do not pad the resulting buffer
    expect(TKHQ.uint8arrayFromHexString("01").toString()).toEqual("1");
  });

  it("contains bigIntToHex", () => {
    expect(TKHQ.bigIntToHex(BigInt(1, 1))).toEqual("1");
    expect(TKHQ.bigIntToHex(BigInt(1), 2)).toEqual("01");
    expect(TKHQ.bigIntToHex(BigInt(1), 4)).toEqual("0001");
    expect(TKHQ.bigIntToHex(BigInt(23), 2)).toEqual("17");
    expect(TKHQ.bigIntToHex(BigInt(255), 2)).toEqual("ff");
    expect(() => {
      TKHQ.bigIntToHex(BigInt(256), 2);
    }).toThrow("number cannot fit in a hex string of 2 characters");
  });

  it("logs messages and sends messages up", async () => {
    // TODO: test logMessage / sendMessageUp
    expect(true).toBe(true);
  });
});

// ─── Helpers shared by the integration describe blocks below ─────────────────

/**
 * Build a new JSDOM with a simulated parent window so that the frame runs in
 * "embedded" mode (window.parent !== window).  The returned `teardown` must be
 * called in afterEach to restore globals.
 *
 * The <script type="module"> body is evaluated synchronously (JSDOM does not
 * handle ES-module imports) after injecting a stub for `hpke` so the listener
 * setup code runs without a real HPKE implementation.
 *
 * Spies are installed on window.TKHQ BEFORE the module script eval so that
 * any async callbacks that fire during or immediately after the eval (e.g. the
 * DOMContentLoaded PUBLIC_KEY_READY broadcast) go through the mocks and are
 * included in the assertion counts.  Callers can replace mock implementations
 * per-test after receiving the dom.
 */
function buildEmbeddedDom() {
  const d = new JSDOM(html, {
    runScripts: "dangerously",
    url: "http://localhost",
  });

  const parentWindow = { postMessage: jest.fn() };
  Object.defineProperty(d.window, "parent", {
    configurable: true,
    value: parentWindow,
  });
  Object.defineProperty(d.window, "crypto", { value: crypto.webcrypto });

  // Provide globals that the module script body references.
  global.window = d.window;
  global.document = d.window.document;
  global.localStorage = d.window.localStorage;
  global.crypto = crypto.webcrypto;
  global.AbortController = d.window.AbortController;

  // Install spies on TKHQ BEFORE eval so the DOMContentLoaded async callback
  // (which calls initEphemeralEmbeddedKey then sendMessageUp) goes through the
  // mocks.  This prevents spurious sendMessageUp counts in tests.
  jest.spyOn(d.window.TKHQ, "initEmbeddedKey").mockResolvedValue(undefined);
  jest
    .spyOn(d.window.TKHQ, "initEphemeralEmbeddedKey")
    .mockResolvedValue(undefined);
  jest
    .spyOn(d.window.TKHQ, "getEmbeddedKey")
    .mockReturnValue({ kty: "EC", crv: "P-256" });
  jest
    .spyOn(d.window.TKHQ, "p256JWKPrivateToPublic")
    .mockResolvedValue(new Uint8Array(65).fill(0x04));
  jest
    .spyOn(d.window.TKHQ, "uint8arrayToHexString")
    .mockReturnValue("aabbccdd");
  jest
    .spyOn(d.window.TKHQ, "setParentFrameMessageChannelPort")
    .mockImplementation(() => {});
  jest.spyOn(d.window.TKHQ, "sendMessageUp").mockImplementation(() => {});

  // Inject a minimal hpke stub so the module body can be eval'd without the
  // real vendor bundle.
  d.window.hpke = {
    DhkemP256HkdfSha256: function () {
      return { importKey: jest.fn() };
    },
    HkdfSha256: function () {},
    Aes256Gcm: function () {},
    CipherSuite: function () {
      return { createRecipientContext: jest.fn() };
    },
  };

  // Run the module script body in the JSDOM window context.
  d.window.eval(MODULE_SCRIPT_BODY);

  function teardown() {
    delete global.window;
    delete global.document;
    delete global.localStorage;
    delete global.crypto;
    delete global.AbortController;
  }

  return { dom: d, parentWindow, teardown };
}

/** Flush the microtask / macrotask queue so async handlers complete. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

// ─── Channel-gate integration tests (Comment 1) ──────────────────────────────
//
// These tests dispatch real MessageEvents at the production window listener
// that the <script type="module"> registers, verifying that the gate
// conditions (source, origin, ports.length) are actually enforced by the
// running code — not just checked as predicates against synthetic objects.

describe("TURNKEY_INIT_MESSAGE_CHANNEL channel gate (real listener)", () => {
  let d;
  let parentWindow;
  let teardown;

  beforeEach(async () => {
    ({ dom: d, parentWindow, teardown } = buildEmbeddedDom());
    // Drain any async work queued during eval (e.g. DOMContentLoaded callback)
    // so those calls are settled and isolated from the per-test assertions.
    await flush();
    // Reset call counts so per-test assertions start clean.
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    teardown();
  });

  function makeInitEvent({
    origin = "https://app.example.com",
    source = null,
    portsLength = 1,
    dangerouslyOverrideIframeKeyTtl = undefined,
  } = {}) {
    // Default source is the simulated parent.
    const resolvedSource = source === null ? parentWindow : source;
    const port = { onmessage: null, postMessage: jest.fn() };
    const ports = Array.from({ length: portsLength }, () => port);
    const data = { type: "TURNKEY_INIT_MESSAGE_CHANNEL" };
    if (dangerouslyOverrideIframeKeyTtl !== undefined) {
      data.dangerouslyOverrideIframeKeyTtl = dangerouslyOverrideIframeKeyTtl;
    }
    const event = new d.window.MessageEvent("message", {
      data,
      ports,
      origin,
    });
    Object.defineProperty(event, "source", { value: resolvedSource });
    return { event, port };
  }

  it("processes a valid init event and calls initEmbeddedKey + sendMessageUp", async () => {
    const { event } = makeInitEvent({ origin: "https://app.example.com" });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).toHaveBeenCalledWith(
      "https://app.example.com",
      d.window.TKHQ.TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS
    );
    expect(
      d.window.TKHQ.setParentFrameMessageChannelPort
    ).toHaveBeenCalledTimes(1);
    expect(d.window.TKHQ.sendMessageUp).toHaveBeenCalledWith(
      "PUBLIC_KEY_READY",
      "aabbccdd"
    );
  });

  it("rejects messages from non-parent sources (real listener enforces source check)", async () => {
    const { event } = makeInitEvent({ source: {} }); // not parentWindow
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).not.toHaveBeenCalled();
    expect(
      d.window.TKHQ.setParentFrameMessageChannelPort
    ).not.toHaveBeenCalled();
  });

  it("rejects messages with an opaque ('null') origin", async () => {
    const { event } = makeInitEvent({ origin: "null" });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).not.toHaveBeenCalled();
  });

  it("rejects messages with an empty origin string", async () => {
    const { event } = makeInitEvent({ origin: "" });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).not.toHaveBeenCalled();
  });

  it("rejects messages with zero ports (ports.length !== 1)", async () => {
    const { event } = makeInitEvent({ portsLength: 0 });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).not.toHaveBeenCalled();
  });

  it("rejects messages with two ports (ports.length !== 1)", async () => {
    const { event } = makeInitEvent({ portsLength: 2 });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).not.toHaveBeenCalled();
  });

  it("ignores a second TURNKEY_INIT_MESSAGE_CHANNEL while the first is pending (race guard)", async () => {
    // Dispatch both events synchronously before any await resolves — the
    // channelEstablished flag is set synchronously on the first, so the second
    // is rejected even though the first handler has not yet awaited initEmbeddedKey.
    const { event: event1 } = makeInitEvent({
      origin: "https://app.example.com",
    });
    const { event: event2, port: port2 } = makeInitEvent({
      origin: "https://malicious.example.com",
    });

    d.window.dispatchEvent(event1);
    d.window.dispatchEvent(event2);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).toHaveBeenCalledTimes(1);
    expect(d.window.TKHQ.initEmbeddedKey).toHaveBeenCalledWith(
      "https://app.example.com",
      d.window.TKHQ.TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS
    );
    expect(
      d.window.TKHQ.setParentFrameMessageChannelPort
    ).toHaveBeenCalledTimes(1);
    expect(
      d.window.TKHQ.setParentFrameMessageChannelPort
    ).not.toHaveBeenCalledWith(port2);
    expect(d.window.TKHQ.sendMessageUp).toHaveBeenCalledTimes(1);
  });

  it("rolls back channelEstablished and reports error when key init fails", async () => {
    d.window.TKHQ.initEmbeddedKey.mockRejectedValueOnce(
      new Error("storage blocked")
    );

    const { event: failedEvent, port: failedPort } = makeInitEvent({
      origin: "https://app.example.com",
    });
    d.window.dispatchEvent(failedEvent);
    await flush();

    // Error is reported on the offered port; no commit occurs.
    expect(failedPort.postMessage).toHaveBeenCalledWith({
      type: "ERROR",
      value: expect.stringContaining("storage blocked"),
    });
    expect(
      d.window.TKHQ.setParentFrameMessageChannelPort
    ).not.toHaveBeenCalled();

    // A retry handshake from the same parent must succeed.
    const { event: retryEvent, port: retryPort } = makeInitEvent({
      origin: "https://app.example.com",
    });
    d.window.dispatchEvent(retryEvent);
    await flush();

    expect(d.window.TKHQ.setParentFrameMessageChannelPort).toHaveBeenCalledWith(
      retryPort
    );
    expect(d.window.TKHQ.sendMessageUp).toHaveBeenCalledWith(
      "PUBLIC_KEY_READY",
      "aabbccdd"
    );
  });

  // ── dangerouslyOverrideIframeKeyTtl tests ──────────────────────────────────

  it("passes default TTL to initEmbeddedKey when no override is provided", async () => {
    const { event } = makeInitEvent({ origin: "https://app.example.com" });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).toHaveBeenCalledWith(
      "https://app.example.com",
      d.window.TKHQ.TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS
    );
  });

  it("passes the custom TTL to initEmbeddedKey when dangerouslyOverrideIframeKeyTtl is a positive number", async () => {
    const customTtl = 1000 * 60 * 60 * 2; // 2 hours
    const { event } = makeInitEvent({
      origin: "https://app.example.com",
      dangerouslyOverrideIframeKeyTtl: customTtl,
    });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).toHaveBeenCalledWith(
      "https://app.example.com",
      customTtl
    );
  });

  it("ignores dangerouslyOverrideIframeKeyTtl of zero and falls back to default TTL", async () => {
    const { event } = makeInitEvent({
      origin: "https://app.example.com",
      dangerouslyOverrideIframeKeyTtl: 0,
    });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).toHaveBeenCalledWith(
      "https://app.example.com",
      d.window.TKHQ.TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS
    );
  });

  it("ignores dangerouslyOverrideIframeKeyTtl of a negative number and falls back to default TTL", async () => {
    const { event } = makeInitEvent({
      origin: "https://app.example.com",
      dangerouslyOverrideIframeKeyTtl: -5000,
    });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).toHaveBeenCalledWith(
      "https://app.example.com",
      d.window.TKHQ.TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS
    );
  });

  it("ignores dangerouslyOverrideIframeKeyTtl of a string and falls back to default TTL", async () => {
    const { event } = makeInitEvent({
      origin: "https://app.example.com",
      dangerouslyOverrideIframeKeyTtl: "3600000",
    });
    d.window.dispatchEvent(event);
    await flush();

    expect(d.window.TKHQ.initEmbeddedKey).toHaveBeenCalledWith(
      "https://app.example.com",
      d.window.TKHQ.TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS
    );
  });
});

// ─── initEmbeddedKey readiness / rollback tests (Comment 2) ──────────────────

describe("initEmbeddedKey readiness promise and storage-failure rollback", () => {
  let dom2;
  let TKHQ2;

  beforeEach(() => {
    dom2 = new JSDOM(html, {
      runScripts: "dangerously",
      url: "http://localhost",
    });
    Object.defineProperty(dom2.window, "crypto", { value: crypto.webcrypto });
    TKHQ2 = dom2.window.TKHQ;
  });

  it("concurrent callers both see the key once the persistent init resolves", async () => {
    // Start a persistent init for one origin.
    const persistentInit = TKHQ2.initEmbeddedKey("https://app.turnkey.com");
    // A concurrent ephemeral init must not clobber the in-flight persistent state.
    await TKHQ2.initEphemeralEmbeddedKey();
    // The key is readable (persistent key should be settled now).
    expect(TKHQ2.getEmbeddedKey()).not.toBeNull();
    await persistentInit;
    // After the persistent init settles the key comes from localStorage.
    expect(TKHQ2.getEmbeddedKey()).not.toBeNull();
    expect(TKHQ2.getBoundOrigin()).toBe("https://app.turnkey.com");
  });

  it("ephemeral init that races persistent init yields the persistent key", async () => {
    const ephemeralInit = TKHQ2.initEphemeralEmbeddedKey();
    const persistentInit = TKHQ2.initEmbeddedKey("https://app.turnkey.com");
    await ephemeralInit;

    const key = TKHQ2.getEmbeddedKey();
    expect(key).not.toBeNull();
    await persistentInit;
    // After both settle the bound origin is set — persistent won.
    expect(TKHQ2.getBoundOrigin()).toBe("https://app.turnkey.com");
    const scopedEntry = dom2.window.localStorage.getItem(
      "TURNKEY_EMBEDDED_KEY_V2:" + encodeURIComponent("https://app.turnkey.com")
    );
    expect(scopedEntry).not.toBeNull();
  });

  it("rolls back to the previous ephemeral key when localStorage.setItem throws", async () => {
    // Establish an ephemeral key first.
    await TKHQ2.initEphemeralEmbeddedKey();
    const ephemeralKey = TKHQ2.getEmbeddedKey();
    expect(ephemeralKey).not.toBeNull();

    // Force setItemWithExpiry (which calls localStorage.setItem) to throw.
    const setItemSpy = jest
      .spyOn(Object.getPrototypeOf(dom2.window.localStorage), "setItem")
      .mockImplementation(() => {
        throw new Error("storage blocked");
      });

    await expect(
      TKHQ2.initEmbeddedKey("https://app.turnkey.com")
    ).rejects.toThrow("storage blocked");

    setItemSpy.mockRestore();

    // The document fell back to the previous ephemeral key.
    expect(TKHQ2.getEmbeddedKey()).toEqual(ephemeralKey);
    expect(TKHQ2.getBoundOrigin()).toBeNull();

    // A retry succeeds now that storage is available again.
    await TKHQ2.initEmbeddedKey("https://app.turnkey.com");
    expect(TKHQ2.getBoundOrigin()).toBe("https://app.turnkey.com");
    expect(TKHQ2.getEmbeddedKey()).not.toBeNull();
  });

  it("rolls back to null when there was no previous state and storage throws", async () => {
    const setItemSpy = jest
      .spyOn(Object.getPrototypeOf(dom2.window.localStorage), "setItem")
      .mockImplementation(() => {
        throw new Error("storage blocked");
      });

    await expect(
      TKHQ2.initEmbeddedKey("https://app.turnkey.com")
    ).rejects.toThrow("storage blocked");

    setItemSpy.mockRestore();

    // State rolled back to null: getEmbeddedKey returns null, getBoundOrigin null.
    expect(TKHQ2.getEmbeddedKey()).toBeNull();
    expect(TKHQ2.getBoundOrigin()).toBeNull();
  });

  it("stores the key with the default 48-hour TTL when no override is given", async () => {
    const before = Date.now();
    await TKHQ2.initEmbeddedKey("https://app.turnkey.com");
    const after = Date.now();

    const storageKey =
      "TURNKEY_EMBEDDED_KEY_V2:" +
      encodeURIComponent("https://app.turnkey.com");
    const raw = dom2.window.localStorage.getItem(storageKey);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw);
    // Expiry should be approximately now + 48 hours
    const expectedTtl = TKHQ2.TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS;
    expect(parsed.expiry).toBeGreaterThanOrEqual(before + expectedTtl);
    expect(parsed.expiry).toBeLessThanOrEqual(after + expectedTtl);
  });

  it("stores the key with the custom TTL when dangerouslyOverrideIframeKeyTtl is provided", async () => {
    const customTtl = 1000 * 60 * 60 * 2; // 2 hours in ms
    const before = Date.now();
    await TKHQ2.initEmbeddedKey("https://app.turnkey.com", customTtl);
    const after = Date.now();

    const storageKey =
      "TURNKEY_EMBEDDED_KEY_V2:" +
      encodeURIComponent("https://app.turnkey.com");
    const raw = dom2.window.localStorage.getItem(storageKey);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw);
    // Expiry should be approximately now + 2 hours (not 48 hours)
    expect(parsed.expiry).toBeGreaterThanOrEqual(before + customTtl);
    expect(parsed.expiry).toBeLessThanOrEqual(after + customTtl);
    // Confirm the custom TTL is significantly shorter than the default 48-hour TTL
    expect(parsed.expiry).toBeLessThan(
      before + TKHQ2.TURNKEY_EMBEDDED_KEY_TTL_IN_MILLIS
    );
  });
});

// ─── Outbound bound-origin tests (Comment 3) ─────────────────────────────────
//
// These tests exercise the real sendMessageUp implementation to verify it
// routes window.parent.postMessage to the correct targetOrigin.  We must NOT
// mock sendMessageUp itself here — only the crypto/storage helpers that would
// cause side effects.

describe("sendMessageUp uses bound legacy origin for outbound responses", () => {
  let d;
  let parentWindow;
  let teardown;

  beforeEach(async () => {
    ({ dom: d, parentWindow, teardown } = buildEmbeddedDom());
    // Drain DOMContentLoaded async work first.
    await flush();
    // Restore the sendMessageUp mock so the REAL implementation runs and we
    // can inspect parentWindow.postMessage call arguments.
    d.window.TKHQ.sendMessageUp.mockRestore();
    // Also restore logMessage (called inside sendMessageUp) to avoid DOM errors.
    jest.spyOn(d.window.TKHQ, "logMessage").mockImplementation(() => {});
    // Clear call history from the flush above.
    parentWindow.postMessage.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    teardown();
  });

  function makeLegacyEvent(requestId, origin = "https://app.example.com") {
    const event = new d.window.MessageEvent("message", {
      data: { type: "GET_EMBEDDED_PUBLIC_KEY", requestId },
      origin,
    });
    Object.defineProperty(event, "source", { value: parentWindow });
    return event;
  }

  it("uses '*' for outbound messages before any legacy origin is bound", () => {
    // Before any legacy message arrives parentFrameTargetOrigin is still "*".
    d.window.TKHQ.sendMessageUp("PUBLIC_KEY_READY", "pubkey");
    expect(parentWindow.postMessage).toHaveBeenCalledWith(
      { type: "PUBLIC_KEY_READY", value: "pubkey" },
      "*"
    );
  });

  it("uses the bound origin for outbound responses after the first valid legacy message", async () => {
    // Dispatch one legacy message — the listener binds legacyParentOrigin and
    // calls TKHQ.setParentFrameOrigin(event.origin), updating parentFrameTargetOrigin.
    d.window.dispatchEvent(makeLegacyEvent("req-1", "https://app.example.com"));
    await flush();

    // Clear calls accumulated while handling req-1.
    parentWindow.postMessage.mockClear();

    // A subsequent sendMessageUp must use the bound origin, not '*'.
    d.window.TKHQ.sendMessageUp("EMBEDDED_PUBLIC_KEY", "pubkey2");
    expect(parentWindow.postMessage).toHaveBeenCalledWith(
      { type: "EMBEDDED_PUBLIC_KEY", value: "pubkey2" },
      "https://app.example.com"
    );
    expect(parentWindow.postMessage).not.toHaveBeenCalledWith(
      expect.anything(),
      "*"
    );
  });

  it("still restricts to bound origin when a second legacy message arrives from the same origin", async () => {
    d.window.dispatchEvent(makeLegacyEvent("req-1", "https://app.example.com"));
    await flush();

    parentWindow.postMessage.mockClear();

    d.window.dispatchEvent(makeLegacyEvent("req-2", "https://app.example.com"));
    await flush();

    // Every outbound call must use the bound origin — never "*".
    expect(parentWindow.postMessage.mock.calls.length).toBeGreaterThan(0);
    for (const call of parentWindow.postMessage.mock.calls) {
      expect(call[1]).toBe("https://app.example.com");
    }
  });
});
