# TODO: pin this!
FROM docker.io/nginxinc/nginx-unprivileged

LABEL org.opencontainers.image.title frames
LABEL org.opencontainers.image.source https://github.com/tkhq/frames

COPY nginx.conf /etc/nginx/nginx.conf

COPY recovery /usr/share/nginx/recovery
COPY export /usr/share/nginx/export

EXPOSE 8080/tcp
EXPOSE 8081/tcp

CMD ["nginx"]