# Tipos e Constantes

Referencia completa dos tipos TypeScript, enums e constantes utilizados no frontend do MatisKraft.

**Arquivos-fonte:**
- `src/lib/entities.ts` -- Interfaces, tipos utilitarios, enums e tipos de menu
- `src/lib/interfaces.ts` -- Tipo de erro HTTP
- `src/lib/constants/request-badges.ts` -- Constantes para badges de status

---

## 1. Tipos Utilitarios

### Optional

Torna propriedades especificas opcionais em um tipo.

```typescript
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
```

### Exemplo de uso

```typescript
import type { Optional } from '@/lib/entities';

// Criar um artesao sem precisar informar id e timestamps
type ArtisanInput = Optional<IArtisan, 'id' | 'created_at' | 'updated_at'>;
```

---

## 2. Tipos Base

### Meta

Metadados de paginacao retornados pela API.

```typescript
export interface Meta {
  total: number;
  page: number;
  per_page: number;
  last_page: number;
  first_page: number;
}
```

### Paginated\<Entity\>

Wrapper generico para respostas paginadas.

```typescript
export interface Paginated<Entity> {
  data: Array<Entity>;
  meta: Meta;
}
```

### Base

Tipo base com campos comuns a todas as entidades persistidas.

```typescript
interface Base {
  id: string;
  created_at: string;
  updated_at: string;
}
```

**Nota:** O campo de identificacao e `id` (nao `_id`). Os timestamps usam `snake_case`.

### IHTTPExceptionError

Tipo para tratamento de erros da API (definido em `src/lib/interfaces.ts`).

```typescript
export type IHTTPExceptionError<T> = {
  code: number;
  cause: string;
  message: string;
  errors: T;
};
```

---

## 3. Tipos de Menu

Os tipos de menu sao definidos em `src/lib/entities.ts` e usados pelo sistema de sidebar.

```typescript
export interface MenuRouteBaseItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}

export type LinkItem = MenuRouteBaseItem & {
  url: LinkProps['to'];
  items?: never;
};

export type CollapsibleItem = MenuRouteBaseItem & {
  items: Array<MenuRouteBaseItem & { url: LinkProps['to'] }>;
  url?: LinkProps['to'];
};

export type MenuItem = CollapsibleItem | LinkItem;

export type MenuGroupItem = {
  title: string;
  items: Array<MenuItem>;
};

export type MenuRoute = Array<MenuGroupItem>;
```

---

## 4. Interfaces de Entidade

Todas as interfaces estendem `Base` (exceto tipos auxiliares).

### IStorage

Representa um arquivo armazenado no sistema.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `id` | `string` | ID do arquivo |
| `filename` | `string` | Nome do arquivo no servidor |
| `url` | `string` | URL publica do arquivo |
| `mimetype` | `string` | Tipo MIME (ex: `image/png`) |
| `size` | `number` | Tamanho em bytes |
| `original_name` | `string` | Nome original do upload |

### IUser

Representa um usuario da aplicacao.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `id` | `string` | ID do usuario |
| `name` | `string` | Nome do usuario |
| `email` | `string` | Email do usuario |
| `password` | `string` | Hash da senha |
| `phone` | `string` | Telefone do usuario |
| `role` | `'ADMINISTRATOR' \| 'ARTISAN' \| 'CURATOR'` | Papel do usuario |
| `active` | `boolean` | Se o usuario esta ativo |
| `artisan` | `IArtisan \| null` | Dados de artesao (se aplicavel) |
| `curator` | `ICurator \| null` | Dados de curador (se aplicavel) |

### IVillage

Representa uma aldeia/comunidade indigena.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `id` | `string` | ID da aldeia |
| `name` | `string` | Nome da aldeia |
| `region` | `string` | Regiao geografica |
| `description` | `string` | Descricao da aldeia |
| `latitude` | `number` | Latitude para mapa |
| `longitude` | `number` | Longitude para mapa |

### IArtisan

Representa um artesao.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `id` | `string` | ID do artesao |
| `bio` | `string` | Biografia |
| `ethnicity` | `string` | Etnia |
| `approved` | `boolean` | Se esta aprovado |
| `user_id` | `string` | ID do usuario associado |
| `user` | `IUser \| null` | Dados do usuario |
| `village_id` | `string` | ID da aldeia |
| `village` | `IVillage \| null` | Dados da aldeia |
| `avatar_id` | `string` | ID do avatar |
| `avatar` | `IStorage \| null` | Imagem do avatar |
| `affiliation_proof_id` | `string` | ID do comprovante de filiacao |
| `affiliation_proof` | `IStorage \| null` | Documento de comprovacao |
| `has_pending_update_request` | `boolean` | Se tem solicitacao de atualizacao pendente |
| `pieces_count` | `number` | Quantidade de pecas |

### ICurator

Representa um curador.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `id` | `string` | ID do curador |
| `bio` | `string` | Biografia |
| `specialization` | `string` | Area de especializacao |
| `institution` | `string \| null` | Instituicao |
| `academic_background` | `string \| null` | Formacao academica |
| `years_of_experience` | `number \| null` | Anos de experiencia |
| `user_id` | `string` | ID do usuario associado |
| `avatar_id` | `string` | ID do avatar |
| `credential_proof_id` | `string` | ID do comprovante de credencial |
| `has_pending_update_request` | `boolean` | Se tem solicitacao pendente |

### ICategory

Categoria de pecas e conteudos culturais.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `name` | `string` | Nome da categoria |
| `description` | `string` | Descricao |
| `slug` | `string` | Identificador unico (URL-friendly) |
| `active` | `boolean` | Se esta ativa |
| `pieces` | `IPiece[]` | Pecas da categoria |
| `piece_requests` | `IPieceRequest[]` | Solicitacoes da categoria |

### IPiece

Representa uma peca artesanal.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `title` | `string` | Titulo da peca |
| `description` | `string` | Descricao da peca |
| `materials` | `Array<string>` | Lista de materiais utilizados |
| `symbolism` | `string` | Simbolismo da peca |
| `technique` | `string` | Tecnica artesanal |
| `price` | `number` | Preco em reais |
| `installments` | `number` | Numero de parcelas |
| `category_id` | `string` | ID da categoria |
| `artisan_id` | `string` | ID do artesao |
| `piece_images` | `IPieceImage[]` | Imagens da peca |
| `has_pending_requests` | `boolean` | Se tem solicitacoes pendentes |

### IPieceImage

Associacao entre peca e imagem.

```typescript
export interface IPieceImage extends Base {
  piece_id: string;
  piece?: IPiece;
  image_id: string;
  image?: IStorage;
}
```

### IPieceRequest

Solicitacao de criacao, atualizacao ou exclusao de peca.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `title` | `string` | Titulo da peca |
| `description` | `string` | Descricao |
| `materials` | `Array<string>` | Materiais |
| `symbolism` | `string` | Simbolismo |
| `technique` | `string` | Tecnica |
| `price` | `number` | Preco |
| `installments` | `number` | Parcelas |
| `status` | `keyof typeof EPieceRequestStatus` | Status da solicitacao |
| `type` | `keyof typeof EPieceRequestType` | Tipo da solicitacao |
| `piece_id` | `string \| null` | ID da peca (para UPDATE/DELETE) |
| `artisan_id` | `string` | ID do artesao solicitante |
| `category_id` | `string` | ID da categoria |
| `curator_id` | `string \| null` | ID do curador revisor |
| `piece_request_images` | `IPieceRequestImage[]` | Imagens da solicitacao |
| `rejection_reason` | `string \| null` | Motivo de rejeicao |
| `revision_reason` | `string \| null` | Motivo de revisao |
| `update_reason` | `string \| null` | Motivo de atualizacao |
| `deletion_reason` | `string \| null` | Motivo de exclusao |

### ICulturalContentSection

Secao de um conteudo cultural.

```typescript
export interface ICulturalContentSection {
  subtitle?: string;
  text: string;
  images: Array<string>;
  videos: Array<string>;
}
```

### ICulturalContent

Conteudo cultural publicavel.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `title` | `string` | Titulo |
| `sections` | `ICulturalContentSection[]` | Secoes do conteudo |
| `status` | `'DRAFT' \| 'PUBLISHED'` | Status de publicacao |
| `published_at` | `string \| null` | Data de publicacao |
| `deleted_at` | `string \| null` | Data de exclusao |
| `category_id` | `string` | ID da categoria |
| `author_id` | `string` | ID do autor |
| `has_pending_requests` | `boolean` | Se tem solicitacoes pendentes |

### ICulturalContentRequest

Solicitacao de conteudo cultural (mesma estrutura de campos que ICulturalContent, com campos de status e revisao adicionais).

### IArtisanUpdateRequest

Solicitacao de atualizacao de dados do artesao.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `artisan_id` | `string` | ID do artesao |
| `avatar_id` | `string \| null` | Novo avatar (se alterado) |
| `curator_id` | `string \| null` | ID do curador revisor |
| `email` | `string \| null` | Novo email (se alterado) |
| `name` | `string \| null` | Novo nome (se alterado) |
| `bio` | `string \| null` | Nova bio (se alterada) |
| `phone` | `string \| null` | Novo telefone (se alterado) |
| `status` | `keyof typeof EArtisanUpdateRequestStatus` | Status da solicitacao |

### ICuratorUpdateRequest

Solicitacao de atualizacao de dados do curador (similar a IArtisanUpdateRequest com campos adicionais: specialization, institution, academic_background).

### IPiecePublic e IPiecePublicArtisan

Tipos especificos para o site publico, com dados parciais do artesao.

```typescript
export interface IPiecePublicArtisan {
  name: string;
  email: string;
  phone: string;
  bio: string;
  ethnicity: string;
  village_id: string;
  avatar_id: string;
}

export interface IPiecePublic extends Omit<IPiece, 'artisan'> {
  artisan: IPiecePublicArtisan;
  price: number;
  installments: number;
}
```

---

## 5. Enums (Constantes)

Todos os enums sao definidos como `const` objects com `as const`, garantindo tipagem literal.

### EPieceRequestStatus -- Status de Solicitacao de Peca

```typescript
export const EPieceRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
} as const;
```

| Valor | Descricao |
|-------|-----------|
| `PENDING` | Aguardando revisao |
| `APPROVED` | Aprovada |
| `REJECTED` | Rejeitada |
| `REVISION_REQUESTED` | Revisao solicitada |

### EPieceRequestType -- Tipo de Solicitacao de Peca

```typescript
export const EPieceRequestType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;
```

### ECulturalContentRequestStatus

Mesmos valores que `EPieceRequestStatus`: `PENDING`, `APPROVED`, `REJECTED`, `REVISION_REQUESTED`.

### ECulturalContentRequestType

Mesmos valores que `EPieceRequestType`: `CREATE`, `UPDATE`, `DELETE`.

### EArtisanUpdateRequestStatus

```typescript
export const EArtisanUpdateRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
```

### ECuratorUpdateRequestStatus

Mesmos valores que `EArtisanUpdateRequestStatus`: `PENDING`, `APPROVED`, `REJECTED`.

---

## 6. Roles do Usuario

Os roles sao definidos diretamente no tipo `IUser.role`:

```typescript
role: 'ADMINISTRATOR' | 'ARTISAN' | 'CURATOR'
```

| Valor | Descricao |
|-------|-----------|
| `ADMINISTRATOR` | Administrador -- acesso total ao sistema |
| `CURATOR` | Curador -- curadoria de pecas e conteudos |
| `ARTISAN` | Artesao -- gerenciamento de pecas e conteudos proprios |
