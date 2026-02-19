# Modelos Prisma

O schema Prisma (`prisma/schema.prisma`) define 15 modelos e 8 enums que representam o dominio da plataforma MatisCraft. Todos os modelos utilizam UUID como chave primaria, com campos `created_at` e `updated_at` automaticos.

---

## Enums (8)

### Role
```
ADMINISTRATOR | CURATOR | ARTISAN
```

### ArtisanUpdateRequestStatus
```
PENDING | APPROVED | REJECTED
```

### PieceRequestStatus
```
PENDING | APPROVED | REJECTED | REVISION_REQUESTED
```

### PieceRequestType
```
CREATE | UPDATE | DELETE
```

### CulturalContentStatus
```
DRAFT | PUBLISHED
```

### CulturalContentRequestStatus
```
PENDING | APPROVED | REJECTED | REVISION_REQUESTED
```

### CuratorUpdateRequestStatus
```
PENDING | APPROVED | REJECTED
```

### CulturalContentRequestType
```
CREATE | UPDATE | DELETE
```

---

## Modelos (15)

### 1. Storage (tabela: `storages`)

Arquivo armazenado no sistema. Referenciado por varios modelos.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `filename` | `String` | Nome do arquivo no disco |
| `url` | `String` | URL de acesso |
| `mimetype` | `String` | Tipo MIME |
| `size` | `Int` | Tamanho em bytes |
| `original_name` | `String` | Nome original do upload |

**Relacoes:** artisan_avatar, artisan_affiliation_proof, artisan_update_request, curator_avatar, curator_credential_proof, curator_update_request_avatar, piece_request_images, piece_images, category_image.

---

### 2. User (tabela: `users`)

Usuario do sistema.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `name` | `String` | Nome completo |
| `email` | `String @unique` | Email (unico) |
| `password` | `String` | Senha (hash bcrypt) |
| `phone` | `String` | Telefone |
| `role` | `Role` | ADMINISTRATOR, CURATOR ou ARTISAN |
| `active` | `Boolean` | Se o usuario esta ativo |

**Relacoes:** artisan (1:1), curator (1:1), cultural_contents, curated_piece_requests, curated_artisan_update_requests, curated_cultural_content_requests, admin_curator_update_requests.

---

### 3. Village (tabela: `villages`)

Aldeia/comunidade indigena.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `name` | `String` | Nome da aldeia |
| `region` | `String` | Regiao |
| `description` | `String @db.Text` | Descricao |
| `latitude` | `Decimal` | Latitude |
| `longitude` | `Decimal` | Longitude |

**Relacoes:** artisans[].

---

### 4. Artisan (tabela: `artisans`)

Artesao. Vinculado 1:1 com User.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `bio` | `String @db.Text` | Biografia |
| `ethnicity` | `String` | Etnia |
| `approved` | `Boolean @default(false)` | Se o cadastro foi aprovado |
| `user_id` | `String @unique` | FK para User |
| `village_id` | `String` | FK para Village |
| `avatar_id` | `String` | FK para Storage (avatar) |
| `affiliation_proof_id` | `String` | FK para Storage (prova de afiliacao) |

**Relacoes:** user, village, avatar, affiliation_proof, update_requests[], piece[], piece_request[], cultural_content_request[].

---

### 5. Curator (tabela: `curators`)

Curador. Vinculado 1:1 com User.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `bio` | `String @db.Text` | Biografia |
| `specialization` | `String` | Especializacao |
| `institution` | `String?` | Instituicao |
| `academic_background` | `String?` | Formacao academica |
| `years_of_experience` | `Int?` | Anos de experiencia |
| `user_id` | `String @unique` | FK para User |
| `avatar_id` | `String` | FK para Storage (avatar) |
| `credential_proof_id` | `String` | FK para Storage (prova de credencial) |

**Relacoes:** user, avatar, credential_proof, update_requests[].

---

### 6. Category (tabela: `categories`)

Categoria de pecas e conteudos culturais.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `name` | `String @unique` | Nome (unico) |
| `description` | `String @db.Text` | Descricao |
| `slug` | `String @unique` | Slug (unico) |
| `active` | `Boolean @default(true)` | Se esta ativa |
| `deleted_at` | `DateTime?` | Soft-delete |
| `image_id` | `String` | FK para Storage (imagem) |

**Relacoes:** image, piece[], piece_request[], cultural_contents[], cultural_content_request[].

---

### 7. Piece (tabela: `pieces`)

Peca artesanal aprovada e publicada.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `title` | `String` | Titulo |
| `description` | `String` | Descricao |
| `symbolism` | `String` | Simbolismo |
| `technique` | `String` | Tecnica utilizada |
| `materials` | `String @db.Text` | Materiais |
| `price` | `Float` | Preco |
| `installments` | `Int @default(1)` | Parcelas |
| `artisan_id` | `String` | FK para Artisan |
| `category_id` | `String` | FK para Category |
| `deleted_at` | `DateTime?` | Soft-delete |

**Relacoes:** artisan, category, piece_request[], piece_images[].

---

### 8. PieceImage (tabela: `piece_images`)

Imagem de uma peca (tabela de juncao).

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `piece_id` | `String` | FK para Piece |
| `image_id` | `String` | FK para Storage |

---

### 9. PieceRequest (tabela: `piece_request`)

Solicitacao de criacao, atualizacao ou exclusao de peca.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `title` | `String` | Titulo |
| `description` | `String` | Descricao |
| `symbolism` | `String` | Simbolismo |
| `technique` | `String` | Tecnica |
| `materials` | `String @db.Text` | Materiais |
| `price` | `Float` | Preco |
| `installments` | `Int @default(1)` | Parcelas |
| `status` | `PieceRequestStatus` | PENDING, APPROVED, REJECTED, REVISION_REQUESTED |
| `type` | `PieceRequestType` | CREATE, UPDATE, DELETE |
| `piece_id` | `String?` | FK para Piece (null para CREATE) |
| `artisan_id` | `String` | FK para Artisan |
| `category_id` | `String` | FK para Category |
| `curator_id` | `String?` | FK para User (curador que avaliou) |
| `rejection_reason` | `String? @db.Text` | Motivo de rejeicao |
| `revision_reason` | `String? @db.Text` | Motivo de revisao |
| `update_reason` | `String? @db.Text` | Motivo de atualizacao |
| `deletion_reason` | `String? @db.Text` | Motivo de exclusao |

**Relacoes:** piece, artisan, category, curator, piece_request_images[].

---

### 10. PieceRequestImage (tabela: `piece_request_images`)

Imagem de uma solicitacao de peca (tabela de juncao).

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `piece_request_id` | `String` | FK para PieceRequest |
| `image_id` | `String` | FK para Storage |

---

### 11. CulturalContent (tabela: `cultural_contents`)

Conteudo cultural publicado ou em rascunho.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `title` | `String` | Titulo |
| `sections` | `Json` | Array de secoes: `[{ subtitle?, text, images: [], videos: [] }]` |
| `status` | `CulturalContentStatus` | DRAFT ou PUBLISHED |
| `published_at` | `DateTime?` | Data de publicacao |
| `category_id` | `String` | FK para Category |
| `author_id` | `String` | FK para User |
| `deleted_at` | `DateTime?` | Soft-delete |

**Relacoes:** category, author, cultural_content_requests[].

---

### 12. CulturalContentRequest (tabela: `cultural_content_requests`)

Solicitacao de criacao, atualizacao ou exclusao de conteudo cultural.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `title` | `String` | Titulo |
| `sections` | `Json` | Array de secoes |
| `status` | `CulturalContentRequestStatus` | PENDING, APPROVED, REJECTED, REVISION_REQUESTED |
| `type` | `CulturalContentRequestType` | CREATE, UPDATE, DELETE |
| `cultural_content_id` | `String?` | FK para CulturalContent (null para CREATE) |
| `category_id` | `String` | FK para Category |
| `artisan_id` | `String` | FK para Artisan |
| `curator_id` | `String?` | FK para User (curador que avaliou) |
| `rejection_reason` | `String? @db.Text` | Motivo de rejeicao |
| `revision_reason` | `String? @db.Text` | Motivo de revisao |
| `update_reason` | `String? @db.Text` | Motivo de atualizacao |
| `deletion_reason` | `String? @db.Text` | Motivo de exclusao |

---

### 13. ArtisanUpdateRequest (tabela: `artisan_update_requests`)

Solicitacao de atualizacao de perfil de artesao.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `artisan_id` | `String` | FK para Artisan |
| `avatar_id` | `String?` | FK para Storage (novo avatar) |
| `email` | `String?` | Novo email (opcional) |
| `name` | `String?` | Novo nome (opcional) |
| `bio` | `String? @db.Text` | Nova bio (opcional) |
| `phone` | `String?` | Novo telefone (opcional) |
| `status` | `ArtisanUpdateRequestStatus` | PENDING, APPROVED, REJECTED |
| `curator_id` | `String?` | FK para User (curador que avaliou) |

---

### 14. CuratorUpdateRequest (tabela: `curator_update_requests`)

Solicitacao de atualizacao de perfil de curador.

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String @id @default(uuid())` | UUID |
| `curator_id` | `String` | FK para Curator |
| `avatar_id` | `String?` | FK para Storage (novo avatar) |
| `email` | `String?` | Novo email |
| `name` | `String?` | Novo nome |
| `phone` | `String?` | Novo telefone |
| `bio` | `String? @db.Text` | Nova bio |
| `specialization` | `String?` | Nova especializacao |
| `institution` | `String?` | Nova instituicao |
| `academic_background` | `String?` | Nova formacao academica |
| `status` | `CuratorUpdateRequestStatus` | PENDING, APPROVED, REJECTED |
| `admin_id` | `String?` | FK para User (admin que avaliou) |

---

## Diagrama de Relacionamentos

```
User (role: ADMINISTRATOR | CURATOR | ARTISAN)
  |-- 1:1 --> Artisan (se role = ARTISAN)
  |             |-- N:1 --> Village
  |             |-- N:1 --> Storage (avatar)
  |             |-- N:1 --> Storage (affiliation_proof)
  |             |-- 1:N --> Piece
  |             |-- 1:N --> PieceRequest
  |             |-- 1:N --> CulturalContentRequest
  |             |-- 1:N --> ArtisanUpdateRequest
  |
  |-- 1:1 --> Curator (se role = CURATOR)
  |             |-- N:1 --> Storage (avatar)
  |             |-- N:1 --> Storage (credential_proof)
  |             |-- 1:N --> CuratorUpdateRequest
  |
  |-- 1:N --> CulturalContent (como author)

Category
  |-- N:1 --> Storage (image)
  |-- 1:N --> Piece
  |-- 1:N --> PieceRequest
  |-- 1:N --> CulturalContent
  |-- 1:N --> CulturalContentRequest

Piece
  |-- 1:N --> PieceImage --> Storage
  |-- 1:N --> PieceRequest

PieceRequest
  |-- 1:N --> PieceRequestImage --> Storage
  |-- N:1 --> User (curator)
```
