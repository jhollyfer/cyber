# Componentes Comuns

Documentacao dos componentes compartilhados localizados em `src/components/common/`. Esses componentes formam a base reutilizavel da interface do MatisKraft, sendo consumidos por diversas paginas e funcionalidades do sistema.

---

## Visao Geral

O diretorio `src/components/common/` contem os seguintes componentes organizados por categoria:

| Categoria        | Quantidade | Descricao                                                |
|------------------|-----------|----------------------------------------------------------|
| Layout           | 7         | Header, Sidebar, Navbar, Footer, Profile, InputSearch, LanguageSwitcher |
| Combobox/Selecao | 4         | ArtisanCombobox, CategoryCombobox, CuratorCombobox, VillageCombobox |
| Dados/Listagem   | 4         | Pagination, StatusBadge, TypeBadge, PieceCard            |
| Perfil/Edicao    | 6         | Profile, ProfileSections, ArtisanProfile, EditProfileSheet, EditAdministratorProfileSheet, EditCuratorProfileSheet |
| Relatorios       | 7         | Dialogs de relatorio (artesaos, pecas, curadores, etc.)  |
| Arquivos         | 2         | FileUpload, FileUploadWithStorage                        |
| Utilidades       | 3         | LoadError, LogoutAlert, ScrollSpy                        |
| Dashboard        | 3         | DashboardSkeleton, PendingCard, StatCard                 |
| Mapa/Cultura     | 3         | LocationMap, BiographySection, VillageSection             |

---

## Componentes de Layout

### Header

**Arquivo:** `src/components/common/header.tsx`

Barra superior da aplicacao autenticada. Exibe o `SidebarTrigger`, a barra de busca condicional e o perfil do usuario.

```tsx
interface HeaderProps {
  routesWithoutSearchInput: Array<LinkProps['to']>;
}
```

**Comportamento:**
- Recebe uma lista de rotas onde o campo de busca nao deve aparecer
- Exibe `SidebarTrigger` + `InputSearch` + `Profile` para usuarios autenticados

---

### Sidebar

**Arquivo:** `src/components/common/sidebar.tsx`

Menu lateral da aplicacao autenticada. Utiliza o sistema `SidebarMenu` do shadcn/ui.

```tsx
interface SidebarProps {
  menu: MenuRoute;
}
```

**Funcionalidades:**
- Menu hierarquico com `Collapsible` para sub-itens
- Destaque visual do item ativo baseado em `location.pathname`
- Botao de logout com feedback via toast
- Logo do MatisKraft no topo

---

### Navbar

**Arquivo:** `src/components/common/navbar.tsx`

Barra de navegacao do site publico (nao autenticado). Inclui links para paginas publicas e o `LanguageSwitcher` para troca de idioma.

---

### Footer

**Arquivo:** `src/components/common/footer.tsx`

Rodape do site publico com informacoes do projeto MatisKraft.

---

### Profile

**Arquivo:** `src/components/common/profile.tsx`

Dropdown de perfil do usuario autenticado no header. Exibe avatar com iniciais, nome, email, link para `/profile` e botao de logout.

---

### InputSearch

**Arquivo:** `src/components/common/input-search.tsx`

Campo de busca global sincronizado com search params da URL via TanStack Router.

---

### LanguageSwitcher

**Arquivo:** `src/components/common/language-switcher.tsx`

Componente para troca de idioma do site publico. Utiliza `i18next` para internacionalizacao.

---

## Comboboxes de Dominio

Comboboxes especializados para selecao de entidades do dominio MatisKraft. Todos seguem o mesmo padrao de interface:

```tsx
interface ComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}
```

| Componente         | Arquivo                    | Descricao                                |
|--------------------|----------------------------|------------------------------------------|
| `ArtisanCombobox`  | `artisan-combobox.tsx`     | Selecao de artesao por nome              |
| `CategoryCombobox` | `category-combobox.tsx`    | Selecao de categoria de peca artesanal   |
| `CuratorCombobox`  | `curator-combobox.tsx`     | Selecao de curador por nome              |
| `VillageCombobox`  | `village-combobox.tsx`     | Selecao de vila/aldeia                   |

**Uso tipico:**
```tsx
<VillageCombobox
  value={field.state.value}
  onValueChange={(value) => field.handleChange(value)}
  placeholder="Selecione uma vila..."
/>
```

---

## Componentes de Dados e Listagem

### Pagination

**Arquivo:** `src/components/common/pagination.tsx`

Componente de paginacao que sincroniza com os search params da URL via TanStack Router.

**Funcionalidades:**
- Seletor de itens por pagina
- Navegacao: primeira, anterior, proxima, ultima pagina
- Sincronizacao bidirecional com `useSearch` e `useNavigate`

---

### StatusBadge

**Arquivo:** `src/components/common/status-badge.tsx`

Badge colorida que exibe o status de solicitacoes (pecas, conteudos culturais, atualizacoes de artesaos/curadores).

Exibe badges com cores diferentes para cada status dos enums:
- `EPieceRequestStatus`
- `ECulturalContentRequestStatus`
- `EArtisanUpdateRequestStatus`
- `ECuratorUpdateRequestStatus`

---

### TypeBadge

**Arquivo:** `src/components/common/type-badge.tsx`

Badge que exibe o tipo de solicitacao (criacao, atualizacao, exclusao).

Tipos dos enums:
- `EPieceRequestType`
- `ECulturalContentRequestType`

---

### PieceCard

**Arquivo:** `src/components/common/piece-card.tsx`

Card de exibicao de peca artesanal para as paginas publicas. Exibe imagem, nome, preco e dados do artesao.

---

## Componentes de Perfil e Edicao

### ProfileSections

**Arquivo:** `src/components/common/profile-sections.tsx`

Secoes de exibicao do perfil do usuario com dados pessoais, informacoes culturais e dados da conta.

---

### ArtisanProfile

**Arquivo:** `src/components/common/artisan-profile.tsx`

Exibicao do perfil completo de um artesao, incluindo biografia, etnia, vila e pecas associadas.

---

### BiographySection

**Arquivo:** `src/components/common/biography-section.tsx`

Secao de biografia de um artesao ou curador.

---

### VillageSection

**Arquivo:** `src/components/common/village-section.tsx`

Secao de informacoes sobre a vila/aldeia do artesao, incluindo mapa interativo.

---

### EditProfileSheet

**Arquivo:** `src/components/common/edit-profile-sheet.tsx`

Sheet lateral para edicao do perfil do usuario autenticado (artesao).

---

### EditAdministratorProfileSheet

**Arquivo:** `src/components/common/edit-administrator-profile-sheet.tsx`

Sheet lateral para edicao do perfil do administrador.

---

### EditCuratorProfileSheet

**Arquivo:** `src/components/common/edit-curator-profile-sheet.tsx`

Sheet lateral para edicao do perfil do curador.

---

## Componentes de Relatorios

Dialogs modais para geracao e visualizacao de relatorios em PDF. Utilizam a classe `PDFBuilder` (documentada em `009-utilitarios.md`) para gerar os documentos.

| Componente                              | Arquivo                                      | Descricao                          |
|-----------------------------------------|----------------------------------------------|------------------------------------|
| `DialogArtisansReport`                  | `dialog-artisans-report.tsx`                 | Relatorio de artesaos              |
| `DialogArtisanUpdateRequestsReport`     | `dialog-artisan-update-requests-report.tsx`  | Relatorio de solicitacoes de artesaos |
| `DialogPiecesReport`                    | `dialog-pieces-report.tsx`                   | Relatorio de pecas                 |
| `DialogPieceRequestsReport`             | `dialog-piece-requests-report.tsx`           | Relatorio de solicitacoes de pecas |
| `DialogCulturalContentsReport`          | `dialog-cultural-contents-report.tsx`        | Relatorio de conteudos culturais   |
| `DialogCulturalContentRequestsReport`   | `dialog-cultural-content-requests-report.tsx`| Relatorio de solicitacoes de conteudos |
| `DialogCuratorOperationsReport`         | `dialog-curator-operations-report.tsx`       | Relatorio de operacoes do curador  |

---

## Componentes de Arquivo

### FileUpload

**Arquivo:** `src/components/common/file-upload.tsx`

Sistema de upload de arquivos com area de drag-and-drop, preview, barra de progresso e remocao.

---

### FileUploadWithStorage

**Arquivo:** `src/components/common/file-upload-with-storage.tsx`

Extensao do FileUpload com integracao ao backend de storage. Faz upload automatico ao backend e retorna o `storage_id` via callback `onStorageChange`.

```tsx
<FileUploadWithStorage
  value={files}
  onValueChange={setFiles}
  onStorageChange={([data]) => {
    form.setFieldValue('avatar_id', data.id);
  }}
  onUploadingChange={setIsUploading}
  accept="image/*"
  maxFiles={1}
  shouldDeleteFromStorage
/>
```

---

## Componentes de Utilidade

### LoadError

**Arquivo:** `src/components/common/load-error.tsx`

Componente de estado de erro com mensagem e botao "Tentar novamente".

```tsx
<LoadError
  message="Houve um problema ao carregar dados"
  refetch={() => queryClient.invalidateQueries()}
/>
```

---

### LogoutAlert

**Arquivo:** `src/components/common/logout-alert.tsx`

Dialog de confirmacao para logout do usuario.

---

### ScrollSpy

**Arquivo:** `src/components/common/scroll-spy.tsx`

Sistema de navegacao por scroll com sincronizacao de secoes ativas. Utilizado no formulario de cadastro (sign-up) para navegar entre secoes.

Subcomponentes: `ScrollSpy`, `ScrollSpyNav`, `ScrollSpyLink`, `ScrollSpySection`, `ScrollSpyViewport`.

---

## Componentes de Dashboard

**Diretorio:** `src/components/common/dashboard/`

| Componente          | Arquivo                   | Descricao                                   |
|---------------------|---------------------------|----------------------------------------------|
| `DashboardSkeleton` | `dashboard-skeleton.tsx`  | Skeleton loading para o dashboard            |
| `PendingCard`       | `pending-card.tsx`        | Card de itens pendentes de aprovacao         |
| `StatCard`          | `stat-card.tsx`           | Card de estatistica com valor numerico       |

---

## Componentes de Mapa e Cultura

### LocationMap

**Arquivo:** `src/components/common/location-map.tsx`

Mapa interativo baseado em Leaflet/react-leaflet para exibicao de localizacoes de aldeias e comunidades indigenas. Utiliza o componente `MapContainer` do `src/components/ui/map-container.tsx`.

---

## Tabela Completa de Componentes

| # | Arquivo | Componente Exportado | Categoria |
|---|---------|---------------------|-----------|
| 1 | `artisan-combobox.tsx` | `ArtisanCombobox` | Combobox |
| 2 | `artisan-profile.tsx` | `ArtisanProfile` | Perfil |
| 3 | `biography-section.tsx` | `BiographySection` | Cultura |
| 4 | `category-combobox.tsx` | `CategoryCombobox` | Combobox |
| 5 | `curator-combobox.tsx` | `CuratorCombobox` | Combobox |
| 6 | `dashboard/dashboard-skeleton.tsx` | `DashboardSkeleton` | Dashboard |
| 7 | `dashboard/pending-card.tsx` | `PendingCard` | Dashboard |
| 8 | `dashboard/stat-card.tsx` | `StatCard` | Dashboard |
| 9 | `dialog-artisans-report.tsx` | `DialogArtisansReport` | Relatorio |
| 10 | `dialog-artisan-update-requests-report.tsx` | `DialogArtisanUpdateRequestsReport` | Relatorio |
| 11 | `dialog-cultural-content-requests-report.tsx` | `DialogCulturalContentRequestsReport` | Relatorio |
| 12 | `dialog-cultural-contents-report.tsx` | `DialogCulturalContentsReport` | Relatorio |
| 13 | `dialog-curator-operations-report.tsx` | `DialogCuratorOperationsReport` | Relatorio |
| 14 | `dialog-piece-requests-report.tsx` | `DialogPieceRequestsReport` | Relatorio |
| 15 | `dialog-pieces-report.tsx` | `DialogPiecesReport` | Relatorio |
| 16 | `edit-administrator-profile-sheet.tsx` | `EditAdministratorProfileSheet` | Perfil |
| 17 | `edit-curator-profile-sheet.tsx` | `EditCuratorProfileSheet` | Perfil |
| 18 | `edit-profile-sheet.tsx` | `EditProfileSheet` | Perfil |
| 19 | `file-upload.tsx` | `FileUpload` | Arquivo |
| 20 | `file-upload-with-storage.tsx` | `FileUploadWithStorage` | Arquivo |
| 21 | `footer.tsx` | `Footer` | Layout |
| 22 | `header.tsx` | `Header` | Layout |
| 23 | `input-search.tsx` | `InputSearch` | Layout |
| 24 | `language-switcher.tsx` | `LanguageSwitcher` | Layout |
| 25 | `load-error.tsx` | `LoadError` | Utilidade |
| 26 | `location-map.tsx` | `LocationMap` | Mapa |
| 27 | `logout-alert.tsx` | `LogoutAlert` | Utilidade |
| 28 | `navbar.tsx` | `Navbar` | Layout |
| 29 | `pagination.tsx` | `Pagination` | Dados |
| 30 | `piece-card.tsx` | `PieceCard` | Dados |
| 31 | `profile.tsx` | `Profile` | Layout |
| 32 | `profile-sections.tsx` | `ProfileSections` | Perfil |
| 33 | `scroll-spy.tsx` | `ScrollSpy` | Utilidade |
| 34 | `sidebar.tsx` | `Sidebar` | Layout |
| 35 | `status-badge.tsx` | `StatusBadge` | Dados |
| 36 | `type-badge.tsx` | `TypeBadge` | Dados |
| 37 | `village-combobox.tsx` | `VillageCombobox` | Combobox |
| 38 | `village-section.tsx` | `VillageSection` | Cultura |
