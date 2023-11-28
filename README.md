# Frames

This repository contains code for the recovery, export, and auth components of Turnkey. These components can be embedded as iframes by users to support end-users.

## Email Recovery
This self-contained HTML page is meant to be used as a standalone document to help first-party Turnkey root users. It's also going to be embedded as an iframe to help with sub-org root recovery.

This page is hosted at https://auth.turnkey.com/

## Key and Wallet Export
This self-contained HTML page is meant to be used as either a standalone document or to be embedded as an iframe.

This page is hosted at https://export.turnkey.com/

## Auth (via Email)
This self-contained HTML page is meant to be used as either a standalone document or to be embedded as an iframe.

This page is also hosted at https://auth.turnkey.com/

# Getting Started

Clone the repo:
```sh
git clone git@github.com:tkhq/frames.git
cd frames/
```

Install Node:
```sh
nvm use
```
(the command above installs the version specified in `.nvmrc`, but any Node version >= v18 should do)

Install dependencies:
```sh
cd auth && npm install
cd export && npm install
```

# Unit Testing

The auth and recovery pages each have tests. They run on CI automatically. If you want to run them locally:
```sh
cd auth && npm test
cd export  && npm test
```

# Running Local Wallet Export
Start the server. This command will run a simple static server on port 8080.
```sh
npm start
```

Clone the `sdk` repo.
```sh
git clone git@github.com:tkhq/sdk.git
```

Follow the README.md for the `wallet-export` [example](https://github.com/tkhq/sdk/tree/main/examples/wallet-export). Set the `NEXT_PUBLIC_EXPORT_IFRAME_URL="http://localhost:3000/"` in the example's environment variables configuration. The `wallet-export` example embeds this page as an iframe.
```sh
cd sdk/examples/wallet-export
```

# Running Local Auth
Start the server. This command will run a simple static server on port 8080.
```sh
npm start
```

Clone the `sdk` repo.
```sh
git clone git@github.com:tkhq/sdk.git
```

Follow the README.md for the `email-auth` [example](https://github.com/tkhq/sdk/tree/main/examples/email-auth). Set the `NEXT_PUBLIC_AUTH_IFRAME_URL="http://localhost:3000/"` in the example's environment variables configuration. The `email-auth` example embeds this page as an iframe.
```sh
cd sdk/examples/email-auth
```

# Building and running in Docker

To build:
```
docker build . -t frames
```

To run (mapping `[8080, 8081]` to `[18080, 18081]` because they're often busy):
```
docker run -p18080:8080 -p18081:8081 -t frames
```

# Deploying to a test Kubernetes cluster

This requires [`k3d`](https://k3d.io/) to be installed:
```
# Create a local cluster
k3d cluster create frames

# Deploy to it
kubectl kustomize kustomize | kubectl --context k3d-frames apply -f-
```

To clean things up:
```
k3d cluster delete frames
```
