FROM node:22.16-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --only=production

COPY . .

RUN tsc -p apps/api-gateway/tsconfig.app.json

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/main"]