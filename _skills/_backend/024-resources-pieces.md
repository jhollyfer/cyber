# Recurso: Pieces

Listagem e detalhes de pecas artesanais. Endpoints autenticados para o painel e endpoints publicos para visitantes.

## Endpoints

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/pieces` | Opcional | ADMINISTRATOR, CURATOR, ARTISAN | Listar pecas (painel) |
| GET | `/pieces/:id` | Opcional | ADMINISTRATOR, CURATOR, ARTISAN | Detalhes da peca (painel) |
| GET | `/pieces/:id/public` | Nao | - | Detalhes da peca (publico) |

## Arquitetura

```
application/resources/pieces/
  find-all/
  piece-show/
  find-by-id-public/
```

## GET `/pieces` -- Listar pecas

- **Auth**: Opcional com PermissionMiddleware (CURATOR, ARTISAN, ADMINISTRATOR)
- **Query**: Paginacao (page, per_page)
- **Resposta 200**: Lista paginada de pecas com artesao, categoria e imagens
- **Observacao**: Para artesaos, retorna apenas as proprias pecas

## GET `/pieces/:id` -- Detalhes da peca (painel)

- **Auth**: Opcional com PermissionMiddleware
- **Params**: `id` (UUID da peca)
- **Resposta 200**: Peca completa com todas as relacoes
- **Erros**: 404 (peca nao encontrada)

## GET `/pieces/:id/public` -- Detalhes da peca (publico)

- **Auth**: Nenhuma
- **Params**: `id` (UUID da peca)
- **Resposta 200**: Peca com dados publicos (artesao, categoria, imagens)
- **Observacao**: Disponivel sem autenticacao para exibicao no site publico
