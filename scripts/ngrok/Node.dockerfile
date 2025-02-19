FROM node:22.14.0-slim@sha256:91be66fb4214c9449836550cf4c3524489816fcc29455bf42d968e8e87cfa5f2

WORKDIR /app

COPY . /app

RUN npm ci

CMD ["npm", "run", "dev"]
