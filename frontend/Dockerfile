FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY .output/ ./.output/

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nitro && \
    chown nitro:nodejs /docker-entrypoint.sh && \
    chown -R nitro:nodejs /app/.output

USER nitro

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
