# Recurso: Categories

Listagem publica de categorias e consulta de pecas e conteudos culturais por categoria. O CRUD de categorias e feito pelo recurso Administrator.

## Endpoints

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| GET | `/categories` | Opcional | Listar todas as categorias |
| GET | `/categories/:slug/pieces` | Nao | Pecas de uma categoria |
| GET | `/categories/:slug/cultural-contents` | Nao | Conteudos culturais de uma categoria |

## Arquitetura

```
application/resources/categories/
  find-all.controller.ts
  find-all.use-case.ts
  find-all.doc.ts
  pieces-by-category/
  cultural-contents-by-category/
```

## GET `/categories` -- Listar categorias

- **Auth**: Opcional (`AuthenticationMiddleware({ optional: true })`)
- **Resposta 200**: Array de categorias com imagem relacionada
- **Observacao**: Retorna apenas categorias ativas

## GET `/categories/:slug/pieces` -- Pecas por categoria

- **Auth**: Nenhuma
- **Params**: `slug` (slug da categoria, ex: `cestaria-e-trancados`)
- **Resposta 200**: Lista paginada de pecas da categoria com imagens e artesao

## GET `/categories/:slug/cultural-contents` -- Conteudos por categoria

- **Auth**: Nenhuma
- **Params**: `slug` (slug da categoria)
- **Resposta 200**: Lista paginada de conteudos culturais publicados da categoria
