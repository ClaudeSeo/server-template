FROM node:14.17.1-alpine as tsbuild

RUN mkdir /usr/app
WORKDIR /usr/app

COPY package*.json tsconfig*.json ./

RUN npm ci
COPY src ./src
RUN npm run build

FROM node:14.17.1-alpine
LABEL maintainer="claudeseo <ehdaudtj@gmail.com>"

RUN mkdir /usr/app
WORKDIR /usr/app

RUN apk add --no-cache tini tzdata

COPY --from=tsbuild /usr/app/dist .
COPY --from=tsbuild /usr/app/node_modules ./node_modules
COPY package.json ./

RUN npm prune --production

USER node

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "main.js"]
