# Frames

This repository contains code for the auth (which includes recovery) and export components of Turnkey. These components can be embedded as iframes by users to support end-users.

## Auth
This self-contained HTML page is meant to be used for the following use cases:
- As a standalone document to enable first-party Turnkey root users to perform recovery and auth
- Embedded as an iframe for sub-org root recovery and auth

This page is hosted at https://auth.turnkey.com/, but we will retain https://recovery.turnkey.com/ for compatibility.

## Key and Wallet Export
This self-contained HTML page is meant to be used as either a standalone document or to be embedded as an iframe.

This page is hosted at https://export.turnkey.com/

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
cd import && npm install
```

# Unit Testing

The auth and recovery pages each have tests. They run on CI automatically. If you want to run them locally:
```sh
cd auth && npm test
cd export && npm test
cd import && npm test
```

# Local Development

## Wallet Import
Start the server. This command will run a simple static server on port 3000.
```sh
cd import
npm start
```

Clone the `sdk` repo.
```sh
git clone git@github.com:tkhq/sdk.git
```

Follow the README.md for the `wallet-import-export` [example](https://github.com/tkhq/sdk/tree/main/examples/wallet-import-export). Set the `NEXT_PUBLIC_IMPORT_IFRAME_URL="http://localhost:3000/index.template"` in the example's environment variables configuration. The `wallet-import-export` example embeds this page as an iframe.
```sh
cd sdk/examples/wallet-import-export
```

## Wallet Export
Start the server. This command will run a simple static server on port 3000.
```sh
cd export
npm start
```

Clone the `sdk` repo.
```sh
git clone git@github.com:tkhq/sdk.git
```

Follow the README.md for the `wallet-import-export` [example](https://github.com/tkhq/sdk/tree/main/examples/wallet-import-export). Set the `NEXT_PUBLIC_EXPORT_IFRAME_URL="http://localhost:3000/index.template"` in the example's environment variables configuration. The `wallet-import-export` example embeds this page as an iframe.
```sh
cd sdk/examples/wallet-import-export
```

## Email Auth
Start the server. This command will run a simple static server on port 3000.
```sh
cd auth
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

To run (mapping `[8080, 8081, ...]` to `[18080, 18081, ...]` because they're often busy):
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

# Be able to access locally (8080 as an example)
kubectl port-forward svc/frames 8080:8080
```

To clean things up:
```
k3d cluster delete frames
```
