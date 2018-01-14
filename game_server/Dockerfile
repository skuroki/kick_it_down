FROM node

ENV APP_ROOT /home/node/app

WORKDIR $APP_ROOT

COPY ./package.json $APP_ROOT
COPY ./package-lock.json $APP_ROOT

RUN npm install

COPY ./game_server.js $APP_ROOT

CMD ["node", "game_server.js"]
