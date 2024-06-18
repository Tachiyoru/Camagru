FROM node:18

WORKDIR /usr/src/app

VOLUME /usr/src

COPY config/package.json ./

RUN npm install

COPY . .

WORKDIR /usr/src/app
