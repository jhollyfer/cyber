# Skill: Model (Prisma Schema)

O model no projeto e definido dentro do arquivo unico `prisma/schema.prisma`, que descreve todas as entidades, seus campos, tipos, relacionamentos, enums e convencoes de nomenclatura. Diferente de ORMs que definem schemas por arquivo (um model por arquivo), o Prisma centraliza todas as definicoes em um unico arquivo declarativo. O Prisma Client e gerado automaticamente a partir desse schema, fornecendo um client tipado para todas as operacoes de banco de dados. O schema e consumido exclusivamente pelos repositories Prisma correspondentes.

---

## Estrutura do Arquivo

O schema Prisma vive em um unico arquivo:

```
backend/
  prisma/
    schema.prisma          <-- arquivo unico de definicao de models
  generated/
    prisma/                <-- Prisma Client gerado automaticamente
```

O arquivo `schema.prisma` contem:

1. **Generator** -- configuracao do Prisma Client gerado
2. **Datasource** -- conexao com o PostgreSQL
3. **Enums** -- enumeracoes tipadas
4. **Models** -- definicoes de tabelas com campos, relacoes e mapeamentos

---

## Template

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// Enum -- valores fixos para campos tipados
enum EntityStatus {
  ACTIVE
  INACTIVE
}

// Model -- definicao de tabela
model Entity {
  id          String       @id @default(uuid())
  name        String
  description String       @db.Text
  status      EntityStatus @default(ACTIVE)
  active      Boolean      @default(true)
  price       Float?
  count       Int          @default(0)
  metadata    Json?
  created_at  DateTime     @default(now()) @map("created_at")
  updated_at  DateTime     @updatedAt @map("updated_at")
  deleted_at  DateTime?    @map("deleted_at")

  // Relacionamento belongsTo (FK)
  category_id String   @map("category_id")
  category    Category @relation(fields: [category_id], references: [id])

  // Relacionamento hasMany
  items Item[]

  @@map("entities")
}
```

---

## Exemplo Real

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum Role {
  ADMINISTRATOR
  CURATOR
  ARTISAN
}

model User {
  id         String   @id @default(uuid())
  name       String
  email      String   @unique
  password   String
  phone      String
  role       Role
  active     Boolean
  created_at DateTime @default(now()) @map("created_at")
  updated_at DateTime @updatedAt @map("updated_at")

  artisan Artisan?

  @@map("users")
}

model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  description String    @db.Text
  slug        String    @unique
  active      Boolean   @default(true)
  created_at  DateTime  @default(now()) @map("created_at")
  updated_at  DateTime  @updatedAt @map("updated_at")
  deleted_at  DateTime? @map("deleted_at")

  image_id String  @map("image_id")
  image    Storage @relation("category_image", fields: [image_id], references: [id])

  pieces Piece[]

  @@map("categories")
}

model Piece {
  id          String    @id @default(uuid())
  title       String
  description String
  price       Float
  created_at  DateTime  @default(now()) @map("created_at")
  updated_at  DateTime  @updatedAt @map("updated_at")
  deleted_at  DateTime? @map("deleted_at")

  artisan_id  String  @map("artisan_id")
  artisan     Artisan @relation(fields: [artisan_id], references: [id])

  category_id String   @map("category_id")
  category    Category @relation(fields: [category_id], references: [id])

  @@map("pieces")
}
```

### Detalhes do exemplo

- **`@id @default(uuid())`**: todo model usa UUID como chave primaria, gerado automaticamente pelo Prisma.
- **`@map("column_name")`**: mapeia o nome do campo TypeScript para o nome da coluna no banco em snake_case.
- **`@@map("table_name")`**: mapeia o nome do model PascalCase para o nome da tabela no banco em snake_case plural.
- **`@unique`**: garante unicidade no nivel de banco de dados.
- **`@db.Text`**: usa o tipo `TEXT` do PostgreSQL para campos de texto longo (em vez de `VARCHAR`).
- **`@default(now())`**: o banco gera o timestamp automaticamente na insercao.
- **`@updatedAt`**: o Prisma atualiza automaticamente o campo em toda operacao de update.
- **`deleted_at DateTime?`**: convencao de soft delete. Registros "deletados" recebem um timestamp em `deleted_at` ao inves de serem removidos. O `?` indica campo nullable.
- **`@relation(fields: [fk], references: [id])`**: define o relacionamento com FK explicita.
- **Enums**: definidos no schema e mapeados para enums do PostgreSQL. Usados para campos com valores fixos (roles, status).
- **`Json`**: tipo para dados semi-estruturados armazenados como JSON no PostgreSQL.

---

## Regras e Convencoes

1. **Arquivo unico** -- todas as entidades, enums e relacionamentos sao definidos em `prisma/schema.prisma`. Nunca crie arquivos separados por model.

2. **`@id @default(uuid())` para todas as PKs** -- nunca use autoincrement, ObjectId ou qualquer outro tipo de ID. UUID e o padrao do projeto.

3. **Soft delete com `deleted_at DateTime?`** -- toda entidade que suporta exclusao deve ter o campo `deleted_at` como `DateTime?` (nullable). Quando `null`, o registro esta ativo. Quando preenchido, o registro esta "deletado".

4. **`created_at` e `updated_at` obrigatorios** -- todo model deve ter esses campos com `@default(now())` e `@updatedAt` respectivamente.

5. **Campos em snake_case com `@map()`** -- os campos no Prisma schema usam snake_case. Se necessario, use `@map("nome_coluna")` para mapear explicitamente para o nome da coluna no banco.

6. **Models em PascalCase, tabelas em snake_case plural** -- models usam PascalCase (ex.: `User`, `Category`, `PieceRequest`). Tabelas no banco usam snake_case plural via `@@map("tabela_nome")`.

7. **Enums definidos no schema** -- nunca defina valores de enum como strings livres em campos. Crie um `enum` no schema e use-o como tipo do campo.

8. **Relacionamentos explicitos com `@relation()`** -- FKs devem ser declaradas com `@relation(fields: [...], references: [id])`. Para relacoes ambiguas (multiplas relacoes entre os mesmos models), use nomes de relacao: `@relation("nome_relacao")`.

9. **Gerar o client apos alteracoes** -- apos modificar o schema, execute `npx prisma generate` para regenerar o Prisma Client tipado. Sem isso, o TypeScript nao reconhece as alteracoes.

10. **Migracoes para aplicar ao banco** -- apos modificar o schema, execute `npx prisma migrate dev --name descricao` para criar e aplicar a migracao ao banco de desenvolvimento.

---

## Checklist

- [ ] Todas as entidades estao definidas em `backend/prisma/schema.prisma`.
- [ ] O `generator client` esta configurado com `output = "../generated/prisma"`.
- [ ] O `datasource db` usa `provider = "postgresql"`.
- [ ] Todos os models usam `@id @default(uuid())` como PK.
- [ ] Campos `created_at` e `updated_at` estao presentes com `@default(now())` e `@updatedAt`.
- [ ] Soft delete usa `deleted_at DateTime?` (nao `trashed Boolean`).
- [ ] Models usam PascalCase e tabelas usam `@@map("snake_case_plural")`.
- [ ] Enums estao definidos como blocos `enum` no schema (nao strings literais).
- [ ] Relacionamentos usam `@relation(fields: [...], references: [id])`.
- [ ] Relacoes ambiguas possuem nomes de relacao: `@relation("nome")`.
- [ ] O Prisma Client foi regenerado apos alteracoes: `npx prisma generate`.

---

## Erros Comuns

| Erro | Problema | Correcao |
|------|----------|----------|
| `Unknown type "ObjectId"` | Usando tipo MongoDB em vez de UUID | Usar `String @id @default(uuid())` |
| Soft delete com `trashed: Boolean` | Padrao antigo (Mongoose) em vez do padrao Prisma | Usar `deleted_at DateTime?` com timestamp nullable |
| `@@map` ausente | Tabela criada com nome PascalCase no banco | Adicionar `@@map("nome_snake_case_plural")` |
| `@relation` sem `fields` e `references` | Prisma nao consegue resolver a FK | Declarar `@relation(fields: [fk_id], references: [id])` |
| Relacao ambigua sem nome | Dois campos apontam para o mesmo model sem nome de relacao | Adicionar nome explicito: `@relation("nome_relacao")` |
| Prisma Client desatualizado | Schema alterado mas `prisma generate` nao foi executado | Executar `npx prisma generate` apos alteracoes |
| `@default(new Date())` | Tentando usar JS no schema Prisma | Usar `@default(now())` -- funcao do Prisma, nao JS |
| Campo `id` como `Int @id @default(autoincrement())` | Usando autoincrement em vez de UUID | Trocar para `String @id @default(uuid())` |
| Enum definido como string literal no campo | Perde validacao em nivel de banco | Definir um bloco `enum` no schema e usar como tipo do campo |

---

> **Cross-references:** ver `009-skill-repository.md` para como o repository Prisma consome o schema para queries e inclusao de relacoes.
