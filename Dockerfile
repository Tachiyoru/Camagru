FROM node:18

WORKDIR /usr/src/app

VOLUME /usr/src

COPY . .

RUN npm install

EXPOSE 3000
