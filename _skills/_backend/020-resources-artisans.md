# Recurso: Artisans

Gerencia a listagem publica de artesaos, pecas aprovadas e acoes do artesao autenticado (solicitacoes de pecas, conteudos culturais e atualizacao de perfil).

## Endpoints

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/artisans` | Opcional | - | Listar artesaos |
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
| PUT | `/artisans/edit-piece-request` | Sim | ARTISAN | Editar solicitacao de peca (revisao) |
| PUT | `/artisans/edit-cultural-content-request` | Sim | ARTISAN | Editar solicitacao de conteudo (revisao) |

## Arquitetura

```
application/resources/artisans/
  find-all/
  find-one/
  find-by-id-public/
  approved-pieces/
  request-update/
  request-create-piece/
  request-update-piece/
  request-delete-piece/
  request-create-cultural-content/
  request-update-cultural-content/
  request-delete-cultural-content/
  edit-piece-request/
  edit-cultural-content-request/
```

## GET `/artisans` -- Listar artesaos

- **Auth**: Opcional (`AuthenticationMiddleware({ optional: true })`)
- **Query**: Paginacao (page, per_page), busca (search)
- **Resposta 200**: Lista paginada de artesaos com dados de user, village e avatar

## GET `/artisans/:id` -- Buscar artesao

- **Auth**: Opcional
- **Params**: `id` (UUID do artesao)
- **Resposta 200**: Artesao completo com relacoes

## GET `/artisans/:artisan_id/approved-pieces` -- Pecas aprovadas

- **Auth**: Nenhuma
- **Params**: `artisan_id` (UUID do artesao)
- **Query**: Paginacao
- **Resposta 200**: Lista paginada de pecas aprovadas do artesao

## POST `/artisans/update-request` -- Solicitar atualizacao de perfil

- **Auth**: Obrigatoria (ARTISAN)
- **Body**: Campos opcionais: `name`, `email`, `bio`, `phone`, `avatar_id`
- **Resposta 201**: ArtisanUpdateRequest criada com status PENDING
- **Erros**: 400 (validacao), 401 (nao autenticado), 403 (nao e artesao)

## POST `/artisans/request-create-piece` -- Solicitar criacao de peca

- **Auth**: Obrigatoria (ARTISAN)
- **Body**: `title`, `description`, `symbolism`, `technique`, `materials`, `price`, `installments`, `category_id`, `images[]` (array de storage IDs)
- **Resposta 200**: PieceRequest criada com status PENDING e type CREATE
- **Erros**: 400 (validacao), 401 (nao autenticado), 403 (nao e artesao)

## POST `/artisans/request-update-piece` -- Solicitar atualizacao de peca

- **Auth**: Obrigatoria (ARTISAN)
- **Body**: Similar ao create, mais `piece_id` e `update_reason`
- **Resposta 200**: PieceRequest com type UPDATE

## POST `/artisans/request-delete-piece` -- Solicitar exclusao de peca

- **Auth**: Obrigatoria (ARTISAN)
- **Body**: `piece_id`, `deletion_reason`
- **Resposta 200**: PieceRequest com type DELETE

## POST `/artisans/request-create-cultural-content` -- Solicitar conteudo cultural

- **Auth**: Obrigatoria (ARTISAN)
- **Body**: `title`, `sections` (JSON), `category_id`
- **Resposta 200**: CulturalContentRequest com type CREATE

## PUT `/artisans/edit-piece-request` -- Editar solicitacao em revisao

- **Auth**: Obrigatoria (ARTISAN)
- **Descricao**: Permite ao artesao editar uma solicitacao que recebeu status REVISION_REQUESTED
