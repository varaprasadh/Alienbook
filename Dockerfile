FROM node

WORKDIR /alienbook

COPY . .

RUN sh build.prod.sh

WORKDIR /alienbook/server

RUN npm install

CMD [ "node","index.js" ]
