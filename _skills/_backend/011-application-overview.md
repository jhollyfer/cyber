# Visao Geral - Camada Application

A camada `application/` contem toda a logica de negocio do backend MatisCraft. Trata-se de uma aplicacao construida com **Fastify 5 + TypeScript + Prisma 7**, organizada em modulos com responsabilidades bem definidas.

## Estrutura de Diretorios

```
backend/application/
├── core/                  # Nucleo da aplicacao
│   ├── entities.ts        # Tipos, enums e interfaces TypeScript
│   ├── either.ts          # Padrao Either (Left/Right) para tratamento de erros
│   ├── exception.ts       # HTTPException com factory methods para todos os codigos HTTP
│   ├── di-registry.ts     # Registro de dependencias (DI container)
│   └── controllers.ts     # Auto-descoberta e carregamento de controllers
│
├── middlewares/            # Middlewares Fastify
│   ├── authentication.middleware.ts   # Autenticacao via JWT/cookies
│   └── permissions.middleware.ts      # Controle de acesso por roles
│
├── repositories/          # Camada de repositorios (12 repositorios)
│   ├── user/              # Contrato + Prisma + In-memory
│   ├── artisan/
│   ├── curator/
│   ├── village/
│   ├── category/
│   ├── piece/
│   ├── piece-request/
│   ├── cultural-content/
│   ├── cultural-content-request/
│   ├── artisan-update-request/
│   ├── curator-update-request/
│   └── storage/
│
├── resources/             # Endpoints da API organizados por feature
│   └── (*.controller.ts)  # Controllers auto-descobertos pelo loadControllers()
│
├── services/              # Servicos de infraestrutura
│   ├── storage.service.ts            # Upload e gerenciamento de arquivos
│   └── email/
│       ├── email-contract.service.ts        # Contrato abstrato
│       ├── nodemailer-email.service.ts      # Implementacao com Nodemailer
│       └── in-memory-email.service.ts       # Implementacao para testes
│
└── utils/                 # Utilitarios
    ├── jwt.utils.ts       # Criacao de tokens JWT (access + refresh)
    └── cookies.utils.ts   # Gerenciamento de cookies HTTP
```

## Padrao Arquitetural

A aplicacao segue um padrao em camadas com inversao de dependencias:

1. **Contratos abstratos** (`abstract class`) definem as interfaces dos repositorios
2. **Implementacoes Prisma** satisfazem os contratos para producao
3. **Implementacoes In-Memory** satisfazem os contratos para testes
4. **Registro DI** (`di-registry.ts`) conecta contratos a implementacoes via `fastify-decorators`

```typescript
// Exemplo do fluxo de dependencia
import { injectablesHolder } from 'fastify-decorators';

// Contrato abstrato
export abstract class UserContractRepository {
  abstract create(payload: UserCreatePayload): Promise<IUser>;
  abstract findBy(payload: UserFindByPayload): Promise<IUser | null>;
  // ...
}

// Registro no container DI
injectablesHolder.injectService(UserContractRepository, UserPrismaRepository);
```

## Fluxo de uma Requisicao

1. Requisicao HTTP chega ao Fastify
2. Middlewares sao executados (`AuthenticationMiddleware`, `PermissionMiddleware`)
3. Controller processa a requisicao via use case
4. Use case utiliza repositorios (injetados via DI) para acessar dados via Prisma
5. Resposta e retornada usando o padrao `Either<HTTPException, T>`

## Tecnologias Principais

| Tecnologia | Uso |
|---|---|
| Fastify 5 | Framework HTTP |
| fastify-decorators | Decorators para DI e controllers |
| Prisma 7 | ORM para PostgreSQL |
| @prisma/adapter-pg | Adaptador PostgreSQL para Prisma |
| TypeScript | Linguagem e tipagem estatica |
| sharp | Processamento de imagens |
| nodemailer | Envio de emails |
| @fastify/jwt (RS256) | Autenticacao JWT |
| zod | Validacao de schemas |
