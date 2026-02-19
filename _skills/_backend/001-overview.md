# Visao Geral da Arquitetura do Backend - MatisCraft

## Introducao

O backend do MatisCraft e uma API RESTful construida com **Fastify 5** e **TypeScript**, utilizando **PostgreSQL** como banco de dados via **Prisma 7** (com adapter `@prisma/adapter-pg`). A plataforma conecta artesaos indigenas a curadores e administradores para gerenciamento de pecas artesanais e conteudos culturais. A aplicacao segue principios de arquitetura limpa com injecao de dependencias, pattern Either para tratamento de erros e controllers baseados em decorators.

---

## Stack Tecnologica

| Tecnologia | Funcao |
|---|---|
| Fastify 5 | Framework HTTP |
| TypeScript | Linguagem |
| Prisma 7 | ORM para PostgreSQL (via `@prisma/adapter-pg`) |
| PostgreSQL | Banco de dados relacional |
| Zod | Validacao de schemas |
| @fastify/jwt | Autenticacao JWT (RS256) |
| @fastify/cookie | Gerenciamento de cookies |
| fastify-decorators | Injecao de dependencias e controllers via decorators |
| Nodemailer | Envio de emails transacionais |
| EJS | Templates de email |
| sharp | Processamento de imagens |
| Vitest | Testes unitarios e e2e |
| tsup | Bundler para producao |
| SWC | Compilador TypeScript em desenvolvimento |

---

## Roles (Papeis)

O sistema possui 3 roles definidos no enum `Role` do Prisma:

| Role | Descricao |
|---|---|
| **ADMINISTRATOR** | Gerencia artesaos, curadores, categorias, aldeias. Aprova/rejeita solicitacoes de atualizacao de curadores. |
| **CURATOR** | Aprova/rejeita solicitacoes de pecas e conteudos culturais. Gerencia solicitacoes de atualizacao de artesaos. |
| **ARTISAN** | Cria solicitacoes de pecas e conteudos culturais. Solicita atualizacoes de perfil. |

---

## Repositorios (12) + Servico de Email

O sistema utiliza 12 repositorios Prisma e 1 servico de email, todos registrados via DI no `di-registry.ts`:

| Contrato | Implementacao |
|---|---|
| `ArtisanContractRepository` | `ArtisanPrismaRepository` |
| `ArtisanUpdateRequestContractRepository` | `ArtisanUpdateRequestPrismaRepository` |
| `CategoryContractRepository` | `CategoryPrismaRepository` |
| `CulturalContentContractRepository` | `CulturalContentPrismaRepository` |
| `CulturalContentRequestContractRepository` | `CulturalContentRequestPrismaRepository` |
| `CuratorContractRepository` | `CuratorPrismaRepository` |
| `CuratorUpdateRequestContractRepository` | `CuratorUpdateRequestPrismaRepository` |
| `PieceContractRepository` | `PiecePrismaRepository` |
| `PieceRequestContractRepository` | `PieceRequestPrismaRepository` |
| `StorageContractRepository` | `StoragePrismaRepository` |
| `UserContractRepository` | `UserPrismaRepository` |
| `VillageContractRepository` | `VillagePrismaRepository` |
| `EmailContractService` | `NodemailerEmailService` |

---

## Resources (16)

| Resource | Prefixo de rota | Descricao |
|---|---|---|
| `_root` | `/` | Redireciona para documentacao |
| `administrator` | `/administrator` | Gestao de artesaos, curadores, categorias e perfil admin |
| `artisans` | `/artisans` | Listagem publica, solicitacoes de pecas e conteudos culturais |
| `authentication` | `/authentication` | Sign-in, sign-up, sign-out, refresh-token |
| `categories` | `/categories` | Listagem de categorias e pecas/conteudos por categoria |
| `cultural-content-requests` | `/cultural-content-requests` | Listagem e detalhes de solicitacoes de conteudos culturais |
| `cultural-contents` | `/cultural-contents` | Listagem e detalhes de conteudos culturais |
| `curator` | `/curator` | Acoes especificas do curador (update-request, artisans update-requests) |
| `curators` | `/curators` | Curadoria: aprovacao de pecas, conteudos e solicitacoes |
| `piece-requests` | `/piece-requests` | Listagem e detalhes de solicitacoes de pecas |
| `pieces` | `/pieces` | Listagem e detalhes de pecas |
| `profile` | `/profile` | Visualizar perfil do usuario autenticado |
| `reports` | `/reports` | Relatorios de artesaos, pecas, conteudos, curadoria |
| `stats` | `/stats` | Estatisticas por role (administrator, artisan, curator) |
| `storage` | `/storage` | Upload e exclusao de arquivos |
| `villages` | `/villages` | Listagem de aldeias |

---

## Autenticacao

A autenticacao utiliza **JWT com algoritmo RS256** e chaves publica/privada codificadas em Base64. Os tokens sao entregues via **cookies httpOnly**:

- **accessToken**: validade de 24 horas
- **refreshToken**: validade de 7 dias

---

## Injecao de Dependencias

A DI e gerenciada pelo `fastify-decorators` atraves do `injectablesHolder`. O registro e feito no arquivo `application/core/di-registry.ts`, mapeando contratos abstratos para implementacoes Prisma. Para trocar de ORM, basta alterar os imports e registros nesse arquivo.

---

## Tratamento de Erros

### Either Pattern

Use-cases retornam `Either<HTTPException, T>`:
- `Left` para erros (encapsula um `HTTPException`)
- `Right` para sucesso (encapsula o resultado)

### Error Handler Global

- **HTTPException**: retorna `{ message, code, cause }`
- **ZodError**: retorna `{ message: 'Invalid request', code: 400, cause: 'INVALID_PAYLOAD_FORMAT', errors }`
- **FST_ERR_VALIDATION**: retorna erros de validacao AJV
- **Erros genericos**: retorna `{ message: 'Internal server error', cause: 'SERVER_ERROR', code: 500 }`

---

## Documentacao da API

- **Swagger/OpenAPI**: gerado automaticamente via `@fastify/swagger`
- **Scalar**: interface grafica disponivel em `/documentation`
- **OpenAPI JSON**: disponivel no endpoint `/openapi.json`

---

## Padrao de Recursos (Resource Pattern)

Cada recurso da API segue um padrao consistente:

```
resources/<recurso>/<acao>/
  <acao>.controller.ts     # Controller com decorators
  <acao>.schema.ts         # Validacao Zod (body, params, query)
  <acao>.use-case.ts       # Logica de negocio com Either pattern
  <acao>.doc.ts            # Schema Fastify/Swagger para documentacao
  <acao>.use-case.spec.ts  # Teste unitario do use-case
  <acao>.controller.spec.ts # Teste e2e do controller
```

---

## Estrutura de Diretorios

```
backend/
  bin/                    # Ponto de entrada (server.ts)
  config/                 # Configuracoes (database.ts, email.ts)
  start/                  # Inicializacao (env.ts, kernel.ts)
  prisma/                 # Schema Prisma, migrations, seeders
    schema.prisma
    migrations/
    seeders/
  templates/              # Templates de email (EJS)
    email/
  application/            # Codigo principal
    core/                 # Nucleo: Either, HTTPException, entidades, DI
    middlewares/           # authentication, permissions
    repositories/         # 12 repositorios Prisma (contrato + implementacao)
    resources/            # 16 resources da API
    services/             # Servicos (email, storage)
    utils/                # Utilitarios (cookies, jwt)
  _types/                 # Declaracoes TypeScript (fastify-jwt.d.ts)
  _storage/               # Armazenamento de arquivos (servido em /storage/)
  generated/              # Cliente Prisma gerado
```

---

## Build e Desenvolvimento

| Comando | Descricao |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento com `--watch` e SWC |
| `npm run build` | Compila com `tsc -b` e empacota com `tsup` |
| `npm start` | Executa o build de producao |
| `npm run seed` | Executa os seeders do banco de dados |
| `npm test` | Executa todos os testes |
| `npm run test:unit` | Executa apenas testes unitarios |
| `npm run test:e2e` | Executa apenas testes e2e |
