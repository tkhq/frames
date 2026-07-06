# Multi-stage build: first stage for building webpack bundles
FROM node:18-bullseye-slim AS builder

WORKDIR /app

# Copy shared directory first (needed by import)
COPY shared ./shared/
RUN cd shared && npm ci

# Copy import module and build
COPY import ./import/
RUN cd import && npm ci && npm run build

# Note: export-and-sign is NOT built here. Its committed dist/ is used directly
# (copied in the runtime stage below), just like the `export` frame. The CI
# build-check job already rebuilds export-and-sign and verifies dist/ matches
# source, so the committed artifact is trusted. Building it in this stage would
# require `npm ci` of viem's very large file tree under QEMU-emulated arm64,
# which fails with ECONNRESET.

# Second stage: nginx runtime
# This is nginx 1.24.0 on bullseye.
# https://hub.docker.com/layers/nginxinc/nginx-unprivileged/1.24.0-bullseye/images/sha256-a8ec652916ce1e7ab2ab624fe59bb8dfc16a018fd489c6fb979fe35c5dd3ec50
FROM docker.io/nginxinc/nginx-unprivileged:1.24.0-bullseye@sha256:ac0654a834233f7cc95b3a61550a07636299ce9020b5a11a04890b77b6917dc4

LABEL org.opencontainers.image.title frames
LABEL org.opencontainers.image.source https://github.com/tkhq/frames

COPY nginx.conf /etc/nginx/nginx.conf

# iframe

# maintain recovery for backwards-compatibility
COPY auth /usr/share/nginx/auth
COPY auth /usr/share/nginx/recovery

COPY export /usr/share/nginx/export

# export-and-sign uses its committed dist/ directly (verified by the CI
# build-check job); see the builder stage note above.
COPY export-and-sign/dist /usr/share/nginx/export-and-sign

# Copy built import files from builder stage
COPY --from=builder /app/import/dist /usr/share/nginx/import

# oauth
COPY oauth-origin /usr/share/nginx/oauth-origin
COPY oauth-redirect /usr/share/nginx/oauth-redirect

# iframe
EXPOSE 8080/tcp
EXPOSE 8081/tcp
EXPOSE 8082/tcp
EXPOSE 8083/tcp
EXPOSE 8086/tcp

# oauth
EXPOSE 8084/tcp
EXPOSE 8085/tcp

WORKDIR /usr/share/nginx

CMD ["nginx"]
