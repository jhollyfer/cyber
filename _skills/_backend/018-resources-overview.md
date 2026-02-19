# Visao Geral dos Resources do Backend - MatisCraft

## Introducao

O backend do MatisCraft utiliza **Fastify 5** com **TypeScript** e **Prisma 7**, organizado em uma arquitetura modular baseada em *resources*. Cada resource representa uma funcionalidade do sistema e segue um padrao consistente de estrutura de arquivos e convencoes.

## Localizacao

```
backend/application/resources/
```

## Padrao por Operacao

Cada operacao dentro de um resource contem os seguintes arquivos:

```
resources/<recurso>/<acao>/
  <acao>.controller.ts       # Controller com decorators (@Controller, @POST, @GET, etc.)
  <acao>.schema.ts           # Validacao Zod (body, params, query)
  <acao>.use-case.ts         # Logica de negocio com Either pattern
  <acao>.doc.ts              # Schema Fastify/Swagger para documentacao
  <acao>.use-case.spec.ts    # Teste unitario do use-case
  <acao>.controller.spec.ts  # Teste e2e do controller
```

## Middlewares

Os middlewares sao aplicados via `options.onRequest` no decorator de metodo HTTP:

- **AuthenticationMiddleware**: Verifica JWT via cookie `accessToken`. `optional: true` permite acesso sem autenticacao.
- **PermissionMiddleware**: Verifica se o role do usuario esta em `allowedRoles` (ADMINISTRATOR, CURATOR, ARTISAN).

## Lista Completa de Resources (16)

### 1. `_root` -- Raiz

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| GET | `/` | Nao | Redireciona para `/documentation` |

---

### 2. `authentication` -- Autenticacao

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| POST | `/authentication/sign-in` | Nao | Login com email e senha |
| POST | `/authentication/sign-up` | Nao | Cadastro de artesao |
| POST | `/authentication/sign-out` | Sim | Logout (limpa cookies) |
| POST | `/authentication/refresh-token` | Sim | Renovar access token |

---

### 3. `administrator` -- Administrador

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| POST | `/administrator/artisans` | Sim | ADMINISTRATOR | Criar artesao |
| GET | `/administrator/artisans/:id` | Sim | ADMINISTRATOR | Buscar artesao por ID |
| DELETE | `/administrator/artisans/:id` | Sim | ADMINISTRATOR | Excluir artesao |
| PATCH | `/administrator/artisans/:id/approval` | Sim | ADMINISTRATOR | Aprovar/rejeitar cadastro |
| GET | `/administrator/artisans/update-requests` | Sim | ADMINISTRATOR | Listar solicitacoes de atualizacao |
| PUT | `/administrator/artisans/update-requests/:id` | Sim | ADMINISTRATOR | Aprovar/rejeitar solicitacao de atualizacao |
| GET | `/administrator/artisans/update-requests/:id` | Sim | ADMINISTRATOR | Ver detalhes de solicitacao |
| POST | `/administrator/categories` | Sim | ADMINISTRATOR | Criar categoria |
| PUT | `/administrator/categories/:id` | Sim | ADMINISTRATOR | Atualizar categoria |
| DELETE | `/administrator/categories/:id` | Sim | ADMINISTRATOR | Excluir categoria |
| POST | `/administrator/curators` | Sim | ADMINISTRATOR | Criar curador |
| GET | `/administrator/curators` | Sim | ADMINISTRATOR | Listar curadores |
| GET | `/administrator/curators/:id` | Sim | ADMINISTRATOR | Buscar curador por ID |
| DELETE | `/administrator/curators/:id` | Sim | ADMINISTRATOR | Excluir curador |
| GET | `/administrator/curators/update-requests` | Sim | ADMINISTRATOR | Listar solicitacoes de atualizacao de curadores |
| GET | `/administrator/curators/update-requests/:id` | Sim | ADMINISTRATOR | Ver detalhes de solicitacao de curador |
| PUT | `/administrator/curators/update-requests/:id` | Sim | ADMINISTRATOR | Aprovar/rejeitar solicitacao de curador |
| POST | `/administrator/update` | Sim | ADMINISTRATOR | Atualizar perfil do admin |

---

### 4. `artisans` -- Artesaos

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/artisans` | Opcional | - | Listar todos os artesaos |
| GET | `/artisans/:id` | Opcional | - | Buscar artesao por ID |
| GET | `/artisans/:id/public` | Nao | - | Buscar artesao (publico) |
| GET | `/artisans/:artisan_id/approved-pieces` | Nao | - | Pecas aprovadas do artesao |
| POST | `/artisans/update-request` | Sim | ARTISAN | Solicitar atualizacao de perfil |
| POST | `/artisans/request-create-piece` | Sim | ARTISAN | Solicitar criacao de peca |
| POST | `/artisans/request-update-piece` | Sim | ARTISAN | Solicitar atualizacao de peca |
| POST | `/artisans/request-delete-piece` | Sim | ARTISAN | Solicitar exclusao de peca |
| POST | `/artisans/request-create-cultural-content` | Sim | ARTISAN | Solicitar criacao de conteudo cultural |
| POST | `/artisans/request-update-cultural-content` | Sim | ARTISAN | Solicitar atualizacao de conteudo |
| POST | `/artisans/request-delete-cultural-content` | Sim | ARTISAN | Solicitar exclusao de conteudo |
| PUT | `/artisans/edit-piece-request` | Sim | ARTISAN | Editar solicitacao de peca (em revisao) |
| PUT | `/artisans/edit-cultural-content-request` | Sim | ARTISAN | Editar solicitacao de conteudo (em revisao) |

---

### 5. `categories` -- Categorias

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| GET | `/categories` | Opcional | Listar todas as categorias |
| GET | `/categories/:slug/pieces` | Nao | Pecas por categoria |
| GET | `/categories/:slug/cultural-contents` | Nao | Conteudos culturais por categoria |

---

### 6. `pieces` -- Pecas

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/pieces` | Opcional | Todos | Listar pecas (autenticado) |
| GET | `/pieces/:id` | Opcional | Todos | Detalhes da peca (autenticado) |
| GET | `/pieces/:id/public` | Nao | - | Detalhes da peca (publico) |

---

### 7. `piece-requests` -- Solicitacoes de Pecas

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/piece-requests` | Sim | Todos | Listar solicitacoes de pecas |
| GET | `/piece-requests/:id` | Sim | Todos | Detalhes de solicitacao |

---

### 8. `cultural-contents` -- Conteudos Culturais

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/cultural-contents` | Sim | Todos | Listar conteudos culturais |
| GET | `/cultural-contents/:id` | Sim | Todos | Detalhes do conteudo |
| GET | `/cultural-contents/public` | Nao | - | Listar conteudos (publico) |
| GET | `/cultural-contents/:id/public` | Nao | - | Detalhes do conteudo (publico) |

---

### 9. `cultural-content-requests` -- Solicitacoes de Conteudos

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/cultural-content-requests` | Sim | Todos | Listar solicitacoes |
| GET | `/cultural-content-requests/:id` | Sim | Todos | Detalhes de solicitacao |

---

### 10. `curators` -- Curadoria

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| POST | `/curators/pieces` | Sim | CURATOR | Criar peca diretamente |
| PATCH | `/curators/piece-requests/:id/create` | Sim | CURATOR | Aprovar/rejeitar criacao de peca |
| PATCH | `/curators/piece-requests/:id/update` | Sim | CURATOR | Aprovar/rejeitar atualizacao de peca |
| PATCH | `/curators/piece-requests/:id/delete` | Sim | CURATOR | Aprovar/rejeitar exclusao de peca |
| POST | `/curators/cultural-contents` | Sim | CURATOR | Criar conteudo cultural diretamente |
| PUT | `/curators/cultural-contents/:id` | Sim | CURATOR | Atualizar conteudo cultural |
| DELETE | `/curators/cultural-contents/:id` | Sim | CURATOR | Excluir conteudo cultural |
| PATCH | `/curators/cultural-content-requests/:id/create` | Sim | CURATOR | Aprovar/rejeitar criacao de conteudo |
| PATCH | `/curators/cultural-content-requests/:id/update` | Sim | CURATOR | Aprovar/rejeitar atualizacao de conteudo |
| PATCH | `/curators/cultural-content-requests/:id/delete` | Sim | CURATOR | Aprovar/rejeitar exclusao de conteudo |

---

### 11. `curator` -- Acoes do Curador

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| POST | `/curator/update-request` | Sim | CURATOR | Solicitar atualizacao de perfil |
| GET | `/curator/artisans/update-requests` | Sim | CURATOR | Listar solicitacoes de atualizacao de artesaos |

---

### 12. `profile` -- Perfil

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/profile` | Sim | Todos | Ver perfil do usuario autenticado |

---

### 13. `reports` -- Relatorios

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/reports/artisans` | Sim | ADMINISTRATOR, CURATOR | Relatorio de artesaos |
| GET | `/reports/artisan-update-requests` | Sim | ADMINISTRATOR, CURATOR | Relatorio de solicitacoes de atualizacao |
| GET | `/reports/pieces` | Sim | ADMINISTRATOR, CURATOR | Relatorio de pecas |
| GET | `/reports/piece-requests` | Sim | ADMINISTRATOR, CURATOR | Relatorio de solicitacoes de pecas |
| GET | `/reports/cultural-contents` | Sim | ADMINISTRATOR, CURATOR | Relatorio de conteudos culturais |
| GET | `/reports/cultural-content-requests` | Sim | ADMINISTRATOR, CURATOR | Relatorio de solicitacoes de conteudos |
| GET | `/reports/curator-operations` | Sim | ADMINISTRATOR, CURATOR | Relatorio de operacoes de curadoria |

---

### 14. `stats` -- Estatisticas

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/stats/administrator` | Sim | ADMINISTRATOR | Estatisticas do admin |
| GET | `/stats/artisan` | Sim | ARTISAN | Estatisticas do artesao |
| GET | `/stats/curator` | Sim | CURATOR | Estatisticas do curador |

---

### 15. `storage` -- Armazenamento

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| POST | `/storage` | Opcional | Upload de arquivo(s) |
| DELETE | `/storage/:id` | Opcional | Excluir arquivo |

---

### 16. `villages` -- Aldeias

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| GET | `/villages` | Opcional | Listar todas as aldeias |

---

## Convencoes de Nomenclatura

- **Arquivos**: `<operacao>.<tipo>.ts` (ex: `find-all.controller.ts`, `sign-in.schema.ts`)
- **Schemas Zod**: `<Resource><Operacao>BodySchema`, `<Resource><Operacao>ParamsValidator`, `<Resource><Operacao>QueryValidator`
- **Use Cases**: `<Resource><Operacao>UseCase` (ex: `SignInUseCase`, `ArtisanFindAllUseCase`)
- **Documentacao**: `<Resource><Operacao>DocumentationSchema`
- **Testes**: `*.controller.spec.ts` e `*.use-case.spec.ts`
