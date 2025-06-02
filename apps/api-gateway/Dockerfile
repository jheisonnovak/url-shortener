FROM node:22.16-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm i --quiet --no-optional --no-fund --loglevel=error
RUN npm i -g @nestjs/cli

COPY . .

RUN nest build api-gateway

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/main"]