FROM docker.io/debian@sha256:741bae561f5c2261f4cdd535e4fd4c248dec0aafc1b9a1410b3d67ad24571340

LABEL org.opencontainers.image.title frames
LABEL org.opencontainers.image.source https://github.com/tkhq/frames

RUN groupadd --gid 1000 nginx \
    && useradd --uid 1000 --gid nginx --shell /bin/bash --create-home nginx \
    && apt update \
    && apt install -y nginx \
    && rm -rf /var/lib/apt/lists/* \
    && nginx -v

RUN chown -R nginx:nginx /var/lib/nginx \
    && touch /run/nginx.pid \
    && chown -R nginx:nginx /run/nginx.pid

USER nginx
WORKDIR /home/nginx

ADD nginx.conf .
COPY recovery ./recovery
COPY export ./export

EXPOSE 8080/tcp

CMD [ "nginx", "-c", "/home/nginx/nginx.conf" ]
