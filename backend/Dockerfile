FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY build/ ./build/
COPY node_modules/ ./node_modules/
COPY package.json ./
COPY generated/ ./generated/
COPY prisma/ ./prisma/

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4000

CMD ["node", "build/bin/server.js"]
