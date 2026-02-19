# Estilos e Temas

## Visao Geral

O frontend utiliza **Tailwind CSS v4** com CSS variables em formato **hexadecimal** para cores. O tema suporta **dark mode** via `next-themes` com a classe `.dark`. O projeto usa duas fontes customizadas: **Mazurquica** (titulos) e **Ubuntu** (texto corrido).

---

## src/styles.css

### Imports

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));
```

| Import | Funcao |
|---|---|
| `tailwindcss` | Framework CSS utility-first |
| `tw-animate-css` | Animacoes pre-definidas |
| `@custom-variant dark` | Variante dark mode baseada em classe |

---

## Fontes Customizadas

O projeto define duas familias de fontes via `@font-face`:

### Mazurquica (Fonte Primaria - Titulos)

| Peso | Arquivo | Uso |
|------|---------|-----|
| 300 (Light) | `Mazurquica-Liviana.otf` | Titulos leves |
| 500 (Medium) | `Mazurquica-Media.otf` | Titulos medios |
| 700 (Bold) | `Mazurquica-Pesada.otf` | Titulos principais |

### Ubuntu (Fonte Secundaria - Texto)

| Peso | Estilo | Arquivo |
|------|--------|---------|
| 300 | Normal | `Ubuntu-Light.ttf` |
| 300 | Italic | `Ubuntu-LightItalic.ttf` |
| 400 | Normal | `Ubuntu-Regular.ttf` |
| 400 | Italic | `Ubuntu-Italic.ttf` |
| 500 | Normal | `Ubuntu-Medium.ttf` |
| 500 | Italic | `Ubuntu-MediumItalic.ttf` |
| 700 | Normal | `Ubuntu-Bold.ttf` |
| 700 | Italic | `Ubuntu-BoldItalic.ttf` |

### Mapeamento Tailwind

```css
@theme inline {
  --font-sans: 'Ubuntu', ui-sans-serif, system-ui, sans-serif;
  --font-heading: 'Mazurquica', ui-serif, Georgia, serif;
}
```

Classes utilitarias:
- `.font-heading` -- Mazurquica Bold (titulos)
- `.font-body` -- Ubuntu Regular (texto corrido)
- `.font-body-medium` -- Ubuntu Medium (destaques)

---

## Paleta de Cores Matis

O projeto utiliza uma paleta de cores inspirada na cultura Matis:

| Variavel CSS | Nome | Valor (Light) | Descricao |
|---|---|---|---|
| `--vermelho-tucum` | Vermelho Tucum | `#8D0009` | Cor secundaria (vermelho) |
| `--azul-genipapo` | Azul Genipapo | `#061029` | Cor primaria (azul escuro) |
| `--tucum-suave` | Tucum Suave | `#D6C09E` | Bege suave |
| `--tucum-quente` | Tucum Quente | `#BB9D78` | Bege quente |
| `--tucum-claro` | Tucum Claro | `#F9F3EA` | Creme claro |

### Cores Funcionais

| Variavel | Valor (Light) | Valor (Dark) | Uso |
|---|---|---|---|
| `--background` | `#fdfdfd` | `#1a1a1a` | Fundo da pagina |
| `--foreground` | `#606060` | `#e5e5e5` | Texto principal |
| `--primary` | `#061029` | `#a87b3a` | Cor primaria |
| `--secondary` | `#8D0009` | `#8fa866` | Cor secundaria |
| `--success` | `#2f9172` | `#4aab8e` | Sucesso |
| `--warning` | `#d49f4a` | `#e0b36a` | Alerta |
| `--error` | `#c05267` | `#d46a7c` | Erro |
| `--destructive` | `#c05267` | `#d46a7c` | Acoes destrutivas |
| `--border` | `#e2e8f0` | `rgba(255,255,255,0.1)` | Bordas |
| `--ring` | `#865b15` | `#a87b3a` | Foco/anel |

---

## Mapeamento de Tema (@theme inline)

O bloco `@theme inline` mapeia CSS variables para o sistema de cores do Tailwind:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-light: var(--primary-light);
  --color-secondary: var(--secondary);
  --color-secondary-light: var(--secondary-light);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  /* ... card, popover, muted, accent, destructive, chart, sidebar, radius ... */
  --color-azul-genipapo: var(--azul-genipapo);
  --color-vermelho-tucum: var(--vermelho-tucum);
  --color-tucum-suave: var(--tucum-suave);
  --color-tucum-quente: var(--tucum-quente);
  --color-tucum-claro: var(--tucum-claro);
}
```

Isso permite usar classes como `bg-primary`, `text-foreground`, `border-border`, `bg-azul-genipapo`, `text-vermelho-tucum`, etc.

---

## Estilos Base (@layer base)

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-sans;
  }
  /* Titulos usando Mazurquica Bold */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Mazurquica', ui-serif, Georgia, serif;
    font-weight: 700;
  }
  /* Texto corrido usando Ubuntu */
  p, span, div, a, li, td, th, label, input, textarea, select, button {
    font-family: 'Ubuntu', ui-sans-serif, system-ui, sans-serif;
  }
}
```

---

## Tailwind Plugins

| Plugin | Fonte | Funcao |
|---|---|---|
| `@tailwindcss/vite` | Vite plugin | Processamento Tailwind no build |
| `tw-animate-css` | CSS import | Animacoes pre-definidas |

---

## Padrao de Estilizacao dos Componentes

Os componentes UI utilizam **CVA** (class-variance-authority) para gerenciar variantes:

```typescript
// Exemplo: src/components/ui/button.tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center ...',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground ...',
        destructive: 'bg-destructive text-white ...',
        outline: 'border border-input bg-background ...',
        secondary: 'bg-secondary text-secondary-foreground ...',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

A funcao `cn()` de `src/lib/utils.ts` combina `clsx` + `tailwind-merge` para merge inteligente de classes:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```
