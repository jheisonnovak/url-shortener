FROM node:22.16-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm i --quiet --no-optional --no-fund --loglevel=error
RUN npm i -g @nestjs/cli

COPY . .

RUN nest build auth-service

CMD ["node", "dist/apps/auth-service/main"]