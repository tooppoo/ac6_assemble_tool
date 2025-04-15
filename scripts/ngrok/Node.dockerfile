FROM node:22.14.0-slim@sha256:1c18d9ab3af4585870b92e4dbc5cac5a0dc77dd13df1a5905cea89fc720eb05b

WORKDIR /app

COPY . /app

RUN npm ci

CMD ["npm", "run", "dev"]
