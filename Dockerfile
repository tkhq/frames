# This is nginx 1.24.0 on bullseye.
# https://hub.docker.com/layers/nginxinc/nginx-unprivileged/1.24.0-bullseye/images/sha256-a8ec652916ce1e7ab2ab624fe59bb8dfc16a018fd489c6fb979fe35c5dd3ec50
FROM docker.io/nginxinc/nginx-unprivileged:1.24.0-bullseye@sha256:ac0654a834233f7cc95b3a61550a07636299ce9020b5a11a04890b77b6917dc4

LABEL org.opencontainers.image.title="frames"
LABEL org.opencontainers.image.source="https://github.com/tkhq/frames"

COPY nginx.conf /etc/nginx/nginx.conf

# iframe
COPY frames/auth /usr/share/nginx/auth
# maintain recovery for backwards-compatibility
COPY frames/auth /usr/share/nginx/recovery 
COPY frames/export /usr/share/nginx/export
COPY frames/import /usr/share/nginx/import

# oauth
COPY oauth/origin /usr/share/nginx/origin
COPY oauth/redirect /usr/share/nginx/redirect

# iframe ports
EXPOSE 8080/tcp  
EXPOSE 8081/tcp  
EXPOSE 8082/tcp  

# oauth ports
EXPOSE 8083/tcp  
EXPOSE 8084/tcp  

WORKDIR /usr/share/nginx

CMD ["nginx"]