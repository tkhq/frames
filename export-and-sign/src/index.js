// Import styles
import './styles.css';

// Bundle all external dependencies for the iframe
import * as hpke from '@hpke/core';
import {
  createSolanaRpc,
  address,
  createKeyPairFromBytes,
  createKeyPairFromPrivateKeyBytes,
  createTransactionMessage,
  signTransaction,
  getAddressFromPublicKey,
  lamports,
} from '@solana/kit';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import * as nobleEd25519 from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';

// Define LAMPORTS_PER_SOL constant since it's not exported from Kit
const LAMPORTS_PER_SOL = 1_000_000_000n;

// Export everything for use in the HTML
export {
  hpke,
  createSolanaRpc,
  address,
  createKeyPairFromBytes,
  createKeyPairFromPrivateKeyBytes,
  createTransactionMessage,
  signTransaction,
  getAddressFromPublicKey,
  LAMPORTS_PER_SOL,
  lamports,
  nacl,
  naclUtil,
  nobleEd25519,
  sha512
};
