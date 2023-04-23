FROM node:16.15.0-alpine

RUN apk update
RUN apk add vim nano

WORKDIR /app

COPY prisma ./prisma/
COPY package*.json ./

RUN yarn install --frozen-lockfile
COPY . .

# PRISMA
RUN apk add postgresql-client
RUN chmod +x ./prisma/wait-for-postgres.sh

CMD sh ./prisma/wait-for-postgres.sh auth-pg-srv npx prisma migrate deploy && yarn dev
