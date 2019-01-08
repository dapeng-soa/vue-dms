FROM nginx:1.15
RUN rm /etc/nginx/conf.d/default.conf
ADD default.conf /etc/nginx/conf.d/
COPY apps/dist/ /usr/share/nginx/html/