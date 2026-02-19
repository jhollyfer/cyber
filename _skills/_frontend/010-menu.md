# Sistema de Menu

Documentacao do sistema de menus do frontend MatisKraft, incluindo tipos de rotas, menus por role e controle de acesso.

**Arquivos-fonte:**
- `src/lib/entities.ts` -- Tipos de rotas do menu (MenuRoute, MenuItem, etc.)
- `src/lib/utils/menu.ts` -- Menus por role
- `src/lib/utils/access-permissions.ts` -- Controle de acesso a rotas

---

## 1. Tipos de Rota do Menu

Os tipos de menu sao definidos em `src/lib/entities.ts`.

### Hierarquia de Tipos

```
MenuRoute (Array<MenuGroupItem>)
  |
  +-- MenuGroupItem
        |-- title: string
        |-- items: Array<MenuItem>
              |
              +-- MenuItem = CollapsibleItem | LinkItem
                    |
                    +-- LinkItem (link direto)
                    |     |-- url: LinkProps['to']
                    |
                    +-- CollapsibleItem (submenu expansivel)
                          |-- items: Array<{ url, title, ... }>
```

### MenuRouteBaseItem

```typescript
export interface MenuRouteBaseItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}
```

### LinkItem

```typescript
export type LinkItem = MenuRouteBaseItem & {
  url: LinkProps['to'];
  items?: never;
};
```

### CollapsibleItem

```typescript
export type CollapsibleItem = MenuRouteBaseItem & {
  items: Array<MenuRouteBaseItem & { url: LinkProps['to'] }>;
  url?: LinkProps['to'];
};
```

### MenuItem, MenuGroupItem, MenuRoute

```typescript
export type MenuItem = CollapsibleItem | LinkItem;

export type MenuGroupItem = {
  title: string;
  items: Array<MenuItem>;
};

export type MenuRoute = Array<MenuGroupItem>;
```

---

## 2. Menus por Role

**Arquivo:** `src/lib/utils/menu.ts`

A funcao `getMenuByRole` retorna os menus conforme a role do usuario logado.

### Assinatura

```typescript
export const getMenuByRole = (role?: string): MenuRoute => { ... };
```

### ADMINISTRATOR

| Grupo | Itens | URLs |
|-------|-------|------|
| Menu | Inicio | `/administrator` |
| Gestao de Artesaos | Artesoes | `/administrator/artisans` |
| Gestao de Artesaos | Solicitacoes | `/administrator/artisan-update-requests` |
| Gerenciamento de Usuarios | Curadores | `/administrator/curators` |
| Gerenciamento de Usuarios | Solicitacoes | `/administrator/curator-update-requests` |
| Gestao de Pecas | Solicitacoes | `/administrator/piece-requests` |
| Gestao de Pecas | Pecas | `/administrator/pieces` |
| Gestao de Conteudos | Solicitacoes | `/administrator/cultural-content-requests` |
| Gestao de Conteudos | Conteudos Culturais | `/administrator/cultural-contents` |
| Conta | Meu Perfil | `/profile` |

### CURATOR

| Grupo | Itens | URLs |
|-------|-------|------|
| Menu | Inicio | `/curator` |
| Gestao de Artesaos | Artesoes | `/curator/artisans` |
| Gestao de Artesaos | Solicitacoes | `/curator/artisan-update-requests` |
| Gestao de Pecas | Solicitacoes | `/curator/piece-requests` |
| Gestao de Pecas | Pecas | `/curator/pieces` |
| Gestao de Conteudos | Solicitacoes | `/curator/cultural-content-requests` |
| Gestao de Conteudos | Conteudos Culturais | `/curator/cultural-contents` |
| Conta | Meu Perfil | `/profile` |

### ARTISAN

| Grupo | Itens | URLs |
|-------|-------|------|
| Menu | Inicio | `/artisan` |
| Gestao de Pecas | Solicitacoes | `/artisan/piece-requests` |
| Gestao de Pecas | Pecas | `/artisan/pieces` |
| Gestao de Conteudos | Solicitacoes | `/artisan/cultural-content-requests` |
| Gestao de Conteudos | Conteudos Culturais | `/artisan/cultural-contents` |
| Conta | Meu Perfil | `/profile` |

### Comparativo de Acesso

| Funcionalidade | ADMINISTRATOR | CURATOR | ARTISAN |
|----------------|---------------|---------|---------|
| Gestao de Artesaos | Sim | Sim | -- |
| Gestao de Curadores | Sim | -- | -- |
| Solicitacoes de Pecas | Sim | Sim | Sim |
| Pecas | Sim | Sim | Sim |
| Solicitacoes de Conteudos | Sim | Sim | Sim |
| Conteudos Culturais | Sim | Sim | Sim |
| Perfil | Sim | Sim | Sim |

### Icones Utilizados

| Item | Icone (Lucide) |
|------|---------------|
| Inicio | `HomeIcon` |
| Artesoes | `UsersIcon` |
| Solicitacoes | `ClipboardListIcon` ou `ShoppingBagIcon` |
| Pecas | `PuzzleIcon` |
| Conteudos Culturais | `BookOpenIcon` |
| Meu Perfil | `UserIcon` |

---

## 3. Controle de Acesso a Rotas

**Arquivo:** `src/lib/utils/access-permissions.ts`

### ROLE_ROUTES

```typescript
export const ROLE_ROUTES: Record<string, Array<LinkProps['to']>> = {
  ADMINISTRATOR: [
    '/administrator', '/administrator/artisans',
    '/administrator/artisan-update-requests', '/administrator/curators',
    '/administrator/cultural-content-requests', '/administrator/cultural-contents',
    '/administrator/pieces', '/administrator/piece-requests', '/profile',
  ],
  CURATOR: [
    '/curator', '/curator/artisans', '/curator/artisan-update-requests',
    '/curator/piece-requests', '/curator/pieces',
    '/curator/cultural-content-requests', '/curator/cultural-contents', '/profile',
  ],
  ARTISAN: [
    '/artisan', '/artisan/piece-requests', '/artisan/pieces',
    '/artisan/cultural-content-requests', '/artisan/cultural-contents', '/profile',
  ],
};
```

### ROLE_DEFAULT_ROUTE

```typescript
export const ROLE_DEFAULT_ROUTE: Record<string, LinkProps['to']> = {
  ADMINISTRATOR: '/administrator',
  CURATOR: '/curator',
  ARTISAN: '/artisan',
};
```

### canAccessRoute

```typescript
export function canAccessRoute(
  role: keyof typeof ROLE_ROUTES,
  route: string,
): boolean {
  return ROLE_ROUTES[role].includes(route);
}
```

---

## 4. Fluxo de Navegacao

```
1. Usuario faz login
   |
2. Backend retorna role no cookie JWT
   |
3. Frontend chama getMenuByRole(role)
   |-- Retorna MenuRoute completa para o role
   |
4. Sidebar renderiza o menu
   |
5. Ao navegar, canAccessRoute(role, rota) verifica permissao
   |
6. Se nao tem acesso: redirect para ROLE_DEFAULT_ROUTE[role]
```
