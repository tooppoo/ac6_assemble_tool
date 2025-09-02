FROM node:22.19.0-slim@sha256:0ae9e80c8c7e7a8fea5bc8e8762e4fd09a7a68c251abf8cf44ea0863efda2bc5

WORKDIR /app

COPY . /app

RUN npm ci

CMD ["npm", "run", "dev"]
