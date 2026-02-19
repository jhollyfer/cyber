# Rotas do Artisan

Documentacao das rotas privadas do painel do artesao no MatisKraft.

**Diretorio base:** `frontend/src/routes/_private/artisan/`

---

## Visao Geral

O painel do artesao permite gerenciar suas pecas artesanais e conteudos culturais atraves de solicitacoes que sao revisadas por curadores ou administradores.

---

## Mapa de Rotas

| Rota | Arquivo | Descricao |
|------|---------|-----------|
| `/artisan` | `artisan/index.tsx` | Dashboard com boas-vindas e estatisticas |
| `/artisan/pieces` | `artisan/pieces.tsx` | Listagem de pecas do artesao |
| `/artisan/piece-requests` | `artisan/piece-requests.tsx` | Solicitacoes de pecas do artesao |
| `/artisan/cultural-contents` | `artisan/cultural-contents.tsx` | Conteudos culturais do artesao |
| `/artisan/cultural-content-requests` | `artisan/cultural-content-requests.tsx` | Solicitacoes de conteudos culturais |

---

## Dashboard (`/artisan`)

**Arquivo:** `artisan/index.tsx`

Pagina inicial do artesao exibindo:
- Mensagem de boas-vindas com nome do usuario (via `useProfile`)
- Estatisticas do artesao via componente `ArtisanStats`

---

## Gestao de Pecas

### Listagem (`/artisan/pieces`)

Lista as pecas pertencentes ao artesao logado. Exibe titulo, categoria, preco, imagens e status de solicitacoes pendentes.

### Solicitacoes (`/artisan/piece-requests`)

Lista as solicitacoes feitas pelo artesao (CREATE, UPDATE, DELETE). Permite criar novas solicitacoes para:
- Cadastrar nova peca
- Atualizar peca existente
- Solicitar exclusao de peca

Cada solicitacao inclui: titulo, descricao, materiais, simbolismo, tecnica, preco, parcelas, categoria e imagens.

---

## Gestao de Conteudos Culturais

### Listagem (`/artisan/cultural-contents`)

Lista conteudos culturais criados pelo artesao.

### Solicitacoes (`/artisan/cultural-content-requests`)

Lista solicitacoes de conteudos culturais feitas pelo artesao, permitindo criar, atualizar ou solicitar exclusao de conteudos. Cada conteudo possui secoes com subtitulo, texto, imagens e videos.
