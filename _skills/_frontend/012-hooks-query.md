# Hooks de Query

Documentacao dos hooks de query do frontend MatisKraft baseados no TanStack Query (React Query). Todos os hooks estao localizados em `src/hooks/tanstack-query/`.

---

## Visao Geral

O projeto define um conjunto conciso de hooks organizados por funcionalidade. Hooks de leitura utilizam `useQuery`, enquanto hooks de mutacao utilizam `useMutation`.

---

## Query Keys

**Arquivo:** `src/hooks/tanstack-query/_query-keys.ts`

O arquivo de query keys e simples, definindo apenas a chave para o perfil:

```typescript
export const queryKeys = {
  PROFILE: 'profile',
} as const;
```

---

## Hooks Disponiveis

### Autenticacao

| Hook | Arquivo | Tipo | Metodo HTTP | Endpoint | Descricao |
|------|---------|------|-------------|----------|-----------|
| `useAuthenticationSignIn` | `use-authentication-sign-in.ts` | Mutation | POST | `/authentication/sign-in` | Faz login |

**Detalhe do Sign-In:** O hook executa POST de login. Apos sucesso, o componente de sign-in manualmente faz GET `/profile` para obter os dados do usuario.

### Perfil

| Hook | Arquivo | Tipo | Metodo HTTP | Endpoint | Descricao |
|------|---------|------|-------------|----------|-----------|
| `useProfile` | `use-profile.ts` | Query | GET | `/profile` | Le perfil do usuario autenticado |

**Detalhe do `useProfile`:** A query so e habilitada quando o usuario esta autenticado.

```typescript
const authentication = useAuthenticationStore();
const isAuthenticated = Boolean(authentication.authenticated?.sub);

return useQuery({
  queryKey: [queryKeys.PROFILE],
  queryFn: async function () {
    const response = await API.get<IUser>('/profile');
    return response.data;
  },
  enabled: isAuthenticated,
});
```

### Solicitacoes de Atualizacao

| Hook | Arquivo | Tipo | Metodo HTTP | Endpoint | Descricao |
|------|---------|------|-------------|----------|-----------|
| `useArtisanUpdateRequest` | `use-artisan-update-request.ts` | Query | GET | `/administrator/artisans/update-requests/:id` | Le solicitacao de atualizacao de artesao |
| `useCuratorUpdateRequest` | `use-curator-update-request.ts` | Query | GET | `/administrator/curators/update-requests/:id` | Le solicitacao de atualizacao de curador |

---

## Resumo de Todos os Hooks

| # | Hook | Tipo | Endpoint |
|---|------|------|----------|
| 1 | `useAuthenticationSignIn` | Mutation | `POST /authentication/sign-in` |
| 2 | `useProfile` | Query | `GET /profile` |
| 3 | `useArtisanUpdateRequest` | Query | `GET /administrator/artisans/update-requests/:id` |
| 4 | `useCuratorUpdateRequest` | Query | `GET /administrator/curators/update-requests/:id` |

---

## Estrutura de Arquivos

```
src/hooks/tanstack-query/
  _query-keys.ts                          # Chave de cache (PROFILE)
  use-authentication-sign-in.ts           # Login
  use-artisan-update-request.ts           # Solicitacao artesao
  use-curator-update-request.ts           # Solicitacao curador
  use-profile.ts                          # Perfil do usuario
```
