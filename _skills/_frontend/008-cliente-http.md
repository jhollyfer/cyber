# Cliente HTTP

Documentacao da camada de comunicacao HTTP do frontend MatisKraft, incluindo a instancia Axios, o QueryClient do TanStack Query e o provider de integracao.

**Arquivos-fonte:**
- `src/lib/api.ts` -- Instancia Axios configurada
- `src/lib/query-client.ts` -- Configuracao do QueryClient
- `src/integrations/tanstack-query/root-provider.tsx` -- Provider React
- `src/integrations/tanstack-query/devtools.tsx` -- DevTools (desenvolvimento)

---

## 1. Instancia Axios (API)

O arquivo `src/lib/api.ts` exporta uma instancia Axios pre-configurada utilizada em todas as chamadas HTTP da aplicacao.

### Configuracao

```typescript
import axios, { AxiosError } from 'axios';
import { env } from '@/env';

const API = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

| Propriedade | Valor | Descricao |
|-------------|-------|-----------|
| `baseURL` | `env.VITE_API_BASE_URL` | URL base da API (default: `http://localhost:4000`) |
| `withCredentials` | `true` | Envia cookies automaticamente (autenticacao via httpOnly cookies) |

**Nota:** O import usa `env` (minusculo), nao `Env`.

### Interceptors

#### Request Interceptor

Repassa a configuracao sem modificacao. Loga erros de requisicao no console.

```typescript
API.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  },
);
```

#### Response Interceptor

Trata erros 401 automaticamente: limpa o localStorage e recarrega a pagina (exceto para a rota de sign-in).

```typescript
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

**Importante:** O interceptor de 401 esta ATIVO. Quando uma requisicao retorna 401 (e nao e a rota de sign-in), o localStorage e limpo e a pagina e recarregada, efetivamente deslogando o usuario.

### Exemplo de Uso

```typescript
import { API } from '@/lib/api';
import type { Paginated, IArtisan } from '@/lib/entities';

// GET com tipagem
const response = await API.get<Paginated<IArtisan>>('/administrator/artisans', {
  params: { page: 1, per_page: 20 },
});

// POST
await API.post('/authentication/sign-in', {
  email: 'user@email.com',
  password: 'senha123',
});
```

### Tratamento de Erros

```typescript
import { API } from '@/lib/api';
import type { IHTTPExceptionError } from '@/lib/interfaces';
import { isAxiosError } from 'axios';

try {
  await API.post('/authentication/sign-in', payload);
} catch (error) {
  if (isAxiosError(error) && error.response) {
    const data = error.response.data as IHTTPExceptionError<unknown>;
    console.error(data.message);
    console.error(data.code);
  }
}
```

---

## 2. QueryClient

O arquivo `src/lib/query-client.ts` configura e exporta uma instancia do `QueryClient` do TanStack React Query.

### Configuracao

```typescript
import { QueryClient as Base } from '@tanstack/react-query';

export const QueryClient = new Base({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: true,
      staleTime: 60 * 60 * 1000, // 1 hora
    },
  },
});
```

### Opcoes Padrao

| Opcao | Valor | Descricao |
|-------|-------|-----------|
| `retry` | `false` | Nao re-tenta queries que falharam |
| `refetchOnWindowFocus` | `true` | Re-busca dados quando a janela ganha foco |
| `staleTime` | `3600000` (1h) | Dados sao considerados frescos por 1 hora |

---

## 3. TanStack Query Provider

O arquivo `src/integrations/tanstack-query/root-provider.tsx` fornece o provider React que disponibiliza o QueryClient para toda a arvore de componentes.

### Funcoes Exportadas

| Funcao | Retorno | Descricao |
|--------|---------|-----------|
| `getContext()` | `{ queryClient: QueryClient }` | Retorna o contexto com a instancia do QueryClient |
| `Provider` | `React.JSX.Element` | Componente wrapper que fornece o `QueryClientProvider` |

---

## 4. DevTools (Desenvolvimento)

O arquivo `src/integrations/tanstack-query/devtools.tsx` exporta a configuracao do painel de DevTools do TanStack Query.

---

## 5. Fluxo Completo de uma Requisicao

```
Componente React
    |
    v
useQuery / useMutation (TanStack Query)
    |
    v
Query Function (chama API)
    |
    v
API (instancia Axios)
    |-- baseURL: env.VITE_API_BASE_URL (http://localhost:4000)
    |-- withCredentials: true
    |-- Request Interceptor (pass-through)
    |
    v
Backend MatisKraft
    |
    v
Response Interceptor (401 -> clear + reload)
    |
    v
TanStack Query Cache (staleTime: 1h)
    |
    v
Componente React (re-render com dados)
```

---

## 6. Resumo da Arquitetura

| Camada | Arquivo | Responsabilidade |
|--------|---------|-----------------|
| HTTP Client | `src/lib/api.ts` | Instancia Axios com baseURL e cookies |
| Cache Layer | `src/lib/query-client.ts` | QueryClient com staleTime 1h, sem retry |
| React Integration | `src/integrations/tanstack-query/root-provider.tsx` | Provider e contexto para SSR |
| DevTools | `src/integrations/tanstack-query/devtools.tsx` | Painel de inspecao (dev only) |
| Tipos | `src/lib/entities.ts` | Tipagem das entidades |
| Interfaces | `src/lib/interfaces.ts` | Tipo de erro HTTP |
