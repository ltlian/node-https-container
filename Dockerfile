FROM node:alpine
WORKDIR /node-server
COPY ./app/package.json .
RUN npm install
CMD [ "node", "app/main.js" ]