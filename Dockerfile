ARG NODE_VERSION=24.11.0

#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
#
#        Base image that comes with node, rust & foundry
#
#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
FROM node:$NODE_VERSION-alpine AS base

# Environment setup
ENV PNPM_HOME="/pnpm"

# We need to set the CI flag so that pnpm does not ask whether it should
# reinstall the modules
# 
# See https://github.com/pnpm/pnpm/issues/6615
ENV CI=1

# Paths
ENV PATH="${PNPM_HOME}:${PATH}"

# Update system packages
RUN apk update --no-cache
RUN apk upgrade --no-cache

# Required system packages
RUN apk add --no-cache curl

# Enable corepack so that we have access to pnpm
RUN corepack enable

# Output versions
RUN node --version
RUN npm --version
RUN pnpm --version

#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
#
#             Image that prepares the workspace
#
#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
FROM base AS workspace

WORKDIR /app

# Get the pnpm files so that we can install all dependencies
COPY pnpm-*.yaml ./

# Fetch all the dependencies
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store\
    pnpm fetch --frozen-lockfile

# Get the source code
COPY . .

# Install the dependencies
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store\
    pnpm install --frozen-lockfile

#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
#
#                    Image for development
#
#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
FROM workspace AS development

# Since this dockerfile is used for all services,
# we'll use a build argument to pass the target service in
# and copy it to the environment so that it can be used in ENTRYPOINT
ARG TARGET_SERVICE
ENV TARGET_SERVICE=$TARGET_SERVICE
# We also need to define the signer environment so that it can be used in webpack.config.js
ARG TURNKEY_SIGNER_ENVIRONMENT_OVERRIDE
ENV TURNKEY_SIGNER_ENVIRONMENT_OVERRIDE=$TURNKEY_SIGNER_ENVIRONMENT_OVERRIDE
ENV NODE_ENV=development
ENV TURBO_TELEMETRY_DISABLED=1

ENTRYPOINT pnpm dev --filter $TARGET_SERVICE

#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
#
#                Image that builds the project
#
#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
FROM workspace AS build

WORKDIR /app

ARG TURNKEY_SIGNER_ENVIRONMENT
ENV TURNKEY_SIGNER_ENVIRONMENT=$TURNKEY_SIGNER_ENVIRONMENT
ENV NODE_ENV=production

# Build the project
RUN pnpm build

#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
#
#           Server image (nginx 1.24.0 on bullseye)
#
#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
# 
# https://hub.docker.com/layers/nginxinc/nginx-unprivileged/1.24.0-bullseye/images/sha256-a8ec652916ce1e7ab2ab624fe59bb8dfc16a018fd489c6fb979fe35c5dd3ec50
FROM docker.io/nginxinc/nginx-unprivileged:1.24.0-bullseye@sha256:ac0654a834233f7cc95b3a61550a07636299ce9020b5a11a04890b77b6917dc4 AS server

ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx

LABEL org.opencontainers.image.title frames
LABEL org.opencontainers.image.source https://github.com/tkhq/frames

# COPY nginx.conf /etc/nginx/templates/nginx.conf.template

CMD ["nginx"]

#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
#
#           Production image (server + static files)
#
#   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-.   .-.-
#  / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \ \ / / \
# `-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'   `-`-'
FROM server AS production

WORKDIR /usr/share/nginx

COPY nginx.conf /etc/nginx/templates/nginx.conf.template

# maintain recovery for backwards-compatibility
COPY auth /usr/share/nginx/auth
COPY auth /usr/share/nginx/recovery

COPY --from=build /app/export/dist /usr/share/nginx/export
COPY --from=build /app/export-and-sign/dist /usr/share/nginx/export-and-sign
COPY --from=build /app/import/dist /usr/share/nginx/import

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