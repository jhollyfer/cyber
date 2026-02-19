# Docker

## Introducao

O backend possui dois Dockerfiles para diferentes ambientes: desenvolvimento local e producao. Ambos utilizam `node:22-alpine` como imagem base.

---

## dockerfile-development

Arquivo: `backend/dockerfile-development`

Container de desenvolvimento com hot-reload. Instala todas as dependencias (incluindo devDependencies) e executa o servidor em modo watch.

```dockerfile
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install
COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]
```

### Caracteristicas

- **Imagem base**: `node:22-alpine`
- **Dependencia de sistema**: `openssl` (necessario para Prisma)
- **Instalacao**: `npm install` completo (com devDependencies para SWC e TypeScript)
- **Prisma**: Executa `npx prisma generate` para gerar o Prisma Client
- **Porta**: 4000
- **Modo de execucao**: `npm run dev` (Fastify com `--watch` e compilacao SWC)
- **Codigo-fonte**: copiado integralmente para o container (`COPY . .`)

### docker-compose (desenvolvimento)

No `docker-compose.yml`, o backend e configurado com volume mount para hot-reload e executa migrations automaticamente:

```yaml
backend:
  build:
    context: ./backend
    dockerfile: dockerfile-development
  container_name: matis-backend
  restart: unless-stopped
  ports:
    - "4000:4000"
  env_file: .env
  depends_on:
    database:
      condition: service_healthy
  volumes:
    - ./backend:/app
    - /app/node_modules
  command: sh -c "npx prisma generate && npx prisma migrate deploy && npm run dev"
```

O comando sobrescreve o CMD do Dockerfile para garantir que as migrations Prisma sejam aplicadas antes do servidor iniciar.

### Seed

O seed do banco de dados deve ser executado apos os containers estarem rodando:

```bash
docker exec matis-backend npm run seed
```

---

## Dockerfile (producao)

Arquivo: `backend/Dockerfile`

Container de producao otimizado. Recebe o build pre-compilado e executa diretamente com Node.js, sem compilacao em runtime.

```dockerfile
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY build/ ./
COPY node_modules/ ./node_modules/
COPY package.json ./

RUN mkdir -p ./_storage

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001 -G nodejs && \
  chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["node", "bin/server.js"]
```

### Caracteristicas

- **Imagem base**: `node:22-alpine`
- **Dependencia de sistema**: `curl` (para healthcheck)
- **Arquivos copiados**:
  - `build/` -- codigo compilado pelo tsup
  - `node_modules/` -- dependencias de producao
  - `package.json`
- **Storage**: Diretorio `_storage/` criado automaticamente
- **Seguranca**: usuario `nodejs` nao-root (UID 1001, GID 1001)
- **Porta**: 3000 (em producao, mapeada via Traefik)
- **Modo de execucao**: `node bin/server.js` (execucao direta do build)

---

## Banco de Dados (PostgreSQL)

O docker-compose de desenvolvimento inclui um container PostgreSQL:

```yaml
database:
  image: postgres:16-alpine
  container_name: matis-database
  environment:
    POSTGRES_PASSWORD: ${DB_PASSWORD}
    POSTGRES_DB: ${DB_DATABASE}
    POSTGRES_USER: ${DB_USER}
  ports:
    - "${DB_PORT:-5432}:5432"
  volumes:
    - matis-database-volume:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_DATABASE}"]
    interval: 5s
    timeout: 5s
    retries: 5
```

O backend depende do healthcheck do PostgreSQL (`service_healthy`) para garantir que o banco esteja pronto antes de iniciar.

---

## Diferencas entre Desenvolvimento e Producao

| Aspecto | Desenvolvimento | Producao |
|---|---|---|
| Dockerfile | `dockerfile-development` | `Dockerfile` |
| Container | `matis-backend` | `matis-api` (via imagem Docker) |
| Dependencias de sistema | `openssl` | `curl` |
| Instalacao npm | `npm install` (todas) | `node_modules/` copiado |
| Prisma | `generate` + `migrate deploy` via command | Build pre-compilado |
| Codigo-fonte | Fonte TypeScript com volume mount | Build compilado (`build/`) |
| Comando de execucao | `npm run dev` (watch + SWC) | `node bin/server.js` |
| Porta | 4000 | 3000 |
| Usuario | root (padrao) | `nodejs` (nao-root) |
| Storage | Volume mount do host | Volume Docker |
| Hot-reload | Sim (volume mount) | Nao |
| Banco de dados | Container PostgreSQL local | Externo (DATABASE_URL) |

---

## Comandos Docker Uteis

```bash
# Subir containers em modo desenvolvimento
docker compose up -d

# Ver logs do backend
docker logs -f matis-backend

# Executar seed no container
docker exec matis-backend npm run seed

# Executar migrations no container
docker exec matis-backend npx prisma migrate deploy

# Acessar shell do container
docker exec -it matis-backend sh

# Rebuild do container apos mudancas no Dockerfile
docker compose up -d --build backend

# Acessar o banco de dados PostgreSQL
docker exec -it matis-database psql -U ${DB_USER} -d ${DB_DATABASE}
```
