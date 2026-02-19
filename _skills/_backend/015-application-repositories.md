# Repositorios

O diretorio `repositories/` implementa a camada de acesso a dados seguindo o padrao de **contratos abstratos** com inversao de dependencias. Cada repositorio possui um contrato abstrato e uma implementacao Prisma.

---

## Padrao Arquitetural

```
repositories/
  {entidade}-repository/
    {entidade}-contract.repository.ts      # Classe abstrata (contrato)
    {entidade}-prisma.repository.ts        # Implementacao Prisma
```

### Contrato (Abstract Class)

Cada contrato define os metodos que toda implementacao deve satisfazer. Os contratos sao classes abstratas decoradas para uso com DI.

### Implementacao Prisma

Usa o decorator `@Service()` do `fastify-decorators` e interage diretamente com o `PrismaClient` importado de `config/database.ts`.

### Registro de Dependencias

O arquivo `di-registry.ts` conecta contratos a implementacoes:

```typescript
injectablesHolder.injectService(UserContractRepository, UserPrismaRepository);
```

Para trocar de ORM, altere apenas os imports e registros nesse arquivo.

---

## 1. ArtisanContractRepository

**Diretorio:** `repositories/artisan-repository/`

Gerencia operacoes de artesaos (busca, criacao, atualizacao). Inclui relacoes com User, Village, Storage (avatar/affiliation_proof) e contagens de pecas.

---

## 2. ArtisanUpdateRequestContractRepository

**Diretorio:** `repositories/artisan-update-request-repository/`

Gerencia solicitacoes de atualizacao de perfil de artesaos. Inclui criacao, listagem paginada, busca por ID e atualizacao de status (APPROVED/REJECTED).

---

## 3. CategoryContractRepository

**Diretorio:** `repositories/category-repository/`

CRUD de categorias com suporte a soft-delete e relacao com Storage (imagem da categoria).

---

## 4. CulturalContentContractRepository

**Diretorio:** `repositories/cultural-content-repository/`

Gerencia conteudos culturais com secoes JSON, suporte a publicacao (DRAFT/PUBLISHED) e soft-delete.

---

## 5. CulturalContentRequestContractRepository

**Diretorio:** `repositories/cultural-content-request-repository/`

Gerencia solicitacoes de criacao/atualizacao/exclusao de conteudos culturais, com suporte a aprovacao, rejeicao e revisao.

---

## 6. CuratorContractRepository

**Diretorio:** `repositories/curator-repository/`

Gerencia operacoes de curadores (busca, criacao, atualizacao). Inclui relacoes com User, Storage (avatar/credential_proof).

---

## 7. CuratorUpdateRequestContractRepository

**Diretorio:** `repositories/curator-update-request-repository/`

Gerencia solicitacoes de atualizacao de perfil de curadores, avaliadas pelo administrador.

---

## 8. PieceContractRepository

**Diretorio:** `repositories/piece-repository/`

Gerencia pecas artesanais. Inclui relacoes com Artisan, Category, PieceImage e suporte a soft-delete.

---

## 9. PieceRequestContractRepository

**Diretorio:** `repositories/piece-request-repository/`

Gerencia solicitacoes de criacao/atualizacao/exclusao de pecas, com suporte a aprovacao, rejeicao, revisao e imagens.

---

## 10. StorageContractRepository

**Diretorio:** `repositories/storage-repository/`

CRUD de registros de armazenamento de arquivos. Gerencia metadados (filename, url, mimetype, size, original_name).

---

## 11. UserContractRepository

**Diretorio:** `repositories/user-repository/`

Gerencia usuarios (busca por email, criacao, atualizacao). Todos os usuarios possuem role, email unico e password hasheado.

---

## 12. VillageContractRepository

**Diretorio:** `repositories/village-repository/`

Gerencia aldeias/comunidades indigenas com nome, regiao, descricao e coordenadas geograficas (latitude/longitude).

---

## Resumo Comparativo

| # | Repositorio | Entidade | Operacoes principais |
|---|---|---|---|
| 1 | ArtisanContractRepository | Artisan | findAll, findById, create, update, approve |
| 2 | ArtisanUpdateRequestContractRepository | ArtisanUpdateRequest | create, findAll, findById, updateStatus |
| 3 | CategoryContractRepository | Category | findAll, create, update, delete (soft) |
| 4 | CulturalContentContractRepository | CulturalContent | findAll, findById, create, update, publish |
| 5 | CulturalContentRequestContractRepository | CulturalContentRequest | create, findAll, findById, updateStatus |
| 6 | CuratorContractRepository | Curator | findAll, findById, create, update |
| 7 | CuratorUpdateRequestContractRepository | CuratorUpdateRequest | create, findAll, findById, updateStatus |
| 8 | PieceContractRepository | Piece | findAll, findById, create, update, delete (soft) |
| 9 | PieceRequestContractRepository | PieceRequest | create, findAll, findById, updateStatus |
| 10 | StorageContractRepository | Storage | create, findById, delete |
| 11 | UserContractRepository | User | findByEmail, create, update |
| 12 | VillageContractRepository | Village | findAll, create |

---

## Servico de Email (registrado junto)

Alem dos 12 repositorios, o `di-registry.ts` tambem registra o servico de email:

```typescript
injectablesHolder.injectService(EmailContractService, NodemailerEmailService);
```
