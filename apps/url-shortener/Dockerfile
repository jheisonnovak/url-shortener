FROM node:22.16-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --only=production

COPY . .

RUN tsc -p apps/url-shortener/tsconfig.app.json

CMD ["node", "dist/apps/url-shortener/main"]