# Recurso: Curator

Acoes especificas do curador autenticado: solicitar atualizacao do proprio perfil e visualizar solicitacoes de atualizacao de artesaos.

## Endpoints

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| POST | `/curator/update-request` | Sim | CURATOR | Solicitar atualizacao de perfil |
| GET | `/curator/artisans/update-requests` | Sim | CURATOR | Listar solicitacoes de atualizacao de artesaos |

## Arquitetura

```
application/resources/curator/
  request-update/
  artisans/
    find-update-requests/
```

## POST `/curator/update-request` -- Solicitar atualizacao de perfil

- **Auth**: Obrigatoria (CURATOR)
- **Body**: Campos opcionais: `name`, `email`, `phone`, `bio`, `specialization`, `institution`, `academic_background`, `avatar_id`
- **Resposta 201**: CuratorUpdateRequest criada com status PENDING
- **Observacao**: A solicitacao e avaliada pelo ADMINISTRATOR (via `/administrator/curators/update-requests/:id`)

## GET `/curator/artisans/update-requests` -- Listar solicitacoes de artesaos

- **Auth**: Obrigatoria (CURATOR)
- **Query**: Paginacao (page, per_page), filtros (status)
- **Resposta 200**: Lista paginada de ArtisanUpdateRequests
- **Observacao**: Curadores podem visualizar solicitacoes de atualizacao de artesaos para avaliacao

## Diferenca entre `curator` e `curators`

- **`/curator/*`**: Acoes pessoais do curador (atualizar seu proprio perfil, ver solicitacoes)
- **`/curators/*`**: Acoes de curadoria (aprovar/rejeitar pecas, conteudos e solicitacoes)
