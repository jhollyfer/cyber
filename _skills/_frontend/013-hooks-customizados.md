# Hooks Customizados

Documentacao dos hooks customizados do frontend MatisKraft que nao estao relacionados ao TanStack Query. Estes hooks fornecem funcionalidades utilitarias utilizadas em toda a aplicacao.

---

## Visao Geral

| Hook                  | Arquivo                              | Descricao                                          |
|-----------------------|--------------------------------------|----------------------------------------------------|
| `useDebouncedValue`   | `src/hooks/use-debounced-value.ts`   | Retorna valor com atraso (debounce)                |
| `useIsMobile`         | `src/hooks/use-mobile.ts`            | Detecta se o dispositivo e mobile                  |

---

## useDebouncedValue

**Arquivo:** `src/hooks/use-debounced-value.ts`

Hook generico que retorna uma versao "debounced" de qualquer valor. Util para evitar chamadas excessivas de API durante digitacao em campos de busca.

### Implementacao

```ts
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return (): void => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### API

| Parametro | Tipo     | Default | Descricao                              |
|-----------|----------|---------|----------------------------------------|
| `value`   | `T`      | -       | Valor original a ser debounced         |
| `delay`   | `number` | `300`   | Tempo de espera em milissegundos       |
| **Retorno** | `T`    | -       | Valor atualizado apos o delay          |

### Exemplo de Uso

```tsx
function SearchInput() {
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  // A query so dispara apos 300ms sem digitacao
  const { data } = useQuery({
    queryKey: ['artisans', debouncedSearch],
    queryFn: () => API.get('/administrator/artisans', {
      params: { search: debouncedSearch, page: 1, per_page: 20 },
    }),
  });

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Buscar artesaos..."
    />
  );
}
```

### Comportamento

1. O valor inicial e definido via `useState`
2. Quando `value` muda, um `setTimeout` e agendado
3. Se `value` muda novamente antes do `delay`, o timer anterior e cancelado (via cleanup do `useEffect`)
4. Apenas apos `delay` milissegundos sem mudancas, o `debouncedValue` e atualizado

---

## useIsMobile

**Arquivo:** `src/hooks/use-mobile.ts`

Hook que detecta se a viewport atual corresponde a um dispositivo mobile, utilizando a API `matchMedia` do navegador.

### Implementacao

```ts
import React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (): void => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return (): void => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
```

### API

| Parametro        | Tipo      | Descricao                                   |
|------------------|-----------|---------------------------------------------|
| **Retorno**      | `boolean` | `true` se a largura e menor que 768px       |

### Constantes

| Constante           | Valor | Descricao                              |
|---------------------|-------|----------------------------------------|
| `MOBILE_BREAKPOINT` | `768` | Largura maxima em pixels para mobile   |

### Comportamento

1. Estado inicial e `undefined` (renderizado como `false` via `!!`)
2. No mount, registra um listener `matchMedia` para `(max-width: 767px)`
3. Define o valor inicial com base na largura atual da janela
4. Atualiza automaticamente quando a janela e redimensionada cruzando o breakpoint
5. Remove o listener no unmount

### Exemplo de Uso

```tsx
function ResponsiveLayout() {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileNavigation />
  ) : (
    <DesktopSidebar />
  );
}
```

**Nota:** Este hook e utilizado internamente pelo componente `SidebarProvider` para alternar entre o sidebar desktop e o sheet mobile.

---

## Estrutura de Arquivos

```
src/hooks/
  use-debounced-value.ts      # Hook de debounce generico (default delay: 300ms)
  use-mobile.ts               # Deteccao de dispositivo mobile (breakpoint: 768px)
  tanstack-query/             # Hooks de TanStack Query (documentados em 012-hooks-query.md)
```
