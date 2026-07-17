import { fromDerSignature } from "@turnkey/crypto";
import * as SharedTKHQ from "@turnkey/frames-shared";

const {
  initEmbeddedKey,
  generateTargetKey,
  setItemWithExpiry,
  getItemWithExpiry,
  getEmbeddedKey,
  setEmbeddedKey,
  onResetEmbeddedKey,
  p256JWKPrivateToPublic,
  base58Encode,
  base58Decode,
  sendMessageUp,
  logMessage,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  setParentFrameMessageChannelPort,
  normalizePadding,
  additionalAssociatedData,
  getSettings,
  setSettings,
  parsePrivateKey,
  validateStyles,
  verifyEnclaveSignature,
} = SharedTKHQ;

/**
 * Encodes a Uint8Array into a base58-check-encoded string
 * Throws an error if the input is invalid or the checksum is invalid.
 * @param {Uint8Array} payload The raw payload to encode.
 * @return {Promise<string>} The base58check-encoded string.
 */
async function base58CheckEncode(payload) {
  const hash1Buf = await crypto.subtle.digest("SHA-256", payload);
  const hash1 = new Uint8Array(hash1Buf);

  const hash2Buf = await crypto.subtle.digest("SHA-256", hash1);
  const hash2 = new Uint8Array(hash2Buf);

  const checksum = hash2.slice(0, 4);

  const full = new Uint8Array(payload.length + 4);
  full.set(payload, 0);
  full.set(checksum, payload.length);

  return base58Encode(full);
}

/**
 * Bech32 character set as defined in BIP173.
 * Reference: https://github.com/bitcoinjs/bech32/blob/5ceb0e3d4625561a459c85643ca6947739b2d83c/src/index.ts#L2
 * The alphabet excludes '1', 'b', 'i', and 'o' to avoid confusion with similar-looking characters.
 */
const BECH32_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

/**
 * Map each bech32 character to its 5-bit value (0-31).
 * Used for decoding bech32 strings.
 */
const BECH32_CHAR_MAP = (() => {
  const map = {};
  for (let i = 0; i < BECH32_CHARSET.length; i++) {
    map[BECH32_CHARSET[i]] = i;
  }
  return map;
})();

/**
 * Internal function that computes the Bech32 checksum polymod.
 * This implements the BCH code checksum as specified in BIP173.
 * Reference: https://en.bitcoin.it/wiki/Bech32
 *
 * The generator polynomial constants are derived from the BCH code generator.
 * The function processes 5-bit values and XORs them with generator values
 * based on the top 5 bits of the current checksum state.
 *
 * @param {number[]} values - Array of 5-bit values to process
 * @returns {number} - The checksum polymod result
 */
function bech32Polymod(values) {
  let chk = 1;
  // Generator polynomial constants for BCH code (BIP173) (see https://github.com/bitcoinjs/bech32/blob/5ceb0e3d4625561a459c85643ca6947739b2d83c/src/index.ts#L10)
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  for (let p = 0; p < values.length; p++) {
    const v = values[p];
    const top = chk >>> 25; // Extract top 5 bits
    chk = ((chk & 0x1ffffff) << 5) ^ v; // Shift left and XOR with value
    for (let i = 0; i < 5; i++) {
      if (((top >>> i) & 1) !== 0) {
        chk ^= GEN[i]; // XOR with generator if bit is set
      }
    }
  }
  return chk;
}

/**
 * Expand the Human-Readable Part (HRP) for Bech32 checksum computation.
 * Reference: https://en.bitcoin.it/wiki/Bech32
 *
 * The HRP is expanded by taking:
 * 1. The upper 3 bits of each character (right-shifted by 5)
 * 2. A separator (0)
 * 3. The lower 5 bits of each character (masked with 31)
 *
 * For example, "bc" becomes [3, 3, 0, 2, 3] where:
 * - 'b' (0x62) → upper: 3, lower: 2
 * - 'c' (0x63) → upper: 3, lower: 3
 *
 * @param {string} hrp - Human-Readable Part (e.g., "bc", "suiprivkey")
 * @returns {number[]} - Expanded array of 5-bit values
 */
function bech32HrpExpand(hrp) {
  const ret = [];
  // Extract upper 3 bits of each character
  for (let i = 0; i < hrp.length; i++) {
    const c = hrp.charCodeAt(i);
    ret.push(c >> 5);
  }
  ret.push(0); // Separator
  // Extract lower 5 bits of each character
  for (let i = 0; i < hrp.length; i++) {
    const c = hrp.charCodeAt(i);
    ret.push(c & 31);
  }
  return ret;
}

/**
 * Create a Bech32 checksum (6 characters).
 * Reference: https://en.bitcoin.it/wiki/Bech32
 *
 * The checksum is computed by:
 * 1. Expanding the HRP and concatenating with the data
 * 2. Appending six zero values
 * 3. Computing the polymod
 * 4. XORing with the bech32 constant (1)
 * 5. Extracting six 5-bit values from the result
 *
 * Note: This uses the bech32 constant (1). For bech32m (BIP350), the constant is 0x2bc830a3.
 *
 * @param {string} hrp - Human-Readable Part
 * @param {number[]} data - Array of 5-bit values representing the payload
 * @returns {number[]} - Array of 6 checksum values (5-bit each)
 */
function bech32CreateChecksum(hrp, data) {
  const values = bech32HrpExpand(hrp).concat(data);
  const polymod = bech32Polymod(values.concat([0, 0, 0, 0, 0, 0])) ^ 1; // bech32 const = 1
  const checksum = [];
  for (let i = 0; i < 6; i++) {
    checksum.push((polymod >> (5 * (5 - i))) & 31); // Extract 5 bits
  }
  return checksum;
}

/**
 * Convert from 8-bit bytes to 5-bit words (groups).
 * Reference: https://en.bitcoin.it/wiki/Bech32
 *
 * This function repacks data from 8-bit bytes to 5-bit groups.
 * Since 8 and 5 don't evenly divide, we use an accumulator to handle the conversion.
 *
 * For example, 2 bytes (16 bits) → 3.2 groups (16/5), so we pad to 4 groups (20 bits).
 * The final group may have zero-padding in the lower bits.
 *
 * @param {Uint8Array} bytes - Input data as 8-bit bytes
 * @returns {number[]} - Array of 5-bit values (0-31)
 */
function bech32ToWords(bytes) {
  const fromBits = 8;
  const toBits = 5;
  const pad = true;

  let acc = 0;
  let bits = 0;
  const maxv = (1 << toBits) - 1;
  const result = [];

  for (let i = 0; i < bytes.length; i++) {
    const value = bytes[i];
    if (value < 0 || value > 255) {
      throw new Error("invalid byte value for bech32");
    }
    acc = (acc << fromBits) | value;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      result.push((acc >> bits) & maxv);
    }
  }

  if (pad) {
    if (bits > 0) {
      result.push((acc << (toBits - bits)) & maxv);
    }
  } else {
    if (bits >= fromBits) {
      throw new Error("excess padding in bech32 data");
    }
    if ((acc & ((1 << bits) - 1)) !== 0) {
      throw new Error("non-zero padding in bech32 data");
    }
  }

  return result;
}

/**
 * Convert from 5-bit words (groups) back to 8-bit bytes.
 * Reference: https://en.bitcoin.it/wiki/Bech32
 *
 * This is the inverse of bech32ToWords. It repacks 5-bit groups back to 8-bit bytes.
 * Unlike encoding, decoding does NOT add padding (pad = false) to ensure the data
 * length is exact and any trailing bits are validated to be zero.
 *
 * The maxAcc limit prevents accumulator overflow during bit manipulation.
 *
 * @param {number[]} words - Array of 5-bit values (0-31)
 * @returns {Uint8Array} - Output data as 8-bit bytes
 */
function bech32FromWords(words) {
  const fromBits = 5;
  const toBits = 8;
  const pad = false;

  let acc = 0;
  let bits = 0;
  const maxv = (1 << toBits) - 1;
  const maxAcc = (1 << (fromBits + toBits - 1)) - 1;
  const result = [];

  for (let i = 0; i < words.length; i++) {
    const value = words[i];
    if (value < 0 || value >> fromBits !== 0) {
      throw new Error("invalid bech32 word");
    }
    acc = ((acc << fromBits) | value) & maxAcc;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      result.push((acc >> bits) & maxv);
    }
  }

  if (pad) {
    if (bits > 0) {
      result.push((acc << (toBits - bits)) & maxv);
    }
  } else {
    if (bits >= fromBits) {
      throw new Error("excess padding in bech32 data");
    }
    if ((acc & ((1 << bits) - 1)) !== 0) {
      throw new Error("non-zero padding in bech32 data");
    }
  }

  return new Uint8Array(result);
}

/**
 * Encode bytes into a Bech32 string.
 * Reference: https://en.bitcoin.it/wiki/Bech32
 *
 * Creates a complete bech32-encoded string in the format: hrp + "1" + data + checksum
 * For example: "suiprivkey1" + encoded_data + 6_checksum_chars
 *
 * The separator "1" is used because it's not part of the bech32 character set.
 *
 * @param {string} hrp - Human-Readable Part (e.g., "suiprivkey")
 * @param {Uint8Array} bytes - Raw bytes to encode
 * @returns {string} - Complete bech32-encoded string
 */
function encodeBech32(hrp, bytes) {
  const words = bech32ToWords(bytes);
  const checksum = bech32CreateChecksum(hrp, words);
  const combined = words.concat(checksum);

  let out = hrp + "1";
  for (let i = 0; i < combined.length; i++) {
    out += BECH32_CHARSET[combined[i]];
  }
  return out;
}

/**
 * Decode a Bech32 or Bech32m string.
 * Reference: https://en.bitcoin.it/wiki/Bech32
 *
 * This function:
 * 1. Splits the string at the last "1" separator into HRP and data
 * 2. Validates the character set
 * 3. Computes and verifies the checksum
 * 4. Returns the HRP, data words (without checksum), and variant
 *
 * Supports both bech32 (const=1) and bech32m (const=0x2bc830a3) variants.
 * The variant is determined by the checksum validation.
 *
 * @param {string} str - Bech32-encoded string
 * @returns {{hrp: string, words: number[], variant: string}} - Decoded components
 */
function decodeBech32(str) {
  // Enforce lower-case (Sui uses lowercase)
  const s = str.toLowerCase();

  // Split HRP and data at last '1'
  const pos = s.lastIndexOf("1");
  if (pos <= 0 || pos + 7 > s.length) {
    throw new Error("invalid bech32: bad separator or too short");
  }

  const hrp = s.slice(0, pos);
  const dataPart = s.slice(pos + 1);

  if (!hrp || hrp.length < 1) {
    throw new Error("invalid bech32: HRP too short");
  }

  const data = [];
  for (let i = 0; i < dataPart.length; i++) {
    const c = dataPart[i];
    const v = BECH32_CHAR_MAP[c];
    if (v == null) {
      throw new Error(`invalid bech32 character: '${c}'`);
    }
    data.push(v);
  }

  if (data.length < 6) {
    throw new Error("invalid bech32: data too short (no room for checksum)");
  }

  const values = bech32HrpExpand(hrp).concat(data);
  const polymod = bech32Polymod(values);

  // bech32 checksum = 1, bech32m checksum = 0x2bc830a3
  const BECH32_CONST = 1;
  const BECH32M_CONST = 0x2bc830a3;

  if (polymod !== BECH32_CONST && polymod !== BECH32M_CONST) {
    throw new Error("invalid bech32: checksum mismatch");
  }

  // strip checksum (last 6 words)
  const words = data.slice(0, data.length - 6);

  return {
    hrp,
    words,
    variant: polymod === BECH32_CONST ? "bech32" : "bech32m",
  };
}

/**
 * Returns a private key from private key bytes, represented in
 * the encoding and format specified by `keyFormat`. Defaults to
 * hex-encoding if `keyFormat` isn't passed.
 * @param {Uint8Array} privateKeyBytes
 * @param {string} keyFormat Can be "HEXADECIMAL", "SUI_BECH32", "BITCOIN_MAINNET_WIF", "BITCOIN_TESTNET_WIF" or "SOLANA"
 */
async function encodeKey(privateKeyBytes, keyFormat, publicKeyBytes) {
  switch (keyFormat) {
    case "SOLANA": {
      if (!publicKeyBytes) {
        throw new Error("public key must be specified for SOLANA key format");
      }
      if (privateKeyBytes.length !== 32) {
        throw new Error(
          `invalid private key length. Expected 32 bytes. Got ${privateKeyBytes.length}.`
        );
      }
      if (publicKeyBytes.length !== 32) {
        throw new Error(
          `invalid public key length. Expected 32 bytes. Got ${publicKeyBytes.length}.`
        );
      }
      const concatenatedBytes = new Uint8Array(64);
      concatenatedBytes.set(privateKeyBytes, 0);
      concatenatedBytes.set(publicKeyBytes, 32);
      return base58Encode(concatenatedBytes);
    }
    case "HEXADECIMAL":
      return "0x" + uint8arrayToHexString(privateKeyBytes);
    case "BITCOIN_MAINNET_WIF":
    case "BITCOIN_TESTNET_WIF": {
      if (privateKeyBytes.length !== 32) {
        throw new Error(
          `invalid private key length. Expected 32 bytes. Got ${privateKeyBytes.length}.`
        );
      }

      const version = keyFormat === "BITCOIN_MAINNET_WIF" ? 0x80 : 0xef;
      const wifPayload = new Uint8Array(34);
      wifPayload[0] = version;
      wifPayload.set(privateKeyBytes, 1);
      wifPayload[33] = 0x01; // compressed flag

      return await base58CheckEncode(wifPayload);
    }
    case "SUI_BECH32": {
      if (privateKeyBytes.length !== 32) {
        throw new Error(
          `invalid private key length. Expected 32 bytes. Got ${privateKeyBytes.length}.`
        );
      }

      const schemeFlag = 0x00; // ED25519 | We only support ED25519 keys for Sui currently
      const bech32Payload = new Uint8Array(1 + 32);
      bech32Payload[0] = schemeFlag;
      bech32Payload.set(privateKeyBytes, 1);

      return encodeBech32("suiprivkey", bech32Payload);
    }
    default:
      console.warn(
        `invalid key format: ${keyFormat}. Defaulting to HEXADECIMAL.`
      );
      return "0x" + uint8arrayToHexString(privateKeyBytes);
  }
}

/**
 * Returns a UTF-8 encoded wallet mnemonic + newline optional passphrase
 * from wallet bytes.
 * @param {Uint8Array} walletBytes
 */
function encodeWallet(walletBytes) {
  const decoder = new TextDecoder("utf-8");
  const wallet = decoder.decode(walletBytes);
  let mnemonic;
  let passphrase = null;

  if (wallet.includes("\n")) {
    const parts = wallet.split("\n");
    mnemonic = parts[0];
    passphrase = parts[1];
  } else {
    mnemonic = wallet;
  }

  return {
    mnemonic: mnemonic,
    passphrase: passphrase,
  };
}

export const TKHQ = {
  bech32FromWords,
  decodeBech32,
  encodeBech32,
  encodeWallet,
  initEmbeddedKey,
  generateTargetKey,
  setItemWithExpiry,
  getItemWithExpiry,
  getEmbeddedKey,
  setEmbeddedKey,
  onResetEmbeddedKey,
  p256JWKPrivateToPublic,
  base58Encode,
  base58Decode,
  base58CheckEncode,
  encodeKey,
  sendMessageUp,
  logMessage,
  uint8arrayFromHexString,
  uint8arrayToHexString,
  setParentFrameMessageChannelPort,
  normalizePadding,
  fromDerSignature,
  additionalAssociatedData,
  verifyEnclaveSignature,
  validateStyles,
  getSettings,
  setSettings,
  parsePrivateKey,
};
