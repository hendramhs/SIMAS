FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY sql ./sql

RUN mkdir -p uploads && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

USER node

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
