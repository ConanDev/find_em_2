FROM node:14-slim

WORKDIR /myApp

COPY ./package.json ./

RUN npm install

ENV PORT=9000
EXPOSE 9000

CMD [ "npm", "start" ]