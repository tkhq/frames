# Auth-Components

This repository contains authentication components for Turnkey, including iframe-based components (auth, export, import) and OAuth proxies (origin, redirectUri).

## Frames

### Auth
This self-contained HTML page is meant to be used for the following use cases:
- As a standalone document to enable first-party Turnkey root users to perform recovery and auth
- Embedded as an iframe for sub-org root recovery and auth

This page is hosted at https://auth.turnkey.com/, but we will retain https://recovery.turnkey.com/ for compatibility.

### Key and Wallet Export
This self-contained HTML page is meant to be used as either a standalone document or to be embedded as an iframe.

This page is hosted at https://export.turnkey.com/

### Key and Wallet Import
This self-contained HTML page is meant to be used as either a standalone document or to be embedded as an iframe.

This page is hosted at https://import.turnkey.com/

## OAuth

### Origin
This self-contained HTML page handles the initial OAuth flow and manages authentication requests.
- Used to initiate and process OAuth authorization flows
- Handles secure parameter generation and validation

This page is hosted at https://oauth-origin.turnkey.com/

### Redirect
This self-contained HTML page processes OAuth callbacks from identity providers after authentication.
- Receives and validates OAuth redirect responses
- Completes the authentication flow and provides tokens to client applications

This page is hosted at https://oauth-redirect.turnkey.com/

# Getting Started

Clone the repo:
```sh
git clone git@github.com:tkhq/auth-components.git
cd auth-components/
```

Install Node:
```sh
nvm use
```
(the command above installs the version specified in `.nvmrc`, but any Node version >= v18 should do)

Install dependencies:
```sh
cd frames/auth && npm install
cd frames/export && npm install
cd frames/import && npm install

cd oauth/origin && npm install
cd oauth/redirect && npm install
```

# Unit Testing

The frames and oauth directories each have tests. They run on CI automatically. If you want to run them locally:
```sh
cd frames/auth && npm test
cd frames/export && npm test
cd frames/import && npm test

cd oauth/origin && npm test
cd oauth/redirect && npm test
```

# Local Development

## Wallet Import
Start the server. This command will run a simple static server on port 3000.
```sh
cd frames/import
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
cd frames/export
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
cd frames/auth
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
docker build . -t auth-components
```

To run (mapping `[8080, 8081, ...]` to `[18080, 18081, ...]` because they're often busy):
```
docker run -p18080:8080 -p18081:8081 -t auth-components
```

# Deploying to a test Kubernetes cluster

This requires [`k3d`](https://k3d.io/) to be installed:
```
# Create a local cluster
k3d cluster create auth-components

# Deploy to it
kubectl kustomize kustomize | kubectl --context k3d-auth-components apply -f-

# Be able to access locally (8080 as an example)
kubectl port-forward svc/auth-components 8080:8080
```

To clean things up:
```
k3d cluster delete auth-components
```
