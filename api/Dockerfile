FROM node:14-slim

WORKDIR /myApp

COPY package.json ./
COPY package-lock.json ./

RUN npm install
COPY ./ ./

# ENV PORT=9000
EXPOSE 9000

CMD [ "yarn", "start" ]
# CMD ["nodemon"]