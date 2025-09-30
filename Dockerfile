# Multi-stage build: first stage for building webpack bundles
FROM node:18-bullseye-slim AS builder

WORKDIR /app

# Copy package files for export module
COPY export/package*.json ./export/
RUN cd export && npm ci

# Copy export source files and build
COPY export/src ./export/src/
COPY export/webpack.config.js ./export/
COPY export/babel.config.js ./export/
COPY export/favicon.svg ./export/
RUN cd export && npm run build

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

# Copy built export files from builder stage
COPY --from=builder /app/export/dist /usr/share/nginx/export
# Also copy the template for environment variable substitution
COPY export/index.template.html /usr/share/nginx/export/

COPY import /usr/share/nginx/import

# oauth
COPY oauth-origin /usr/share/nginx/oauth-origin
COPY oauth-redirect /usr/share/nginx/oauth-redirect

# iframe
EXPOSE 8080/tcp
EXPOSE 8081/tcp
EXPOSE 8082/tcp
EXPOSE 8083/tcp

# oauth
EXPOSE 8084/tcp
EXPOSE 8085/tcp

WORKDIR /usr/share/nginx

CMD ["nginx"]
