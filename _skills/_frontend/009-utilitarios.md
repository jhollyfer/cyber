# Utilitarios

Documentacao das funcoes utilitarias do frontend MatisKraft.

**Arquivos-fonte:**
- `src/lib/utils.ts` -- Utilitario de classes CSS
- `src/lib/utils/access-permissions.ts` -- Controle de acesso a rotas
- `src/lib/utils/format-phone.ts` -- Formatacao de telefone brasileiro
- `src/lib/utils/format-price.ts` -- Formatacao de preco em BRL
- `src/lib/utils/get-changed-fields.ts` -- Deteccao de campos alterados (artesao)
- `src/lib/utils/get-curator-changed-fields.ts` -- Deteccao de campos alterados (curador)
- `src/lib/pdf-builder.ts` -- Classe geradora de PDF
- `src/lib/reports/` -- 7 geradores de relatorios

---

## 1. cn() -- Utilitario de Classes CSS

**Arquivo:** `src/lib/utils.ts`

Combina `clsx` com `tailwind-merge` para gerar strings de classe CSS sem conflitos.

```typescript
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>): string {
  return twMerge(clsx(inputs));
}
```

### Exemplos de Uso

```typescript
import { cn } from '@/lib/utils';

cn('px-4', 'py-2');
// => 'px-4 py-2'

cn('btn', isActive && 'btn-active', isDisabled && 'opacity-50');
// => 'btn btn-active' (se isActive=true, isDisabled=false)

cn('p-2 bg-red-500', 'p-4 bg-blue-500');
// => 'p-4 bg-blue-500' (ultimo vence)
```

---

## 2. Controle de Acesso a Rotas

**Arquivo:** `src/lib/utils/access-permissions.ts`

### ROLE_ROUTES

Mapeamento de role para as rotas permitidas.

```typescript
export const ROLE_ROUTES: Record<string, Array<LinkProps['to']>> = {
  ADMINISTRATOR: [
    '/administrator',
    '/administrator/artisans',
    '/administrator/artisan-update-requests',
    '/administrator/curators',
    '/administrator/cultural-content-requests',
    '/administrator/cultural-contents',
    '/administrator/pieces',
    '/administrator/piece-requests',
    '/profile',
  ],
  CURATOR: [
    '/curator',
    '/curator/artisans',
    '/curator/artisan-update-requests',
    '/curator/piece-requests',
    '/curator/pieces',
    '/curator/cultural-content-requests',
    '/curator/cultural-contents',
    '/profile',
  ],
  ARTISAN: [
    '/artisan',
    '/artisan/piece-requests',
    '/artisan/pieces',
    '/artisan/cultural-content-requests',
    '/artisan/cultural-contents',
    '/profile',
  ],
};
```

### ROLE_DEFAULT_ROUTE

Rota padrao (redirect) para cada role apos o login.

```typescript
export const ROLE_DEFAULT_ROUTE: Record<string, LinkProps['to']> = {
  ADMINISTRATOR: '/administrator',
  CURATOR: '/curator',
  ARTISAN: '/artisan',
};
```

### canAccessRoute

Verifica se uma role tem permissao para acessar uma rota.

```typescript
export function canAccessRoute(
  role: keyof typeof ROLE_ROUTES,
  route: string,
): boolean {
  return ROLE_ROUTES[role].includes(route);
}
```

---

## 3. Formatacao de Telefone

**Arquivo:** `src/lib/utils/format-phone.ts`

Formata numeros de telefone no formato brasileiro.

```typescript
export function formatPhoneNumber(value: string): string;
```

---

## 4. Formatacao de Preco

**Arquivo:** `src/lib/utils/format-price.ts`

Funcoes para formatar e parsear precos em Real brasileiro (BRL).

```typescript
export function formatPriceInput(value: string): string;
export function parsePriceInput(value: string): number;
```

---

## 5. Deteccao de Campos Alterados

### Para Artesaos

**Arquivo:** `src/lib/utils/get-changed-fields.ts`

Compara os dados atuais do artesao com os dados de uma solicitacao de atualizacao para identificar quais campos foram modificados.

```typescript
export function getChangedFields(request: IArtisanUpdateRequest): Array<{
  field: string;
  oldValue: string;
  newValue: string;
}>;
```

### Para Curadores

**Arquivo:** `src/lib/utils/get-curator-changed-fields.ts`

Mesma logica para solicitacoes de atualizacao de curador.

```typescript
export function getCuratorChangedFields(request: ICuratorUpdateRequest): Array<{
  field: string;
  oldValue: string;
  newValue: string;
}>;
```

---

## 6. PDFBuilder -- Geracao de Relatorios PDF

**Arquivo:** `src/lib/pdf-builder.ts`

Classe wrapper sobre `jsPDF` que facilita a construcao de relatorios PDF com formatacao consistente.

```typescript
import { jsPDF } from 'jspdf';

export class PDFBuilder {
  // Metodos para adicionar titulos, tabelas, texto, etc.
}
```

---

## 7. Geradores de Relatorios

**Diretorio:** `src/lib/reports/`

Cada arquivo exporta uma funcao que gera um relatorio PDF especifico usando `PDFBuilder`.

| Arquivo | Descricao |
|---------|-----------|
| `artisans-report.ts` | Relatorio de artesaos |
| `artisan-update-requests-report.ts` | Relatorio de solicitacoes de atualizacao de artesaos |
| `cultural-content-requests-report.ts` | Relatorio de solicitacoes de conteudos culturais |
| `cultural-contents-report.ts` | Relatorio de conteudos culturais |
| `curator-operations-report.ts` | Relatorio de operacoes do curador |
| `piece-requests-report.ts` | Relatorio de solicitacoes de pecas |
| `pieces-report.ts` | Relatorio de pecas |

---

## 8. Tabela Resumo

| Arquivo | Funcao/Classe | Descricao |
|---------|---------------|-----------|
| `utils.ts` | `cn(...inputs)` | Merge de classes CSS |
| `utils/access-permissions.ts` | `ROLE_ROUTES` | Rotas permitidas por role |
| `utils/access-permissions.ts` | `ROLE_DEFAULT_ROUTE` | Rota padrao por role |
| `utils/access-permissions.ts` | `canAccessRoute(role, route)` | Verifica acesso a rota |
| `utils/format-phone.ts` | `formatPhoneNumber(value)` | Formata telefone brasileiro |
| `utils/format-price.ts` | `formatPriceInput(value)` | Formata preco para exibicao |
| `utils/format-price.ts` | `parsePriceInput(value)` | Parseia preco formatado para numero |
| `utils/get-changed-fields.ts` | `getChangedFields(request)` | Campos alterados do artesao |
| `utils/get-curator-changed-fields.ts` | `getCuratorChangedFields(request)` | Campos alterados do curador |
| `pdf-builder.ts` | `PDFBuilder` | Classe geradora de PDF |
| `reports/*.ts` | 7 funcoes de relatorio | Geradores de relatorios PDF |
