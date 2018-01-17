FROM node

ENV APP_ROOT /home/node/app

WORKDIR $APP_ROOT

COPY ./package.json $APP_ROOT
COPY ./package-lock.json $APP_ROOT

RUN npm install

COPY ./matching_server.js $APP_ROOT

CMD ["node", "matching_server.js"]
