FROM node:16.10-alpine3.14

RUN apk add --no-cache bash

RUN yarn global add @nestjs/cli@9

USER node

WORKDIR /home/node/app
