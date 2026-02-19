# Autenticacao e Estado

Documentacao do sistema de autenticacao e gerenciamento de estado do frontend MatisKraft. Cobre o store Zustand de autenticacao (`src/stores/authentication.ts`), a configuracao de variaveis de ambiente com T3 Env (`src/env.ts`) e a instancia Axios (`src/lib/api.ts`).

---

## Visao Geral

O frontend utiliza uma arquitetura de autenticacao baseada em cookies httpOnly gerenciados pelo backend. O estado do usuario autenticado e mantido no cliente via Zustand com persistencia em localStorage, enquanto o token real de sessao e transportado automaticamente via cookies.

---

## Store de Autenticacao (Zustand)

**Arquivo:** `src/stores/authentication.ts`

O store e criado com `zustand` e utiliza o middleware `persist` para manter os dados entre recarregamentos de pagina.

### Tipo `Authenticated`

```ts
export type Authenticated = Pick<IUser, 'name' | 'email' | 'role'> & {
  sub: string;
};
```

| Campo  | Tipo                                       | Descricao                                      |
|--------|--------------------------------------------|-------------------------------------------------|
| `name` | `string`                                   | Nome do usuario autenticado                     |
| `email`| `string`                                   | Email do usuario autenticado                    |
| `role` | `'ADMINISTRATOR' \| 'ARTISAN' \| 'CURATOR'` | Papel do usuario                               |
| `sub`  | `string`                                   | ID unico do usuario (subject do JWT)            |

Os papeis disponiveis sao:

| Papel            | Descricao                |
|------------------|--------------------------|
| `ADMINISTRATOR`  | Administrador            |
| `CURATOR`        | Curador                  |
| `ARTISAN`        | Artesao                  |

### Tipo `AuthenticationStore`

```ts
type AuthenticationStore = {
  authenticated: Authenticated | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuthenticated: (authenticated: Authenticated | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  logout: () => void;
};
```

| Propriedade        | Tipo                                              | Descricao                                    |
|--------------------|---------------------------------------------------|----------------------------------------------|
| `authenticated`    | `Authenticated \| null`                           | Dados do usuario autenticado ou null         |
| `isAuthenticated`  | `boolean`                                         | Flag indicando se ha usuario logado          |
| `hasHydrated`      | `boolean`                                         | Flag indicando se o store foi reidratado     |
| `setAuthenticated` | `(authenticated: Authenticated \| null) => void`  | Define os dados do usuario autenticado       |
| `setHasHydrated`   | `(hasHydrated: boolean) => void`                  | Define o estado de hidratacao                |
| `logout`           | `() => void`                                      | Limpa o estado de autenticacao               |

### Implementacao Completa

```ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useAuthenticationStore = create<AuthenticationStore>()(
  persist(
    (set) => ({
      authenticated: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuthenticated: (authenticated) =>
        set({ authenticated, isAuthenticated: !!authenticated }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      logout: () => set({ authenticated: null, isAuthenticated: false }),
    }),
    {
      name: 'authentication-store',
      partialize: (state) => ({
        authenticated: state.authenticated,
        isAuthenticated: state.isAuthenticated,
      }),
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
```

### Persistencia

| Configuracao   | Valor                    | Descricao                                          |
|----------------|--------------------------|-----------------------------------------------------|
| `name`         | `'authentication-store'` | Chave usada no localStorage                         |
| `partialize`   | Funcao customizada       | Persiste apenas `authenticated` e `isAuthenticated`  |
| `storage`      | `localStorage`           | Armazena os dados no localStorage do navegador       |
| `onRehydrateStorage` | Callback            | Define `hasHydrated: true` apos reidratar do storage |

### Padrao hasHydrated

O campo `hasHydrated` e importante para evitar flash de conteudo nao-autenticado durante o SSR. O layout privado verifica `hasHydrated` antes de renderizar:

```typescript
const { hasHydrated } = useAuthenticationStore();
if (!hasHydrated) return null; // Aguarda hidratacao
```

---

## Configuracao de Ambiente (T3 Env)

**Arquivo:** `src/env.ts`

```ts
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    SERVER_URL: z.url().optional(),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
    VITE_API_BASE_URL: z.url().default('http://localhost:4000'),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
```

**Nota:** O export e `env` (minusculo). A URL padrao da API e `http://localhost:4000`.

---

## Instancia Axios (API)

**Arquivo:** `src/lib/api.ts`

```ts
import axios, { AxiosError } from 'axios';
import { env } from '@/env';

const API = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

### Interceptor de Resposta (401)

O interceptor de resposta esta ATIVO e trata erros 401 automaticamente:

```ts
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error instanceof AxiosError &&
      error.response?.data?.code === 401 &&
      error.config?.url !== '/authentication/sign-in'
    ) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  },
);
```

---

## Integracao com Cookies httpOnly

A autenticacao do MatisKraft utiliza um modelo hibrido:

1. **Backend:** Gerencia tokens JWT em cookies httpOnly (nao acessiveis via JavaScript)
2. **Frontend:** Armazena apenas dados de exibicao (nome, email, role) no Zustand/localStorage

A flag `withCredentials: true` na instancia Axios garante que o navegador envie automaticamente os cookies em todas as requisicoes.

---

## Fluxo Completo de Sign-In

```
1. Usuario preenche email e senha
2. Frontend chama useAuthenticationSignIn
3. Hook executa POST /authentication/sign-in com credenciais
4. Backend valida, define cookie httpOnly com JWT
5. Frontend faz GET /profile para obter dados do usuario
6. Componente chama setAuthenticated com dados do usuario
7. Zustand persiste estado no localStorage
8. Usuario e redirecionado para ROLE_DEFAULT_ROUTE[role]
```

### Exemplo de uso no componente:

```tsx
const auth = useAuthenticationStore();

const signIn = useAuthenticationSignIn({
  onSuccess(response) {
    auth.setAuthenticated({
      name: response.name,
      email: response.email,
      role: response.role,
      sub: response.id,
    });
    const route = ROLE_DEFAULT_ROUTE[response.role];
    router.navigate({ to: route, replace: true });
  },
});
```

---

## Fluxo Completo de Sign-Out

```
1. Usuario clica em sair
2. Frontend chama POST /authentication/sign-out
3. Backend invalida cookie httpOnly
4. Componente chama auth.logout()
5. Zustand limpa estado e atualiza localStorage
6. Usuario e redirecionado para pagina de login
```

---

## Estrutura de Arquivos

```
src/
  stores/
    authentication.ts       # Store Zustand com persistencia e hasHydrated
  env.ts                    # Configuracao T3 Env (export: env)
  lib/
    api.ts                  # Instancia Axios com withCredentials e interceptor 401
    entities.ts             # Tipos IUser, IArtisan, ICurator, etc.
  hooks/
    tanstack-query/
      use-authentication-sign-in.ts   # Hook de login
      use-profile.ts                  # Hook de perfil
```
