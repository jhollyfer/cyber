# Rotas do Administrator

Documentacao das rotas privadas do painel de administracao do MatisKraft.

**Diretorio base:** `frontend/src/routes/_private/administrator/`

---

## Visao Geral

O painel do administrador possui acesso total ao sistema, incluindo gestao de artesaos, curadores, pecas, conteudos culturais e todas as solicitacoes associadas.

---

## Mapa de Rotas

| Rota | Arquivo | Descricao |
|------|---------|-----------|
| `/administrator` | `administrator/index.tsx` | Dashboard com estatisticas |
| `/administrator/artisans` | `administrator/artisans.tsx` | Listagem de artesaos |
| `/administrator/artisan-update-requests` | `administrator/artisan-update-requests.tsx` | Solicitacoes de atualizacao de artesaos |
| `/administrator/curators` | `administrator/curators.tsx` | Listagem de curadores |
| `/administrator/curator-update-requests` | `administrator/curator-update-requests.tsx` | Solicitacoes de atualizacao de curadores |
| `/administrator/pieces` | `administrator/pieces.tsx` | Listagem de pecas |
| `/administrator/piece-requests` | `administrator/piece-requests.tsx` | Solicitacoes de pecas |
| `/administrator/cultural-contents` | `administrator/cultural-contents.tsx` | Listagem de conteudos culturais |
| `/administrator/cultural-content-requests` | `administrator/cultural-content-requests.tsx` | Solicitacoes de conteudos culturais |

---

## Dashboard (`/administrator`)

**Arquivo:** `administrator/index.tsx`

Pagina inicial do administrador exibindo estatisticas gerais do sistema via componentes `AdministratorStats` e `StatCards`, alem de cards de pendencias (`PendingCards`).

---

## Gestao de Artesaos

### Listagem (`/administrator/artisans`)

Exibe lista paginada de artesaos com informacoes como nome, etnia, aldeia, status de aprovacao e contagem de pecas.

### Solicitacoes de Atualizacao (`/administrator/artisan-update-requests`)

Lista solicitacoes de atualizacao de perfil de artesaos. Cada solicitacao pode ter status: `PENDING`, `APPROVED` ou `REJECTED`. O administrador pode aprovar ou rejeitar solicitacoes, visualizando os campos que foram alterados via `getChangedFields()`.

---

## Gestao de Curadores

### Listagem (`/administrator/curators`)

Exibe lista paginada de curadores com informacoes como nome, especializacao, instituicao e status.

### Solicitacoes de Atualizacao (`/administrator/curator-update-requests`)

Lista solicitacoes de atualizacao de perfil de curadores. Funcionalidade similar as solicitacoes de artesaos, usando `getCuratorChangedFields()`.

---

## Gestao de Pecas

### Listagem (`/administrator/pieces`)

Lista todas as pecas do sistema com titulo, artesao, categoria, preco e imagens. Suporta dialogo de geracao de relatorio PDF via `DialogPiecesReport`.

### Solicitacoes (`/administrator/piece-requests`)

Lista solicitacoes de criacao, atualizacao e exclusao de pecas. Status possiveis: `PENDING`, `APPROVED`, `REJECTED`, `REVISION_REQUESTED`. Tipos: `CREATE`, `UPDATE`, `DELETE`.

---

## Gestao de Conteudos Culturais

### Listagem (`/administrator/cultural-contents`)

Lista conteudos culturais com titulo, autor, categoria e status de publicacao (`DRAFT` ou `PUBLISHED`).

### Solicitacoes (`/administrator/cultural-content-requests`)

Lista solicitacoes de conteudos culturais com status e tipos similares aos de pecas.

---

## Relatorios PDF

O painel do administrador disponibiliza dialogos para geracao de relatorios em PDF:

| Dialogo | Relatorio |
|---------|-----------|
| `DialogArtisansReport` | Relatorio de artesaos |
| `DialogArtisanUpdateRequestsReport` | Relatorio de solicitacoes de artesaos |
| `DialogPiecesReport` | Relatorio de pecas |
| `DialogPieceRequestsReport` | Relatorio de solicitacoes de pecas |
| `DialogCulturalContentsReport` | Relatorio de conteudos culturais |
| `DialogCulturalContentRequestsReport` | Relatorio de solicitacoes de conteudos |
| `DialogCuratorOperationsReport` | Relatorio de operacoes de curadores |
