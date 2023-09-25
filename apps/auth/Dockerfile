FROM node:16.15.0-alpine
WORKDIR /app

COPY prisma ./prisma/
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .

# PRISMA
RUN apk add postgresql-client
RUN chmod +x ./prisma/wait-for-postgres.sh

CMD sh ./prisma/wait-for-postgres.sh auth-pg-srv npx prisma migrate deploy && pnpm dev
