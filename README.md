# Frames

This repository contains authentication components for Turnkey, including iframe-based components (auth, export, import) and OAuth proxies (oauth-origin, oauth-redirect).

## iFrames

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

cd oauth-origin && npm install
cd oauth-redirect && npm install
```

# Unit Testing

The frames and oauth directories each have tests. They run on CI automatically. If you want to run them locally:
```sh
cd auth && npm test
cd export && npm test
cd import && npm test

cd oauth-origin && npm test
cd oauth-redirect && npm test
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

## Export and Sign
This iframe uses webpack for dependency management. You can run it in development mode with hot reload:
```sh
cd export-and-sign
npm run dev
```

Or build and serve the production bundle:
```sh
cd export-and-sign
npm run build
npm start
```

By default, the development server runs on port 8080, and the production static server runs on port 3000.

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

# Building with Webpack

You'll see that some of our iframes are built with webpack. Note that configurations may vary: some may have standalone HTML pages to serve separately (e.g. import), while others do not. Take a peek at some of the webpack config files for reference.

## Testing and iterating with Webpack

For iframes that utilize webpack, the development flows change a bit. Each change you make will likely require a subsequent `npm run build` to webpack-ify your changes. You can then test your changes with `npm run start` to view the site locally. 

Furthermore, the trickier part is ensuring that built files (most of the time persisted in `/dist`) are accessible. See `Dockerfile`, `nginx.conf`, and `kustomize/base/resources.yaml` to see some example configurations.

Finally, when iterating on an iframe and rebuilding, you may want to test locally with Docker + k8s. If you do so, you may need to add `imagePullPolicy: IfNotPresent` to both the `initContainers` and `containers` within `kustomize/base/resources.yaml`, and `newName: frames` + `newTag: latest` to `kustomize/base/kustomization.yaml`. This helps ensure you're using non-stale artifacts. In total, here's what you might do:

```bash
# (Re)-Build image
docker build --no-cache -t frames:latest .

# Import to k3d
k3d image import frames:latest --cluster frames

# Deploy
kubectl kustomize kustomize | kubectl --context k3d-frames apply -f-

# Test (with whichever ports are applicable for your iframe)
kubectl port-forward svc/frames 8083:8083 --context k3d-frames
```

If testing in a live, non-local environment, you can point containers to a new image as follows:

```
# Update containers (main + init) to new image
kubectl --context <context> -n tkhq-frames set image deployment/frames \
  frames=ghcr.io/tkhq/frames@sha256:<digest> \
  template-quorum-key=ghcr.io/tkhq/frames@sha256:<digest>
```
