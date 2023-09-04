# recovery

This repository contains code for the recovery component of Turnkey. This self-contained HTML page is meant to be used as a standalone document to help first-party Turnkey root users. It's also going to be embedded as an iframe to help with sub-org root recovery.

This page is hosted on Github pages at https://tkhq.github.io/recovery/

# Running a fake recovery

Download qos, then check out `rno/create-recovery-test`:
```sh
git clone git@github.com:tkhq/qos.git
git checkout origin/rno/create-recovery-test -b rno/create-recovery-test
```

This branch contains a test which simulates recovery key creation ([link](https://github.com/tkhq/qos/blob/03ebf8da370a74c0c77d156ad9634203cde61ee7/src/qos_p256/src/lib.rs#L457-L494)).

Open the HTML page from this repo and replace the `embedded_public_key` with your own [on line 471](https://github.com/tkhq/qos/blob/03ebf8da370a74c0c77d156ad9634203cde61ee7/src/qos_p256/src/lib.rs#L471).

Run the test!
```sh
$ cd src/qos_p256
$ cargo test process_create_recover -- --nocapture
```

You'll see output similar to the following:
```sh
$ cargo test process_create_recover -- --nocapture
    Finished test [unoptimized + debuginfo] target(s) in 0.05s
     Running unittests src/lib.rs (/Users/rno/tkhq/code/qos/src/target/debug/deps/qos_p256-914b76729319c733)

running 1 test
Enclave public key for ECDH: 0236b2ef931a40dd06d2e103718d6b82b1b87df9fc7e19f22fb4bd204ccb0a1b63
Encrypted recovery key: 0acb07085f8382d01eca5acd76a8208df0db27
Nonce (aka IV): beeeaf1eee098ec863d540ef
test test::process_create_recovery ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 29 filtered out; finished in 0.01s
```

Now, paste the encrypted recovery key and IV in your page, then decrypt!
