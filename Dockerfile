# This is nginx 1.24.0 on bullseye.
# https://hub.docker.com/layers/nginxinc/nginx-unprivileged/1.24.0-bullseye/images/sha256-a8ec652916ce1e7ab2ab624fe59bb8dfc16a018fd489c6fb979fe35c5dd3ec50
FROM docker.io/nginxinc/nginx-unprivileged@sha256:a8ec652916ce1e7ab2ab624fe59bb8dfc16a018fd489c6fb979fe35c5dd3ec50

LABEL org.opencontainers.image.title frames
LABEL org.opencontainers.image.source https://github.com/tkhq/frames

COPY nginx.conf /etc/nginx/nginx.conf

COPY recovery /usr/share/nginx/recovery
COPY export /usr/share/nginx/export

EXPOSE 8080/tcp
EXPOSE 8081/tcp

CMD ["nginx"]