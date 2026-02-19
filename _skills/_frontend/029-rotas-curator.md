# Rotas do Curator

Documentacao das rotas privadas do painel do curador no MatisKraft.

**Diretorio base:** `frontend/src/routes/_private/curator/`

---

## Visao Geral

O painel do curador permite revisar e gerenciar artesaos, pecas e conteudos culturais. O curador atua como intermediario entre os artesaos e o sistema, aprovando ou rejeitando solicitacoes.

---

## Mapa de Rotas

| Rota | Arquivo | Descricao |
|------|---------|-----------|
| `/curator` | `curator/index.tsx` | Dashboard com estatisticas |
| `/curator/artisans` | `curator/artisans.tsx` | Listagem de artesaos |
| `/curator/artisan-update-requests` | `curator/artisan-update-requests.tsx` | Solicitacoes de atualizacao de artesaos |
| `/curator/pieces` | `curator/pieces.tsx` | Listagem de pecas |
| `/curator/piece-requests` | `curator/piece-requests.tsx` | Solicitacoes de pecas |
| `/curator/cultural-contents` | `curator/cultural-contents.tsx` | Listagem de conteudos culturais |
| `/curator/cultural-content-requests` | `curator/cultural-content-requests.tsx` | Solicitacoes de conteudos culturais |

---

## Dashboard (`/curator`)

**Arquivo:** `curator/index.tsx`

Pagina inicial do curador exibindo:
- Estatisticas do curador via componente `CuratorStats`
- Dialogo para geracao de relatorio de operacoes via `DialogCuratorOperationsReport`

---

## Gestao de Artesaos

### Listagem (`/curator/artisans`)

Exibe lista de artesaos com informacoes como nome, etnia, aldeia e status de aprovacao. O curador pode visualizar detalhes dos artesaos.

### Solicitacoes de Atualizacao (`/curator/artisan-update-requests`)

Lista solicitacoes de atualizacao de perfil de artesaos pendentes de revisao. O curador pode aprovar ou rejeitar as alteracoes propostas.

---

## Gestao de Pecas

### Listagem (`/curator/pieces`)

Lista pecas disponiveis para curadoria, com titulo, artesao, categoria e preco.

### Solicitacoes (`/curator/piece-requests`)

Lista solicitacoes de pecas pendentes de revisao. O curador pode:
- Aprovar solicitacoes (CREATE, UPDATE, DELETE)
- Rejeitar solicitacoes com motivo
- Solicitar revisao ao artesao

---

## Gestao de Conteudos Culturais

### Listagem (`/curator/cultural-contents`)

Lista conteudos culturais com titulo, autor, categoria e status.

### Solicitacoes (`/curator/cultural-content-requests`)

Lista solicitacoes de conteudos culturais pendentes de revisao, com as mesmas acoes disponiveis (aprovar, rejeitar, solicitar revisao).
