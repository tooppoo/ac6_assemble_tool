FROM node:22.13.1-slim@sha256:83fdfa2a4de32d7f8d79829ea259bd6a4821f8b2d123204ac467fbe3966450fc

WORKDIR /app

COPY . /app

RUN npm ci

CMD ["npm", "run", "dev"]
