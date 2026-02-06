# Multi-stage build: first stage for building webpack bundles
FROM node:18-bullseye-slim AS builder

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

#Copy export module and build
COPY export ./export/
RUN cd export && npm ci && npm run build

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

# Copy built export-and-sign and import files from builder stage
COPY --from=builder /app/export-and-sign/dist /usr/share/nginx/export-and-sign
COPY --from=builder /app/import/dist /usr/share/nginx/import
COPY --from=builder /app/export/dist /usr/share/nginx/export

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
