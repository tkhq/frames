# This is nginx 1.24.0 on bullseye.
# https://hub.docker.com/layers/nginxinc/nginx-unprivileged/1.24.0-bullseye/images/sha256-a8ec652916ce1e7ab2ab624fe59bb8dfc16a018fd489c6fb979fe35c5dd3ec50
FROM docker.io/nginxinc/nginx-unprivileged:1.24.0-bullseye@sha256:ac0654a834233f7cc95b3a61550a07636299ce9020b5a11a04890b77b6917dc4

LABEL org.opencontainers.image.title frames
LABEL org.opencontainers.image.source https://github.com/tkhq/frames

COPY nginx.conf /etc/nginx/nginx.conf

# maintain recovery for backwards-compatibility
COPY auth /usr/share/nginx/auth
COPY auth /usr/share/nginx/recovery
COPY export /usr/share/nginx/export
COPY import /usr/share/nginx/import

EXPOSE 8080/tcp
EXPOSE 8081/tcp
EXPOSE 8082/tcp
EXPOSE 8083/tcp

CMD ["nginx"]
