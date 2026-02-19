# Recurso: Piece Requests

Listagem e detalhes de solicitacoes de pecas. Artesaos criam solicitacoes (via recurso Artisans), curadores avaliam (via recurso Curators), e este recurso fornece consulta para todos os roles autenticados.

## Endpoints

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/piece-requests` | Sim | ADMINISTRATOR, CURATOR, ARTISAN | Listar solicitacoes de pecas |
| GET | `/piece-requests/:id` | Sim | ADMINISTRATOR, CURATOR, ARTISAN | Detalhes de solicitacao |

## Arquitetura

```
application/resources/piece-requests/
  piece-request-find-all/
  piece-request-show/
```

## GET `/piece-requests` -- Listar solicitacoes

- **Auth**: Obrigatoria (CURATOR, ARTISAN, ADMINISTRATOR)
- **Query**: Paginacao (page, per_page), filtros (status, type)
- **Resposta 200**: Lista paginada de solicitacoes com artesao, categoria e imagens
- **Observacao**: Para artesaos, retorna apenas as proprias solicitacoes. Curadores e administradores veem todas.

## GET `/piece-requests/:id` -- Detalhes

- **Auth**: Obrigatoria (CURATOR, ARTISAN, ADMINISTRATOR)
- **Params**: `id` (UUID da solicitacao)
- **Resposta 200**: Solicitacao completa com relacoes (artesao, categoria, curador, imagens, peca original se UPDATE/DELETE)
- **Erros**: 404 (nao encontrada)

## Modelo PieceRequest

| Campo | Descricao |
|---|---|
| `status` | PENDING, APPROVED, REJECTED, REVISION_REQUESTED |
| `type` | CREATE, UPDATE, DELETE |
| `piece_id` | Referencia a peca original (null para CREATE) |
| `curator_id` | Curador que avaliou (null enquanto PENDING) |
| `rejection_reason` | Motivo de rejeicao (preenchido pelo curador) |
| `revision_reason` | Motivo de revisao (preenchido pelo curador) |
| `update_reason` | Motivo de atualizacao (preenchido pelo artesao) |
| `deletion_reason` | Motivo de exclusao (preenchido pelo artesao) |
