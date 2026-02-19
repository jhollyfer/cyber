# Recurso: Reports e Stats

Relatorios e estatisticas do sistema, segmentados por role.

## Endpoints -- Reports

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/reports/artisans` | Sim | ADMINISTRATOR, CURATOR | Relatorio de artesaos |
| GET | `/reports/artisan-update-requests` | Sim | ADMINISTRATOR, CURATOR | Relatorio de solicitacoes de atualizacao |
| GET | `/reports/pieces` | Sim | ADMINISTRATOR, CURATOR | Relatorio de pecas |
| GET | `/reports/piece-requests` | Sim | ADMINISTRATOR, CURATOR | Relatorio de solicitacoes de pecas |
| GET | `/reports/cultural-contents` | Sim | ADMINISTRATOR, CURATOR | Relatorio de conteudos culturais |
| GET | `/reports/cultural-content-requests` | Sim | ADMINISTRATOR, CURATOR | Relatorio de solicitacoes de conteudos |
| GET | `/reports/curator-operations` | Sim | ADMINISTRATOR, CURATOR | Relatorio de operacoes de curadoria |

## Endpoints -- Stats

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/stats/administrator` | Sim | ADMINISTRATOR | Estatisticas do administrador |
| GET | `/stats/artisan` | Sim | ARTISAN | Estatisticas do artesao |
| GET | `/stats/curator` | Sim | CURATOR | Estatisticas do curador |

## Arquitetura -- Reports

```
application/resources/reports/
  artisans-report/
  artisan-update-requests-report/
  pieces-report/
  piece-requests-report/
  cultural-contents-report/
  cultural-content-requests-report/
  curator-operations-report/
```

## Arquitetura -- Stats

```
application/resources/stats/
  administrator-stats/
  artisan-stats/
  curator-stats/
```

## Reports

Todos os relatorios exigem `AuthenticationMiddleware({ optional: false })` e `PermissionMiddleware({ allowedRoles: [ERole.ADMINISTRATOR, ERole.CURATOR] })`.

### GET `/reports/artisans` -- Relatorio de artesaos

- **Query**: Filtros (status de aprovacao, aldeia, etc.)
- **Resposta 200**: Dados consolidados de artesaos

### GET `/reports/pieces` -- Relatorio de pecas

- **Query**: Filtros (categoria, artesao, periodo)
- **Resposta 200**: Dados consolidados de pecas

### GET `/reports/piece-requests` -- Relatorio de solicitacoes de pecas

- **Query**: Filtros (status, tipo, periodo)
- **Resposta 200**: Dados consolidados de solicitacoes

### GET `/reports/curator-operations` -- Operacoes de curadoria

- **Resposta 200**: Dados de operacoes realizadas por curadores (aprovacoes, rejeicoes, revisoes)

## Stats

Cada endpoint de estatisticas e restrito ao role especifico.

### GET `/stats/administrator` -- Estatisticas admin

- **Auth**: ADMINISTRATOR
- **Resposta 200**: Contagens gerais do sistema (artesaos, curadores, pecas, conteudos, solicitacoes pendentes)

### GET `/stats/artisan` -- Estatisticas artesao

- **Auth**: ARTISAN
- **Usa**: `request.user.sub` para filtrar dados do artesao autenticado
- **Resposta 200**: Pecas do artesao, solicitacoes pendentes, conteudos culturais

### GET `/stats/curator` -- Estatisticas curador

- **Auth**: CURATOR
- **Usa**: `request.user.sub` para filtrar dados do curador autenticado
- **Resposta 200**: Solicitacoes pendentes, aprovadas/rejeitadas pelo curador
