FROM node:18

WORKDIR /usr/src/app

VOLUME /usr/src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
