# Recurso: Cultural Contents e Cultural Content Requests

Gerencia conteudos culturais e suas solicitacoes. Conteudos culturais sao artigos com secoes contendo texto, imagens e videos sobre a cultura indigena.

## Endpoints -- Cultural Contents

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/cultural-contents` | Sim | Todos | Listar conteudos culturais (painel) |
| GET | `/cultural-contents/:id` | Sim | Todos | Detalhes do conteudo (painel) |
| GET | `/cultural-contents/public` | Nao | - | Listar conteudos publicados (publico) |
| GET | `/cultural-contents/:id/public` | Nao | - | Detalhes do conteudo (publico) |

## Endpoints -- Cultural Content Requests

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/cultural-content-requests` | Sim | Todos | Listar solicitacoes |
| GET | `/cultural-content-requests/:id` | Sim | Todos | Detalhes de solicitacao |

## Arquitetura -- Cultural Contents

```
application/resources/cultural-contents/
  find-all/
  show/
  find-all-public/
  show-public/
```

## Arquitetura -- Cultural Content Requests

```
application/resources/cultural-content-requests/
  find-all/
  show/
```

## GET `/cultural-contents` -- Listar (painel)

- **Auth**: Obrigatoria (ADMINISTRATOR, CURATOR, ARTISAN)
- **Query**: Paginacao, filtros (status: DRAFT/PUBLISHED)
- **Resposta 200**: Lista paginada com categoria, autor e status
- **Observacao**: Para artesaos, pode filtrar por conteudos proprios

## GET `/cultural-contents/public` -- Listar (publico)

- **Auth**: Nenhuma
- **Resposta 200**: Apenas conteudos com status PUBLISHED
- **Observacao**: Endpoints publicos para exibicao no site

## GET `/cultural-content-requests` -- Listar solicitacoes

- **Auth**: Obrigatoria (todos os roles)
- **Query**: Paginacao, filtros (status, type)
- **Resposta 200**: Lista paginada de solicitacoes com artesao, categoria e curador

## Modelo CulturalContent

| Campo | Descricao |
|---|---|
| `title` | Titulo do conteudo |
| `sections` | JSON: `[{ subtitle?, text, images: [], videos: [] }]` |
| `status` | DRAFT ou PUBLISHED |
| `published_at` | Data de publicacao (null para DRAFT) |
| `category_id` | Categoria do conteudo |
| `author_id` | Autor (User) |

## Modelo CulturalContentRequest

| Campo | Descricao |
|---|---|
| `status` | PENDING, APPROVED, REJECTED, REVISION_REQUESTED |
| `type` | CREATE, UPDATE, DELETE |
| `cultural_content_id` | Referencia ao conteudo original (null para CREATE) |
| `rejection_reason` | Motivo de rejeicao |
| `revision_reason` | Motivo de revisao |
