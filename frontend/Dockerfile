FROM node:22-alpine

WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar .output pronto (vem do artifact)
COPY .output/ ./.output/
COPY replace-env.js ./replace-env.js

# Copiar entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nitro && \
    chown nitro:nodejs /docker-entrypoint.sh && \
    chown nitro:nodejs /app/replace-env.js && \
    chown -R nitro:nodejs /app/.output

USER nitro

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]