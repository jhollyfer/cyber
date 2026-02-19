# Componentes UI

Documentacao da biblioteca de componentes UI do frontend MatisKraft, localizada em `src/components/ui/`. Todos os componentes seguem o padrao shadcn/ui com Radix UI Primitives, estilizados via Tailwind CSS e organizados com o padrao CVA (Class Variance Authority).

---

## Visao Geral

O projeto possui 54 componentes UI reutilizaveis. A maioria e construida sobre Radix UI Primitives, garantindo acessibilidade nativa (ARIA), e estilizada com Tailwind CSS + CVA para variantes tipadas.

---

## Lista Completa de Componentes

| #  | Componente         | Arquivo                | Base                         | Descricao                                    |
|----|--------------------|------------------------|------------------------------|----------------------------------------------|
| 1  | Accordion          | `accordion.tsx`        | Radix Accordion              | Conteudo expansivel em secoes               |
| 2  | Alert              | `alert.tsx`            | HTML nativo                  | Mensagens de alerta com variantes            |
| 3  | Alert Dialog       | `alert-dialog.tsx`     | Radix AlertDialog            | Dialog de confirmacao acessivel              |
| 4  | Aspect Ratio       | `aspect-ratio.tsx`     | Radix AspectRatio            | Container com proporcao fixa                 |
| 5  | Avatar             | `avatar.tsx`           | Radix Avatar                 | Avatar de usuario com fallback               |
| 6  | Badge              | `badge.tsx`            | HTML nativo                  | Badges com variantes de cor                  |
| 7  | Breadcrumb         | `breadcrumb.tsx`       | HTML nativo                  | Navegacao hierarquica                        |
| 8  | Button             | `button.tsx`           | Radix Slot                   | Botao com variantes e tamanhos              |
| 9  | Button Group       | `button-group.tsx`     | HTML nativo                  | Agrupamento de botoes                        |
| 10 | Calendar           | `calendar.tsx`         | react-day-picker              | Seletor de data em calendario               |
| 11 | Card               | `card.tsx`             | HTML nativo                  | Container de conteudo com header/footer      |
| 12 | Carousel           | `carousel.tsx`         | embla-carousel-react          | Carrossel de conteudo                        |
| 13 | Chart              | `chart.tsx`            | Recharts                     | Container de graficos com temas              |
| 14 | Checkbox           | `checkbox.tsx`         | Radix Checkbox               | Caixa de selecao acessivel                   |
| 15 | Collapsible        | `collapsible.tsx`      | Radix Collapsible            | Conteudo colapsavel                          |
| 16 | Command            | `command.tsx`          | cmdk                         | Command palette para busca                   |
| 17 | Context Menu       | `context-menu.tsx`     | Radix ContextMenu            | Menu de contexto (clique direito)            |
| 18 | Dialog             | `dialog.tsx`           | Radix Dialog                 | Modal/dialog com overlay e animacoes         |
| 19 | Drawer             | `drawer.tsx`           | vaul                         | Gaveta deslizante (mobile)                   |
| 20 | Dropdown Menu      | `dropdown-menu.tsx`    | Radix DropdownMenu           | Menu suspenso com sub-menus                  |
| 21 | Empty              | `empty.tsx`            | HTML nativo                  | Estado vazio com icone e mensagem            |
| 22 | Field              | `field.tsx`            | HTML nativo + CVA            | Sistema de campos de formulario              |
| 23 | Form               | `form.tsx`             | React Hook Form              | Integracao com React Hook Form               |
| 24 | Hover Card         | `hover-card.tsx`       | Radix HoverCard              | Card que aparece no hover                    |
| 25 | Input              | `input.tsx`            | HTML nativo                  | Campo de entrada de texto                    |
| 26 | Input Group        | `input-group.tsx`      | HTML nativo + CVA            | Input com addons (icones, botoes)            |
| 27 | Input OTP          | `input-otp.tsx`        | input-otp                    | Campo de codigo OTP                          |
| 28 | Item               | `item.tsx`             | HTML nativo                  | Item generico de lista                       |
| 29 | Kbd                | `kbd.tsx`              | HTML nativo                  | Atalho de teclado estilizado                 |
| 30 | Label              | `label.tsx`            | Radix Label                  | Label acessivel para campos                  |
| 31 | Map Container      | `map-container.tsx`    | react-leaflet                | Container para mapas interativos (Leaflet)   |
| 32 | Menubar            | `menubar.tsx`          | Radix Menubar                | Barra de menu estilo aplicacao               |
| 33 | Navigation Menu    | `navigation-menu.tsx`  | Radix NavigationMenu         | Menu de navegacao com sub-menus              |
| 34 | Pagination         | `pagination.tsx`       | HTML nativo                  | Controles de paginacao                       |
| 35 | Popover            | `popover.tsx`          | Radix Popover                | Popover flutuante                            |
| 36 | Progress           | `progress.tsx`         | Radix Progress               | Barra de progresso                           |
| 37 | Radio Group        | `radio-group.tsx`      | Radix RadioGroup             | Grupo de radio buttons                       |
| 38 | Resizable          | `resizable.tsx`        | react-resizable-panels       | Paineis redimensionaveis                     |
| 39 | Scroll Area        | `scroll-area.tsx`      | Radix ScrollArea             | Area de scroll customizada                   |
| 40 | Select             | `select.tsx`           | Radix Select                 | Select nativo com opcoes                     |
| 41 | Separator          | `separator.tsx`        | Radix Separator              | Separador visual horizontal/vertical         |
| 42 | Sheet              | `sheet.tsx`            | Radix Dialog                 | Painel lateral deslizante                    |
| 43 | Sidebar            | `sidebar.tsx`          | Composicao interna           | Sistema completo de sidebar                  |
| 44 | Skeleton           | `skeleton.tsx`         | HTML nativo                  | Placeholder de carregamento                  |
| 45 | Slider             | `slider.tsx`           | Radix Slider                 | Seletor de intervalo deslizante              |
| 46 | Sonner             | `sonner.tsx`           | sonner                       | Sistema de notificacoes toast                |
| 47 | Spinner            | `spinner.tsx`          | HTML nativo                  | Indicador de carregamento animado            |
| 48 | Switch             | `switch.tsx`           | Radix Switch                 | Toggle switch acessivel                      |
| 49 | Table              | `table.tsx`            | HTML nativo                  | Tabela semantica com estilos                 |
| 50 | Tabs               | `tabs.tsx`             | Radix Tabs                   | Navegacao por abas                           |
| 51 | Textarea           | `textarea.tsx`         | HTML nativo                  | Area de texto multi-linha                    |
| 52 | Toggle             | `toggle.tsx`           | Radix Toggle                 | Botao toggle                                 |
| 53 | Toggle Group       | `toggle-group.tsx`     | Radix ToggleGroup            | Grupo de toggles                             |
| 54 | Tooltip            | `tooltip.tsx`          | Radix Tooltip                | Dica de contexto ao hover                    |

---

## Padrao CVA + cn()

Os componentes utilizam dois utilitarios fundamentais para estilizacao:

### Class Variance Authority (CVA)

CVA permite definir variantes de estilo tipadas para componentes:

```ts
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Classes base aplicadas sempre
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline: 'border bg-background shadow-xs hover:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
```

### Funcao `cn()`

A funcao `cn()` (de `src/lib/utils.ts`) combina `clsx` e `tailwind-merge` para mesclar classes sem conflitos:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### Padrao de Uso nos Componentes

```tsx
function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

**Nota:** O padrao `data-slot` e utilizado em todos os componentes para facilitar a selecao e estilizacao via CSS e testes.

---

## Componentes em Detalhe

### Button

**Arquivo:** `src/components/ui/button.tsx`

Componente de botao com variantes visuais e opcoes de tamanho.

#### Variantes

| Variante       | Descricao                                 |
|----------------|-------------------------------------------|
| `default`      | Botao primario com fundo solido           |
| `destructive`  | Botao de acao destrutiva (vermelho)       |
| `outline`      | Botao com borda e fundo transparente      |
| `secondary`    | Botao secundario com fundo suave          |
| `ghost`        | Botao transparente com hover              |
| `link`         | Botao estilizado como link                |

#### Tamanhos

| Tamanho    | Dimensoes          |
|------------|---------------------|
| `default`  | `h-9 px-4 py-2`    |
| `sm`       | `h-8 px-3`         |
| `lg`       | `h-10 px-6`        |
| `icon`     | `size-9`           |
| `icon-sm`  | `size-8`           |
| `icon-lg`  | `size-10`          |

#### Propriedade `asChild`

Quando `asChild={true}`, o botao renderiza o elemento filho direto em vez de `<button>`, usando o Radix `Slot`:

```tsx
<Button asChild>
  <a href="/pagina">Link como Botao</a>
</Button>
```

#### Exemplo de Uso

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="default">Salvar</Button>
<Button variant="destructive" size="sm">Excluir</Button>
<Button variant="outline" size="icon"><SearchIcon /></Button>
<Button variant="ghost" size="lg">Cancelar</Button>
```

---

### Field (Sistema de Campos)

**Arquivo:** `src/components/ui/field.tsx`

Sistema composicional de campos de formulario com orientacao responsiva. Utilizado pelos campos do TanStack Form.

#### Subcomponentes

| Componente          | Descricao                                             |
|---------------------|-------------------------------------------------------|
| `FieldSet`          | Container de conjunto de campos (`<fieldset>`)        |
| `FieldLegend`       | Legenda do fieldset com variantes `legend` e `label`  |
| `FieldGroup`        | Grupo de campos com gap automatico                    |
| `Field`             | Campo individual com orientacao (vertical/horizontal) |
| `FieldContent`      | Container do conteudo do campo                        |
| `FieldLabel`        | Label do campo com suporte a checkbox/radio           |
| `FieldTitle`        | Titulo do campo (alternativa a label)                 |
| `FieldDescription`  | Texto descritivo abaixo do campo                      |
| `FieldError`        | Mensagem de erro com suporte a array de erros         |
| `FieldSeparator`    | Separador visual entre campos                         |

#### Orientacoes do Field

| Orientacao   | Descricao                                          |
|--------------|-----------------------------------------------------|
| `vertical`   | Label acima do input (padrao)                       |
| `horizontal` | Label e input lado a lado                           |
| `responsive` | Vertical em mobile, horizontal em telas maiores     |

#### Exemplo de Uso

```tsx
<Field data-invalid={isInvalid}>
  <FieldLabel htmlFor="nome">Nome</FieldLabel>
  <InputGroup>
    <InputGroupInput
      id="nome"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </InputGroup>
  {isInvalid && <FieldError errors={errors} />}
</Field>
```

---

### Dialog

**Arquivo:** `src/components/ui/dialog.tsx`

Modal acessivel construido sobre Radix Dialog com animacoes de entrada/saida.

#### Subcomponentes

| Componente            | Descricao                                |
|-----------------------|------------------------------------------|
| `Dialog`              | Container raiz                           |
| `DialogTrigger`       | Elemento que abre o dialog               |
| `DialogPortal`        | Portal para renderizar fora da arvore    |
| `DialogOverlay`       | Overlay escuro de fundo                  |
| `DialogContent`       | Conteudo do dialog com animacoes         |
| `DialogHeader`        | Cabecalho do dialog                      |
| `DialogFooter`        | Rodape com botoes de acao                |
| `DialogTitle`         | Titulo acessivel                         |
| `DialogDescription`   | Descricao acessivel                      |
| `DialogClose`         | Botao de fechar                          |

#### Exemplo de Uso

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Criar Peca</DialogTitle>
      <DialogDescription>
        Preencha os dados da nova peca artesanal.
      </DialogDescription>
    </DialogHeader>
    {/* Formulario */}
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button>Salvar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Map Container

**Arquivo:** `src/components/ui/map-container.tsx`

Container para mapas interativos baseado em `react-leaflet`. Utilizado pelo componente `LocationMap` para exibir localizacao de aldeias e comunidades indigenas.

---

### Sidebar (Sistema Completo)

**Arquivo:** `src/components/ui/sidebar.tsx`

Sistema de sidebar composicional com suporte a modo colapsado, mobile (sheet), atalho de teclado e persistencia via cookie.

#### Constantes

| Constante                   | Valor       | Descricao                              |
|-----------------------------|-------------|----------------------------------------|
| `SIDEBAR_COOKIE_NAME`       | `sidebar_state` | Nome do cookie para persistir estado |
| `SIDEBAR_COOKIE_MAX_AGE`    | `604800`    | 7 dias em segundos                     |
| `SIDEBAR_WIDTH`             | `16rem`     | Largura padrao desktop                 |
| `SIDEBAR_WIDTH_MOBILE`      | `18rem`     | Largura no mobile (sheet)              |
| `SIDEBAR_WIDTH_ICON`        | `3rem`      | Largura no modo colapsado (icone)      |
| `SIDEBAR_KEYBOARD_SHORTCUT` | `b`         | Ctrl/Cmd + B para toggle               |

#### Hook `useSidebar`

```ts
type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};
```

---

### Table

**Arquivo:** `src/components/ui/table.tsx`

Componentes semanticos de tabela HTML com estilos Tailwind.

#### Subcomponentes

| Componente      | HTML       | Descricao                            |
|-----------------|------------|--------------------------------------|
| `Table`         | `<table>`  | Tabela com scroll horizontal         |
| `TableHeader`   | `<thead>`  | Cabecalho com borda inferior         |
| `TableBody`     | `<tbody>`  | Corpo da tabela                      |
| `TableFooter`   | `<tfoot>`  | Rodape com fundo suave               |
| `TableRow`      | `<tr>`     | Linha com hover e estado selecionado |
| `TableHead`     | `<th>`     | Celula de cabecalho                  |
| `TableCell`     | `<td>`     | Celula de dados                      |
| `TableCaption`  | `<caption>`| Legenda da tabela                    |

#### Exemplo de Uso

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Acoes</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {artisans.map((artisan) => (
      <TableRow key={artisan.id}>
        <TableCell>{artisan.name}</TableCell>
        <TableCell>{artisan.email}</TableCell>
        <TableCell>
          <Button variant="ghost" size="icon-sm">
            <EditIcon />
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### Input Group

**Arquivo:** `src/components/ui/input-group.tsx`

Sistema de input com addons (icones, botoes, texto) posicionados em qualquer lado.

#### Subcomponentes

| Componente            | Descricao                                     |
|-----------------------|-----------------------------------------------|
| `InputGroup`          | Container do grupo                            |
| `InputGroupAddon`     | Addon com posicionamento (4 direcoes)         |
| `InputGroupButton`    | Botao dentro do addon                         |
| `InputGroupText`      | Texto/icone dentro do addon                   |
| `InputGroupInput`     | Input sem bordas para composicao              |
| `InputGroupTextarea`  | Textarea sem bordas para composicao           |

#### Posicoes do Addon

| Posicao         | Descricao                        |
|-----------------|----------------------------------|
| `inline-start`  | Esquerda do input (padrao)       |
| `inline-end`    | Direita do input                 |
| `block-start`   | Acima do input                   |
| `block-end`     | Abaixo do input                  |

---

## Estrutura de Arquivos

```
src/components/ui/
  accordion.tsx         # Conteudo expansivel
  alert.tsx             # Mensagens de alerta
  alert-dialog.tsx      # Dialog de confirmacao
  aspect-ratio.tsx      # Container com proporcao
  avatar.tsx            # Avatar de usuario
  badge.tsx             # Badges
  breadcrumb.tsx        # Navegacao hierarquica
  button.tsx            # Botao com variantes
  button-group.tsx      # Agrupamento de botoes
  calendar.tsx          # Seletor de data
  card.tsx              # Cards
  carousel.tsx          # Carrossel
  chart.tsx             # Graficos
  checkbox.tsx          # Checkbox
  collapsible.tsx       # Colapsavel
  command.tsx           # Command palette
  context-menu.tsx      # Menu de contexto
  dialog.tsx            # Modal
  drawer.tsx            # Gaveta deslizante
  dropdown-menu.tsx     # Menu dropdown
  empty.tsx             # Estado vazio
  field.tsx             # Sistema de campos
  form.tsx              # React Hook Form
  hover-card.tsx        # Card no hover
  input.tsx             # Input de texto
  input-group.tsx       # Input com addons
  input-otp.tsx         # Campo OTP
  item.tsx              # Item generico
  kbd.tsx               # Atalho de teclado
  label.tsx             # Label
  map-container.tsx     # Container para mapas Leaflet
  menubar.tsx           # Barra de menu
  navigation-menu.tsx   # Menu de navegacao
  pagination.tsx        # Paginacao
  popover.tsx           # Popover
  progress.tsx          # Barra de progresso
  radio-group.tsx       # Radio buttons
  resizable.tsx         # Paineis redimensionaveis
  scroll-area.tsx       # Area de scroll
  select.tsx            # Select
  separator.tsx         # Separador
  sheet.tsx             # Painel lateral
  sidebar.tsx           # Sistema de sidebar
  skeleton.tsx          # Loading skeleton
  slider.tsx            # Seletor de intervalo
  sonner.tsx            # Toast notifications
  spinner.tsx           # Spinner
  switch.tsx            # Toggle switch
  table.tsx             # Tabela HTML
  tabs.tsx              # Navegacao por abas
  textarea.tsx          # Area de texto
  toggle.tsx            # Botao toggle
  toggle-group.tsx      # Grupo de toggles
  tooltip.tsx           # Tooltip
```
