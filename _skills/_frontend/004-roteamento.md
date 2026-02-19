# Roteamento

## Visao Geral

O frontend utiliza **TanStack Router** com file-based routing. As rotas sao geradas automaticamente a partir da estrutura de diretorios em `src/routes/` e compiladas em `src/routeTree.gen.ts`.

---

## src/router.tsx

```typescript
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import * as TanstackQuery from './integrations/tanstack-query/root-provider';
import { routeTree } from './routeTree.gen';

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          {props.children}
        </TanstackQuery.Provider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};
```

### Configuracoes do Router

| Configuracao | Valor | Descricao |
|---|---|---|
| `routeTree` | Auto-gerado | Arvore de rotas do file-system |
| `defaultPreload` | `'intent'` | Pre-carrega rotas ao hover/focus |
| `Wrap` | TanStack Query Provider | Envolve toda a aplicacao |
| SSR Query | Habilitado | Hidratacao de queries no SSR |

---

## src/routes/__root.tsx

A rota raiz define o documento HTML base:

```typescript
export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [{ rel: 'stylesheet', href: '/src/styles.css' }],
  }),
  component: RootComponent,
});
```

O `RootComponent` renderiza:
- Documento HTML com `<Html lang="pt-br">`
- `<Head>` com meta tags
- `<Body>` com `<Outlet />` (conteudo da rota) e `<Toaster />` (sonner)

---

## Mapa de Rotas

### Rotas de Autenticacao

| Rota | Arquivo | Descricao |
|---|---|---|
| `/sign-in` | `_authentication/_sign-in/index.tsx` | Pagina de login |
| `/sign-up` | `_authentication/sign-up/index.tsx` | Pagina de cadastro |
| `/sign-up/success` | `_authentication/sign-up/success.tsx` | Sucesso no cadastro |

### Rotas Publicas (/_public)

| Rota | Arquivo | Descricao |
|---|---|---|
| `/` | `_public/index.tsx` | Pagina inicial (home) |
| `/artisans/*` | `_public/artisans/` | Artesaos |
| `/pieces/*` | `_public/pieces/` | Pecas artesanais |
| `/categories/*` | `_public/categories/` | Categorias |
| `/cultural-contents/*` | `_public/cultural-contents/` | Conteudos culturais |

### Rotas Privadas - Administrator (/_private/administrator)

| Rota | Arquivo | Descricao |
|---|---|---|
| `/administrator` | `administrator/index.tsx` | Dashboard admin |
| `/administrator/artisans` | `administrator/artisans.tsx` | Listagem de artesaos |
| `/administrator/artisan-update-requests` | `administrator/artisan-update-requests.tsx` | Solicitacoes de artesaos |
| `/administrator/curators` | `administrator/curators.tsx` | Listagem de curadores |
| `/administrator/curator-update-requests` | `administrator/curator-update-requests.tsx` | Solicitacoes de curadores |
| `/administrator/pieces` | `administrator/pieces.tsx` | Listagem de pecas |
| `/administrator/piece-requests` | `administrator/piece-requests.tsx` | Solicitacoes de pecas |
| `/administrator/cultural-contents` | `administrator/cultural-contents.tsx` | Conteudos culturais |
| `/administrator/cultural-content-requests` | `administrator/cultural-content-requests.tsx` | Solicitacoes de conteudos |

### Rotas Privadas - Curator (/_private/curator)

| Rota | Arquivo | Descricao |
|---|---|---|
| `/curator` | `curator/index.tsx` | Dashboard curador |
| `/curator/artisans` | `curator/artisans.tsx` | Artesaos |
| `/curator/artisan-update-requests` | `curator/artisan-update-requests.tsx` | Solicitacoes de artesaos |
| `/curator/pieces` | `curator/pieces.tsx` | Pecas |
| `/curator/piece-requests` | `curator/piece-requests.tsx` | Solicitacoes de pecas |
| `/curator/cultural-contents` | `curator/cultural-contents.tsx` | Conteudos culturais |
| `/curator/cultural-content-requests` | `curator/cultural-content-requests.tsx` | Solicitacoes de conteudos |

### Rotas Privadas - Artisan (/_private/artisan)

| Rota | Arquivo | Descricao |
|---|---|---|
| `/artisan` | `artisan/index.tsx` | Dashboard artesao |
| `/artisan/pieces` | `artisan/pieces.tsx` | Pecas do artesao |
| `/artisan/piece-requests` | `artisan/piece-requests.tsx` | Solicitacoes de pecas |
| `/artisan/cultural-contents` | `artisan/cultural-contents.tsx` | Conteudos culturais |
| `/artisan/cultural-content-requests` | `artisan/cultural-content-requests.tsx` | Solicitacoes de conteudos |

### Rotas Privadas - Compartilhadas

| Rota | Arquivo | Descricao |
|---|---|---|
| `/profile` | `profile/index.tsx` | Perfil do usuario |

---

## Convencoes de Roteamento

| Convencao | Exemplo | Significado |
|---|---|---|
| `_prefixo` | `_private`, `_authentication`, `_public` | Layout wrapper (nao aparece na URL) |
| `$param` | `$slug`, `$id` | Parametro dinamico |
| `index.tsx` | `artisans/index.tsx` | Rota padrao do diretorio |
| `layout.tsx` | `_private/layout.tsx` | Layout compartilhado (routeToken) |

---

## Preload Strategy

O router utiliza `defaultPreload: 'intent'`, o que significa que:
- Ao **hover** sobre um link, a rota e pre-carregada
- Ao **focar** em um link (teclado), a rota e pre-carregada
- Os dados da rota ficam em cache pelo TanStack Query (staleTime: 1h)
