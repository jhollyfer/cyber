# Layout Privado (`/_private`)

Documentacao do layout principal das rotas privadas do MatisKraft, responsavel por montar a estrutura visual autenticada com sidebar dinamica, header global e controle de acesso.

**Arquivo fonte:** `src/routes/_private/layout.tsx`

---

## Visao Geral

O layout privado (`/_private`) e o componente raiz para todas as rotas que exigem autenticacao. Ele encapsula:

- **Sidebar** com menus baseados no papel (role) do usuario
- **Header** global com busca condicional
- **Outlet** do TanStack Router para renderizar as rotas filhas
- **Guarda de autenticacao** com redirecionamento para login
- **Guarda de hidratacao** para evitar flash de conteudo

A rota e registrada usando `createFileRoute('/_private')` do TanStack Router.

---

## Implementacao

```tsx
import type { LinkProps } from '@tanstack/react-router';
import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router';
import React from 'react';

import { Header } from '@/components/common/header';
import { Sidebar } from '@/components/common/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getMenuByRole } from '@/lib/utils/menu';
import { useAuthenticationStore } from '@/stores/authentication';

export const Route = createFileRoute('/_private')({
  component: RouteComponent,
});

function RouteComponent(): React.JSX.Element | null {
  const authentication = useAuthenticationStore();

  const menu = getMenuByRole(authentication.authenticated?.role);

  const routesWithoutSearchInput: Array<LinkProps['to']> = [
    '/administrator',
    '/artisan',
    '/profile',
    '/curator',
  ];

  if (!authentication.hasHydrated) {
    return null;
  }

  if (!authentication.isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <SidebarProvider>
      <Sidebar menu={menu} />
      <SidebarInset className="relative flex flex-col h-screen w-screen overflow-hidden flex-1 px-4 sm:px-2">
        <Header routesWithoutSearchInput={routesWithoutSearchInput} />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

## Guarda de Autenticacao

O componente utiliza duas verificacoes sequenciais:

### 1. Hidratacao do Store

```tsx
if (!authentication.hasHydrated) {
  return null;
}
```

O campo `hasHydrated` do Zustand store indica se o estado foi reidratado do localStorage. Retornar `null` antes da hidratacao evita flash de conteudo nao-autenticado durante o SSR.

### 2. Autenticacao

```tsx
if (!authentication.isAuthenticated) {
  return <Navigate to="/sign-in" />;
}
```

Se o usuario nao esta autenticado, e redirecionado para a pagina de login via `<Navigate />` do TanStack Router.

---

## Construcao da Sidebar

A sidebar e construida pela funcao `getMenuByRole(role)` (de `src/lib/utils/menu.ts`) que retorna menus estaticos baseados no papel do usuario.

### Menus por Role

| Role | Grupos de Menu |
|------|----------------|
| `ADMINISTRATOR` | Menu, Gestao de Artesaos, Gerenciamento de Usuarios, Gestao de Pecas, Gestao de Conteudos, Conta |
| `CURATOR` | Menu, Gestao de Artesaos, Gestao de Pecas, Gestao de Conteudos, Conta |
| `ARTISAN` | Menu, Gestao de Pecas, Gestao de Conteudos, Conta |

Os menus detalhados de cada role estao documentados em `010-menu.md`.

---

## Header Global com Busca Condicional

O `Header` recebe uma lista de rotas onde o campo de busca **nao** deve ser exibido:

```tsx
const routesWithoutSearchInput: Array<LinkProps['to']> = [
  '/administrator',
  '/artisan',
  '/profile',
  '/curator',
];
```

Nas rotas de dashboard (`/administrator`, `/artisan`, `/curator`) e na pagina de perfil (`/profile`), o campo de busca e ocultado.

---

## Estrutura do Layout

O layout utiliza o sistema de `SidebarProvider` com `SidebarInset`:

```
+---------------------------------------------------+
|                 SidebarProvider                     |
| +----------+------------------------------------+  |
| |          |         SidebarInset               |  |
| | Sidebar  | +--------------------------------+ |  |
| |          | |     Header (busca condicional)  | |  |
| | (menu    | +--------------------------------+ |  |
| |  por     | |                                | |  |
| |  role)   | |     Outlet (rota filha ativa)  | |  |
| |          | |                                | |  |
| |          | +--------------------------------+ |  |
| +----------+------------------------------------+  |
+---------------------------------------------------+
```

| Componente       | Responsabilidade                                      |
|-----------------|------------------------------------------------------|
| `SidebarProvider`| Contexto global para estado da sidebar (aberta/fechada) |
| `Sidebar`       | Navegacao lateral com menus por role                   |
| `SidebarInset`  | Area principal de conteudo (ocupa o espaco restante)   |
| `Header`        | Barra superior com busca condicional                   |
| `Outlet`        | Renderiza a rota filha ativa                          |

---

## Dependencias

| Dependencia                  | Uso                                    |
|-----------------------------|----------------------------------------|
| `@tanstack/react-router`   | Roteamento (createFileRoute, Outlet, Navigate) |
| `useAuthenticationStore`    | Zustand store para dados de autenticacao |
| `getMenuByRole`            | Funcao que retorna menus estaticos por role |
| `SidebarProvider/SidebarInset` | Componentes UI do sistema de sidebar |

---

## Fluxo Resumido

1. O usuario acessa uma rota `/_private/*`
2. O layout verifica `hasHydrated` no store (aguarda reidratacao)
3. O layout verifica `isAuthenticated` no store (redireciona para `/sign-in` se nao autenticado)
4. Se autenticado, chama `getMenuByRole(role)` para obter os menus
5. A sidebar e renderizada com os menus do role do usuario
6. O header e renderizado com controle condicional da busca
7. A rota filha e renderizada no `<Outlet />`
