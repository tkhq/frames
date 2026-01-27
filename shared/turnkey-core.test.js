/**
 * Tests for shared turnkey-core utilities
 * These tests cover functionality that is shared across all frames
 */

import "@testing-library/jest-dom";
import * as crypto from "crypto";
import * as SharedTKHQ from "./turnkey-core.js";

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
    SharedTKHQ.uint8arrayFromHexString(TURNKEY_SIGNER_ENCLAVE_QUORUM_PUBLIC_KEY)
  );
  const quorumKey = await loadQuorumKey(encryptionQuorumPublicBuf);
  if (!quorumKey) {
    throw new Error("failed to load quorum key");
  }

  const publicSignatureBuf = SharedTKHQ.fromDerSignature(publicSignature);
  const signedDataBuf = SharedTKHQ.uint8arrayFromHexString(signedData);
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

describe("Shared TKHQ Utilities", () => {
  beforeEach(() => {
    window.TextDecoder = global.TextDecoder;
    window.TextEncoder = global.TextEncoder;
    window.__TURNKEY_SIGNER_ENVIRONMENT__ = "prod";

    global.crypto = crypto.webcrypto;
    window.crypto = crypto.webcrypto;
    SharedTKHQ.setCryptoProvider(crypto.webcrypto);

    window.localStorage.clear();
  });

  describe("LocalStorage with expiry", () => {
    it("gets and sets items with expiry localStorage", async () => {
      // Set a TTL of 1000ms
      SharedTKHQ.setItemWithExpiry("k", "v", 1000);
      let item = JSON.parse(window.localStorage.getItem("k"));
      expect(item.value).toBe("v");
      expect(item.expiry).toBeTruthy();

      // Get item that has not expired yet
      item = SharedTKHQ.getItemWithExpiry("k");
      expect(item).toBe("v");

      // Test expired item: use setItemWithExpiry, then manually set expiry in the past
      SharedTKHQ.setItemWithExpiry("a", "b", 500);
      // Verify the item was set correctly with setItemWithExpiry
      let itemA = JSON.parse(window.localStorage.getItem("a"));
      expect(itemA.value).toBe("b");
      expect(itemA.expiry).toBeTruthy();

      // Now manually modify the expiry to be in the past to test expiration
      const expiredItem = {
        value: "b",
        expiry: new Date().getTime() - 1000,
      };
      window.localStorage.setItem("a", JSON.stringify(expiredItem));
      const expiredResult = SharedTKHQ.getItemWithExpiry("a");
      expect(expiredResult).toBeNull();

      // Returns null if getItemWithExpiry is called for item without expiry
      window.localStorage.setItem("k", JSON.stringify({ value: "v" }));
      item = SharedTKHQ.getItemWithExpiry("k");
      expect(item).toBeNull();
    });
  });

  describe("Target embedded key management", () => {
    it("gets and sets embedded target key in localStorage", async () => {
      expect(SharedTKHQ.getTargetEmbeddedKey()).toBe(null);

      // Set a dummy "key"
      SharedTKHQ.setTargetEmbeddedKey({ foo: "bar" });
      expect(SharedTKHQ.getTargetEmbeddedKey()).toEqual({ foo: "bar" });

      // Reset it
      SharedTKHQ.resetTargetEmbeddedKey();
      expect(SharedTKHQ.getTargetEmbeddedKey()).toBe(null);
    });
  });

  describe("Key loading and generation", () => {
    it("imports P256 keys", async () => {
      const targetPubHex =
        "0491ccb68758b822a6549257f87769eeed37c6cb68a6c6255c5f238e2b6e6e61838c8ac857f2e305970a6435715f84e5a2e4b02a4d1e5289ba7ec7910e47d2d50f";
      const targetPublicBuf = SharedTKHQ.uint8arrayFromHexString(targetPubHex);
      const key = await SharedTKHQ.loadTargetKey(
        new Uint8Array(targetPublicBuf)
      );
      expect(key.kty).toEqual("EC");
      expect(key.ext).toBe(true);
      expect(key.crv).toBe("P-256");
      expect(key.key_ops).toEqual([]);
    });

    it("generates P256 keys", async () => {
      let key = await SharedTKHQ.generateTargetKey();
      expect(key.kty).toEqual("EC");
      expect(key.ext).toBe(true);
      expect(key.crv).toBe("P-256");
      expect(key.key_ops).toContain("deriveBits");
    });
  });

  describe("Key encoding and decoding", () => {
    it("encodes hex-encoded private key correctly by default", async () => {
      const keyHex =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const encodedKey = await SharedTKHQ.encodeKey(
        SharedTKHQ.uint8arrayFromHexString(keyHex.slice(2))
      );
      expect(encodedKey).toEqual(keyHex);
    });

    it("encodes hex-encoded private key correctly", async () => {
      const keyHex =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const encodedKey = await SharedTKHQ.encodeKey(
        SharedTKHQ.uint8arrayFromHexString(keyHex.slice(2)),
        "HEXADECIMAL"
      );
      expect(encodedKey).toEqual(keyHex);
    });

    it("encodes solana private key correctly", async () => {
      const keySol =
        "2P3qgS5A18gGmZJmYHNxYrDYPyfm6S3dJgs8tPW6ki6i2o4yx7K8r5N8CF7JpEtQiW8mx1kSktpgyDG1xuWNzfsM";
      const keySolBytes = SharedTKHQ.base58Decode(keySol);
      expect(keySolBytes.length).toEqual(64);
      const keyPrivBytes = keySolBytes.subarray(0, 32);
      const keyPubBytes = keySolBytes.subarray(32, 64);
      const encodedKey = await SharedTKHQ.encodeKey(
        keyPrivBytes,
        "SOLANA",
        keyPubBytes
      );
      expect(encodedKey).toEqual(keySol);
    });

    it("decodes hex-encoded private key correctly by default", async () => {
      const keyHex =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const keyBytes = SharedTKHQ.uint8arrayFromHexString(keyHex.slice(2));
      const decodedKey = await SharedTKHQ.decodeKey(keyHex);
      expect(decodedKey.length).toEqual(keyBytes.length);
      for (let i = 0; i < decodedKey.length; i++) {
        expect(decodedKey[i]).toEqual(keyBytes[i]);
      }
    });

    it("decodes hex-encoded private key correctly", async () => {
      const keyHex =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const keyBytes = SharedTKHQ.uint8arrayFromHexString(keyHex.slice(2));
      const decodedKey = await SharedTKHQ.decodeKey(keyHex, "HEXADECIMAL");
      expect(decodedKey.length).toEqual(keyBytes.length);
      for (let i = 0; i < decodedKey.length; i++) {
        expect(decodedKey[i]).toEqual(keyBytes[i]);
      }
    });

    it("decodes solana private key correctly", async () => {
      const keySol =
        "2P3qgS5A18gGmZJmYHNxYrDYPyfm6S3dJgs8tPW6ki6i2o4yx7K8r5N8CF7JpEtQiW8mx1kSktpgyDG1xuWNzfsM";
      const keyBytes = SharedTKHQ.base58Decode(keySol);
      expect(keyBytes.length).toEqual(64);
      const keyPrivBytes = keyBytes.subarray(0, 32);
      const decodedKey = await SharedTKHQ.decodeKey(keySol, "SOLANA");
      expect(decodedKey.length).toEqual(keyPrivBytes.length);
      for (let i = 0; i < decodedKey.length; i++) {
        expect(decodedKey[i]).toEqual(keyPrivBytes[i]);
      }
    });
  });

  describe("Hex string utilities", () => {
    it("contains uint8arrayToHexString", () => {
      expect(
        SharedTKHQ.uint8arrayToHexString(
          new Uint8Array([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])
        )
      ).toEqual("627566666572");
    });

    it("contains uint8arrayFromHexString", () => {
      expect(
        SharedTKHQ.uint8arrayFromHexString("627566666572").toString()
      ).toEqual("98,117,102,102,101,114");

      // Error case: bad value
      expect(() => {
        SharedTKHQ.uint8arrayFromHexString({});
      }).toThrow("cannot create uint8array from invalid hex string");
      // Error case: empty string
      expect(() => {
        SharedTKHQ.uint8arrayFromHexString("");
      }).toThrow("cannot create uint8array from invalid hex string");
      // Error case: odd number of characters
      expect(() => {
        SharedTKHQ.uint8arrayFromHexString("123");
      }).toThrow("cannot create uint8array from invalid hex string");
      // Error case: bad characters outside of hex range
      expect(() => {
        SharedTKHQ.uint8arrayFromHexString("oops");
      }).toThrow("cannot create uint8array from invalid hex string");
    });

    it("handles hex strings with 0x prefix in uint8arrayFromHexString", () => {
      // With 0x prefix (lowercase)
      expect(
        SharedTKHQ.uint8arrayFromHexString("0x627566666572").toString()
      ).toEqual("98,117,102,102,101,114");

      // With 0X prefix (uppercase)
      expect(
        SharedTKHQ.uint8arrayFromHexString("0X627566666572").toString()
      ).toEqual("98,117,102,102,101,114");

      // Without prefix (backward compatibility)
      expect(
        SharedTKHQ.uint8arrayFromHexString("627566666572").toString()
      ).toEqual("98,117,102,102,101,114");

      // Real private key with 0x prefix
      const keyHex =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const keyBytes = SharedTKHQ.uint8arrayFromHexString(keyHex);
      expect(keyBytes.length).toBe(32);

      // Same key without 0x prefix should give same result
      const keyBytesWithoutPrefix = SharedTKHQ.uint8arrayFromHexString(
        keyHex.slice(2)
      );
      expect(keyBytes.toString()).toEqual(keyBytesWithoutPrefix.toString());
    });
  });

  describe("Base58 encoding/decoding", () => {
    it("encodes and decodes base58 correctly", () => {
      const original = new Uint8Array([1, 2, 3, 4, 5]);
      const encoded = SharedTKHQ.base58Encode(original);
      const decoded = SharedTKHQ.base58Decode(encoded);
      expect(decoded).toEqual(original);
    });

    it("throws error on invalid base58 characters", () => {
      expect(() => {
        SharedTKHQ.base58Decode("invalid-characters!");
      }).toThrow("cannot base58-decode");
    });
  });

  describe("Private key parsing", () => {
    it("parsePrivateKey handles different formats", () => {
      // Hex format without 0x prefix
      const hexKey =
        "13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const parsedHex = SharedTKHQ.parsePrivateKey(hexKey);
      expect(parsedHex.length).toBe(32);

      // Hex format with 0x prefix
      const hexKeyWithPrefix =
        "0x13eff5b3f9c63eab5d53cff5149f01606b69325496e0e98b53afa938d890cd2e";
      const parsedHexWithPrefix = SharedTKHQ.parsePrivateKey(hexKeyWithPrefix);
      expect(parsedHexWithPrefix.length).toBe(32);
      expect(parsedHex.toString()).toEqual(parsedHexWithPrefix.toString());

      // Array format
      const arrayKey = Array.from(SharedTKHQ.uint8arrayFromHexString(hexKey));
      const parsedArray = SharedTKHQ.parsePrivateKey(arrayKey);
      expect(parsedArray.length).toBe(32);
      expect(parsedArray.toString()).toEqual(parsedHex.toString());

      // Error case: invalid string format
      expect(() => {
        SharedTKHQ.parsePrivateKey("invalid-key");
      }).toThrow("Invalid private key format");

      // Error case: invalid type
      expect(() => {
        SharedTKHQ.parsePrivateKey(12345);
      }).toThrow("Private key must be a string");
    });
  });

  describe("Padding normalization", () => {
    it("normalizes padding in a byte array", () => {
      // Array with no leading 0's and a valid target length
      const arr = new Uint8Array(32).fill(1);
      expect(SharedTKHQ.normalizePadding(arr, 32).length).toBe(32);
      expect(SharedTKHQ.normalizePadding(arr, 32)).toBe(arr);

      // Array with an extra leading 0 and valid target length
      const zeroesArr = new Uint8Array(1).fill(0);
      const zeroesLeadingArr = new Uint8Array([...zeroesArr, ...arr]);
      expect(SharedTKHQ.normalizePadding(zeroesLeadingArr, 32).length).toBe(32);
      expect(SharedTKHQ.normalizePadding(zeroesLeadingArr, 32)).toStrictEqual(
        arr
      );

      // Array with a missing leading 0 and valid target length
      const zeroesMissingArr = new Uint8Array(31).fill(1);
      const paddedArr = new Uint8Array(32);
      paddedArr.fill(1, 1);
      expect(SharedTKHQ.normalizePadding(zeroesMissingArr, 32).length).toBe(32);
      expect(
        Array.from(SharedTKHQ.normalizePadding(zeroesMissingArr, 32))
      ).toStrictEqual(Array.from(paddedArr));

      // Array with an extra leading 0 and invalid zero count
      expect(() => SharedTKHQ.normalizePadding(zeroesLeadingArr, 31)).toThrow(
        "invalid number of starting zeroes. Expected number of zeroes: 2. Found: 1."
      );
    });
  });

  describe("ASN.1 DER signature handling", () => {
    it("decodes a ASN.1 DER-encoded signature to raw format", () => {
      // Valid signature where r and s don't need padding
      expect(
        SharedTKHQ.fromDerSignature(
          "304402202b769b6dd410ff8a1cbcd5dd7fb2733e80f11922443b1eb629e6e538d1054c3b022020b9715d140f079190123411370971cc6daba8e61b6b58d36321c31ae331799b"
        ).length
      ).toBe(64);

      // Valid signature where r and s have extra padding
      expect(
        SharedTKHQ.fromDerSignature(
          "3046022100b71f5a377a7ae6d245d1aa22145f52f7c7d87fcaf7c68c60f43fecf3817b22cf022100cdea30eb54c099a8c86b14c3d2c4accd59c21fbeacd878842d5e9bdd39d19d55"
        ).length
      ).toBe(64);

      // Valid signature where r has extra padding
      expect(
        SharedTKHQ.fromDerSignature(
          "304502210088f4f3b59e277f30cb16c05541551eca702ce925002dbc3de3a7c0a7f76b23f902202a0f272c3e5724848dc5232c3409918277d65fd7e8c6eb1630bf6eb2eeb472e3"
        ).length
      ).toBe(64);

      // Invalid signature. Wrong integer tag for r
      expect(() =>
        SharedTKHQ.fromDerSignature(
          "304503210088f4f3b59e277f30cb16c05541551eca702ce925002dbc3de3a7c0a7f76b23f902202a0f272c3e5724848dc5232c3409918277d65fd7e8c6eb1630bf6eb2eeb472e3"
        )
      ).toThrow("failed to convert DER-encoded signature: invalid tag for r");

      // Invalid signature. Wrong integer tag for s
      expect(() =>
        SharedTKHQ.fromDerSignature(
          "304502210088f4f3b59e277f30cb16c05541551eca702ce925002dbc3de3a7c0a7f76b23f903202a0f272c3e5724848dc5232c3409918277d65fd7e8c6eb1630bf6eb2eeb472e3"
        )
      ).toThrow("failed to convert DER-encoded signature: invalid tag for s");
    });
  });

  describe("Enclave signature verification", () => {
    it("verifies enclave signature", async () => {
      // Valid signature
      let verified = await verifyEnclaveSignature(
        "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
        "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
        "04e479640d6d3487bbf132f6258ee24073411b8325ea68bb28883e45b650d059f82c48db965b8f777b30ab9e7810826bfbe8ad1789f9f10bf76dcd36b2ee399bc5"
      );
      expect(verified).toBe(true);

      // Invalid signature
      verified = await verifyEnclaveSignature(
        "04cf288fe433cc4e1aa0ce1632feac4ea26bf2f5a09dcfe5a42c398e06898710330f0572882f4dbdf0f5304b8fc8703acd69adca9a4bbf7f5d00d20a5e364b2569",
        "30440220773382ac39085f58a584fd5ad8c8b91b50993ad480af2c5eaefe0b09447b6dca02205201c8e20a92bce524caac08a956b0c2e7447de9c68f91ab1e09fd58988041b5",
        "04d32d8e0fe5a401a717971fabfabe02ddb6bea39b72a18a415fc0273579b394650aae97f75b0462ffa8880a1899c7a930569974519685a995d2e74e372e105bf4"
      );
      expect(verified).toBe(false);
    });
  });

  describe("Additional Associated Data", () => {
    it("contains additionalAssociatedData", async () => {
      // This is a trivial helper; concatenates the 2 arrays!
      expect(
        SharedTKHQ.additionalAssociatedData(
          new Uint8Array([1, 2]),
          new Uint8Array([3, 4])
        ).buffer
      ).toEqual(new Uint8Array([1, 2, 3, 4]).buffer);
    });
  });

  describe("P256 JWK to Public Key", () => {
    it("converts P256 JWK private key to public key", async () => {
      // Generate a key first
      const privateKey = await SharedTKHQ.generateTargetKey();
      const publicKey = await SharedTKHQ.p256JWKPrivateToPublic(privateKey);
      expect(publicKey).toBeInstanceOf(Uint8Array);
      expect(publicKey.length).toBe(65); // Uncompressed P-256 public key
    });
  });
});
