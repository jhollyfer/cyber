# Recurso: Curators

Acoes de curadoria: aprovacao/rejeicao de solicitacoes de pecas e conteudos culturais, e criacao/edicao/exclusao direta de pecas e conteudos.

## Endpoints

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| POST | `/curators/pieces` | CURATOR | Criar peca diretamente |
| PATCH | `/curators/piece-requests/:id/create` | CURATOR | Aprovar/rejeitar criacao de peca |
| PATCH | `/curators/piece-requests/:id/update` | CURATOR | Aprovar/rejeitar atualizacao de peca |
| PATCH | `/curators/piece-requests/:id/delete` | CURATOR | Aprovar/rejeitar exclusao de peca |
| POST | `/curators/cultural-contents` | CURATOR | Criar conteudo cultural diretamente |
| PUT | `/curators/cultural-contents/:id` | CURATOR | Atualizar conteudo cultural |
| DELETE | `/curators/cultural-contents/:id` | CURATOR | Excluir conteudo cultural |
| PATCH | `/curators/cultural-content-requests/:id/create` | CURATOR | Aprovar/rejeitar criacao de conteudo |
| PATCH | `/curators/cultural-content-requests/:id/update` | CURATOR | Aprovar/rejeitar atualizacao de conteudo |
| PATCH | `/curators/cultural-content-requests/:id/delete` | CURATOR | Aprovar/rejeitar exclusao de conteudo |

## Arquitetura

```
application/resources/curators/
  piece-create/
  piece-request-create-approve/
  piece-request-update-approve/
  piece-request-delete-approve/
  cultural-content-create/
  cultural-content-update/
  cultural-content-delete/
  cultural-content-request-create-approve/
  cultural-content-request-update-approve/
  cultural-content-request-delete-approve/
```

Todos os endpoints exigem `AuthenticationMiddleware({ optional: false })` e `PermissionMiddleware({ allowedRoles: [ERole.CURATOR] })`.

## POST `/curators/pieces` -- Criar peca diretamente

- **Body**: `title`, `description`, `symbolism`, `technique`, `materials`, `price`, `installments`, `category_id`, `artisan_id`, `images[]`
- **Resposta 200**: Peca criada diretamente (sem passar por solicitacao)
- **Observacao**: Curadores podem criar pecas sem o fluxo de solicitacao

## PATCH `/curators/piece-requests/:id/create` -- Aprovar/rejeitar criacao

- **Params**: `id` (UUID da solicitacao)
- **Body**: `{ status: "APPROVED" | "REJECTED" | "REVISION_REQUESTED", rejection_reason?, revision_reason? }`
- **Resposta 200**: Solicitacao atualizada. Se aprovada, cria a peca automaticamente.
- **Observacao**: Quando aprovada, envia email ao artesao (template artisan-piece-relation)

## PATCH `/curators/piece-requests/:id/update` -- Aprovar/rejeitar atualizacao

- **Similar ao create**, mas ao aprovar atualiza a peca existente

## PATCH `/curators/piece-requests/:id/delete` -- Aprovar/rejeitar exclusao

- **Similar ao create**, mas ao aprovar realiza soft-delete da peca

## POST `/curators/cultural-contents` -- Criar conteudo diretamente

- **Body**: `title`, `sections` (JSON), `category_id`
- **Resposta**: Conteudo cultural criado

## PUT `/curators/cultural-contents/:id` -- Atualizar conteudo

- **Params**: `id`
- **Body**: Campos atualizados do conteudo

## DELETE `/curators/cultural-contents/:id` -- Excluir conteudo

- **Params**: `id`
- **Resposta 200**: Conteudo excluido (soft-delete)

## Aprovacao de Cultural Content Requests

Os endpoints PATCH para cultural-content-requests seguem o mesmo padrao das piece-requests: o curador pode aprovar, rejeitar ou solicitar revisao.
