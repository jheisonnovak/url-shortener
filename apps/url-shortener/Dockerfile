FROM node:22.16-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build url-shortener

CMD ["node", "dist/apps/url-shortener/main"]