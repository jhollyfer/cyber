# Rotas Publicas

Documentacao das rotas publicas do site MatisKraft, acessiveis sem autenticacao.

**Diretorio base:** `frontend/src/routes/_public/`

---

## Visao Geral

O site publico apresenta a plataforma MatisKraft para visitantes, exibindo artesaos, pecas artesanais, categorias e conteudos culturais. Utiliza **i18next** para internacionalizacao.

---

## Layout Publico

**Arquivo:** `_public/layout.tsx`

O layout publico inclui:
- **Navbar**: Barra de navegacao com links para as paginas publicas, componente `LanguageSwitcher` para troca de idioma, e itens traduzidos via i18n
- **Footer**: Rodape com informacoes do projeto

---

## Mapa de Rotas

| Rota | Arquivo | Descricao |
|------|---------|-----------|
| `/` (raiz publica) | `_public/index.tsx` | Pagina inicial (home) |
| `/artisans/*` | `_public/artisans/` | Artesaos |
| `/pieces/*` | `_public/pieces/` | Pecas artesanais |
| `/categories/*` | `_public/categories/` | Categorias |
| `/cultural-contents/*` | `_public/cultural-contents/` | Conteudos culturais |

---

## Pagina Inicial (`/`)

**Arquivo:** `_public/index.tsx`

A home page exibe:
- **Hero section**: Banner principal com chamada para acao
- **Categorias em destaque**: Grid de categorias de pecas
- **Pecas em destaque**: Galeria de pecas artesanais selecionadas
- **Secao Instagram**: Links para redes sociais
- **Secao de conteudos culturais**: Preview de conteudos culturais recentes

Toda a interface publica utiliza `useTranslation()` do `react-i18next` para textos traduzidos.

---

## Artesaos (`/artisans`)

Paginas para visualizacao publica dos artesaos da plataforma, com seus perfis, biografias e pecas associadas.

---

## Pecas (`/pieces`)

Paginas para visualizacao publica das pecas artesanais. Utiliza o tipo `IPiecePublic` que inclui dados parciais do artesao via `IPiecePublicArtisan`.

---

## Categorias (`/categories`)

Paginas para navegacao por categorias de pecas artesanais.

---

## Conteudos Culturais (`/cultural-contents`)

Paginas para visualizacao de conteudos culturais publicados, organizados em secoes (`ICulturalContentSection`) com texto, imagens e videos.

---

## Internacionalizacao

O site publico suporta multiplos idiomas via:
- **i18next**: Biblioteca de internacionalizacao
- **react-i18next**: Integracao com React via hook `useTranslation()`
- **LanguageSwitcher**: Componente na navbar para troca de idioma

```typescript
import { useTranslation } from 'react-i18next';

function HomePage() {
  const { t } = useTranslation();
  return <h1>{t('home.title')}</h1>;
}
```

---

## Componentes Publicos

| Componente | Descricao |
|------------|-----------|
| `Navbar` | Barra de navegacao com links e LanguageSwitcher |
| `Footer` | Rodape do site |
| `PieceCard` | Card de exibicao de peca artesanal |
| `LocationMap` | Mapa interativo (Leaflet) para localizacao de aldeias |
| `ScrollSpy` | Navegacao por scroll nas secoes da pagina |
