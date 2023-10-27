# Frames

This repository contains code for the recovery and export components of Turnkey. These components can be embedded as iframes by users to support end-users in recovery and export.

## Email Recovery
This self-contained HTML page is meant to be used as a standalone document to help first-party Turnkey root users. It's also going to be embedded as an iframe to help with sub-org root recovery.

This page is hosted at https://recovery.tkhqlabs.xyz/

## Key and Wallet Export
This self-contained HTML page is meant to be used as either a standalone document or to be embedded as an iframe.

This page is hosted at https://export.tkhqlabs.xyz/

# Getting Started

Clone the repo:
```sh
git clone git@github.com:tkhq/frames.git
cd frames/
```

Install dependencies
```sh
npm install
```

# Unit Testing

This HTML page has tests. They run on CI automatically. If you want to run them locally:
```sh
npm test
```

# Running a Fake Recovery

Download mono, then check out `zeke-recovery-demo`:
```sh
git clone git@github.com:tkhq/mono.git
git checkout origin/zeke-recovery-demo -b zeke-recovery-demo
```

This branch contains a test which simulates recovery key creation.

Open the HTML page from this repo and replace the `hex_encoded_target_key` with [your own](https://github.com/tkhq/mono/blob/e802d8b0b0d52c7235f011889f7ac8b5747a6a02/src/rust/enclave_encrypt/src/lib.rs#L451). This is the key that the enclave will encrypt to.

Run the test!
```sh
$ cd src/rust
$ cargo test -p enclave_encrypt recovery_demo -- --nocapture
```

You'll see output similar to the following:
```sh
$ cargo test -p enclave_encrypt recovery_demo -- --nocapture
    Finished test [unoptimized + debuginfo] target(s) in 0.09s
     Running unittests src/lib.rs (target/debug/deps/enclave_encrypt-0e6e99f7cd0d1e6d)

running 1 test
Enclave Auth Key: 040c901d423c831ca85e27c73c263ba132721bb9d7a84c4f0380b2a6756fd601331c8870234dec878504c174144fa4b14b66a651691606d8173e55bd37e381569e
Encapped Key: 04d654d08624c1aa6e3709f2048f291860af7a29d01de52a256307da6d55602a833d525e0afecf4ad27aa052e704b7851a7184506cb4c72d2caf1e42932b959d14
Encapped Key Signature: cc3ed130a331b20fda25e8e4424b0b2f1015977ff60349c70d8b3a14d51ad9f897558eedccee80579508812bc6f31d987b210f21a64cb40beb56274c347c39a2
Ciphertext: 4e5e3257d2163520f564e9f9e5df01f10ce5a03baa8ffd12c2bf6a202be7ffc496008da179
test test::recovery_demo ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 4 filtered out; finished in 0.02s
```

Now, paste the artifacts and then decrypt! Note the Enclave Auth Key should already be correct.

# Running Local Wallet Export
Start the server. This command will run a simple static server on port 8080.
```sh
npm start
```

Clone the `sdk` repo.
```sh
git clone git@github.com:tkhq/sdk.git
```

Follow the README.md for the `key-export` example. Set the `NEXT_PUBLIC_EXPORT_IFRAME_URL="http://localhost:3000/export"` in the example's environment variables configuration. The `wallet-export` example embeds this page as an iframe.
```sh
cd sdk/examples/wallet-export
```