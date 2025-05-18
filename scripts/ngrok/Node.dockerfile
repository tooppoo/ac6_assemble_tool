FROM node:22.15.1-slim@sha256:ec318fe0dc46b56bcc1ca42a202738aeb4f3e347a7b4dd9f9f1df12ea7aa385a

WORKDIR /app

COPY . /app

RUN npm ci

CMD ["npm", "run", "dev"]
