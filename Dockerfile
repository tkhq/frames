ARG NODE_VERSION=24.11.0

# Multi-stage build: first stage for building webpack bundles
FROM node:${NODE_VERSION}-bullseye-slim AS builder

WORKDIR /app

# Copy shared directory first (needed by export-and-sign and import)
COPY shared ./shared/
RUN cd shared && npm ci

# Copy export-and-sign module and build
COPY export-and-sign ./export-and-sign/
RUN cd export-and-sign && npm ci && npm run build

# Copy import module and build
COPY import ./import/
RUN cd import && npm ci && npm run build

# Second stage: nginx runtime
FROM docker.io/nginxinc/nginx-unprivileged:1.31.6-trixie@sha256:ce1317316e272062981736063d4a7eed7d80b0d2a53da1305d0752aa4aee7a48

LABEL org.opencontainers.image.title frames
LABEL org.opencontainers.image.source https://github.com/tkhq/frames

COPY nginx.conf /etc/nginx/nginx.conf

# iframe

# maintain recovery for backwards-compatibility
COPY auth /usr/share/nginx/auth
COPY auth /usr/share/nginx/recovery

COPY export /usr/share/nginx/export

# Copy built export-and-sign and import files from builder stage
COPY --from=builder /app/export-and-sign/dist /usr/share/nginx/export-and-sign
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
