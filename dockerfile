FROM node:24.4.1-alpine3.21

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN corepack enable pnpm && pnpm i --frozen-lockfile

COPY . .