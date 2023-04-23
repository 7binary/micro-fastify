FROM node:alpine

RUN apk update
RUN apk add vim nano

WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .

CMD ["yarn", "dev"]
