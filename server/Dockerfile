FROM node:lts
WORKDIR /app
COPY . .
ENV ALIYUNPAN_CONFIG_DIR=/app/aliyunpan-v0.0.6-linux-amd64/config
RUN wget -O alydrive.zip "https://github.com/tickstep/aliyunpan/releases/download/v0.0.6/aliyunpan-v0.0.6-linux-amd64.zip" \
    &&unzip alydrive.zip -d /app/ \
    &&mkdir /app/aliyunpan-v0.0.6-linux-amd64/config
RUN yarn
CMD ["yarn","serve"]