# Skill: Repository (Prisma)

O repository segue um pattern de 3 arquivos por entidade: um contract (classe abstrata), uma implementacao Prisma (producao), e uma implementacao memory (testes). Essa separacao garante inversao de dependencia -- o use case depende apenas do contract, e a implementacao concreta e injetada via DI container. A implementacao memory permite testes unitarios rapidos sem depender de banco de dados.

---

## Estrutura do Arquivo

Cada entidade tem sua propria pasta dentro de `repositories/` com exatamente 3 arquivos:

```
backend/application/repositories/
  user/
    user-contract.repository.ts       # Classe abstrata (contract)
    user-prisma.repository.ts         # Implementacao Prisma (producao)
    user-memory.repository.ts         # Implementacao memory (testes)
  category/
    category-contract.repository.ts
    category-prisma.repository.ts
    category-memory.repository.ts
  [entity]/
    [entity]-contract.repository.ts
    [entity]-prisma.repository.ts
    [entity]-memory.repository.ts
```

---

## Template

### Contract (classe abstrata)

```typescript
import type { IEntity } from '@application/core/entities';

// Payloads tipados para cada operacao
export type EntityCreatePayload = {
  // campos obrigatorios para criacao
};

export type EntityFindByPayload = {
  id?: string;
  // outros campos de busca
};

export type EntityUpdatePayload = {
  id: string;
  // campos opcionais para update
};

export type EntityQueryPayload = {
  page?: number;
  per_page?: number;
  search?: string;
};

export abstract class EntityContractRepository {
  abstract create(payload: EntityCreatePayload): Promise<IEntity>;
  abstract findById(id: string): Promise<IEntity | null>;
  abstract findMany(payload?: EntityQueryPayload): Promise<IEntity[]>;
  abstract update(payload: EntityUpdatePayload): Promise<IEntity>;
  abstract delete(id: string): Promise<void>;
  abstract count(payload?: EntityQueryPayload): Promise<number>;
}
```

### Implementacao Prisma

```typescript
import { Service } from 'fastify-decorators';
import { PrismaClient } from '@generated/prisma';
import { EntityContractRepository, type EntityCreatePayload, type EntityFindByPayload, type EntityUpdatePayload, type EntityQueryPayload } from './entity-contract.repository';
import type { IEntity } from '@application/core/entities';

const prisma = new PrismaClient();

@Service()
export default class EntityPrismaRepository extends EntityContractRepository {
  private readonly includeOptions = {
    relation: true,
    // ou com select: relation: { select: { id: true, name: true } }
  };

  private buildWhereClause(payload?: EntityQueryPayload) {
    const where: Record<string, any> = {
      deleted_at: null, // soft delete: apenas registros ativos
    };

    if (payload?.search) {
      where.OR = [
        { name: { contains: payload.search, mode: 'insensitive' } },
        // outros campos buscaveis
      ];
    }

    return where;
  }

  async create(payload: EntityCreatePayload): Promise<IEntity> {
    const entity = await prisma.entity.create({
      data: payload,
      include: this.includeOptions,
    });
    return entity as IEntity;
  }

  async findById(id: string): Promise<IEntity | null> {
    const entity = await prisma.entity.findFirst({
      where: { id, deleted_at: null },
      include: this.includeOptions,
    });
    if (!entity) return null;
    return entity as IEntity;
  }

  async findMany(payload?: EntityQueryPayload): Promise<IEntity[]> {
    const where = this.buildWhereClause(payload);
    const page = payload?.page ?? 1;
    const perPage = payload?.per_page ?? 10;

    const entities = await prisma.entity.findMany({
      where,
      include: this.includeOptions,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { created_at: 'desc' },
    });

    return entities as IEntity[];
  }

  async update(payload: EntityUpdatePayload): Promise<IEntity> {
    const { id, ...data } = payload;
    const entity = await prisma.entity.update({
      where: { id },
      data,
      include: this.includeOptions,
    });
    return entity as IEntity;
  }

  async delete(id: string): Promise<void> {
    await prisma.entity.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async count(payload?: EntityQueryPayload): Promise<number> {
    const where = this.buildWhereClause(payload);
    return prisma.entity.count({ where });
  }
}
```

### Implementacao Memory

```typescript
import { randomUUID } from 'node:crypto';
import type { IEntity } from '@application/core/entities';
import { EntityContractRepository, type EntityCreatePayload, type EntityUpdatePayload, type EntityQueryPayload } from './entity-contract.repository';

export default class EntityMemoryRepository extends EntityContractRepository {
  private items: IEntity[] = [];

  // Helper para resetar o estado entre testes
  reset() {
    this.items = [];
  }

  async create(payload: EntityCreatePayload): Promise<IEntity> {
    const entity: IEntity = {
      id: randomUUID(),
      ...payload,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    this.items.push(entity);
    return entity;
  }

  async findById(id: string): Promise<IEntity | null> {
    const entity = this.items.find(
      (item) => item.id === id && !item.deleted_at,
    );
    return entity ?? null;
  }

  async findMany(payload?: EntityQueryPayload): Promise<IEntity[]> {
    let result = this.items.filter((item) => !item.deleted_at);

    if (payload?.search) {
      const search = payload.search.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search),
      );
    }

    if (payload?.page && payload?.per_page) {
      const start = (payload.page - 1) * payload.per_page;
      result = result.slice(start, start + payload.per_page);
    }

    return result;
  }

  async update(payload: EntityUpdatePayload): Promise<IEntity> {
    const index = this.items.findIndex((item) => item.id === payload.id);
    const { id, ...data } = payload;
    this.items[index] = {
      ...this.items[index],
      ...data,
      updated_at: new Date(),
    };
    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    this.items[index] = {
      ...this.items[index],
      deleted_at: new Date(),
    };
  }

  async count(payload?: EntityQueryPayload): Promise<number> {
    const items = await this.findMany({
      ...payload,
      page: undefined,
      per_page: undefined,
    });
    return items.length;
  }
}
```

---

## Exemplo Real

### Contract (user-contract.repository.ts)

```typescript
import type { IUser } from '@application/core/entities';

export type UserCreatePayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
};

export type UserFindByPayload = {
  id?: string;
  email?: string;
};

export type UserUpdatePayload = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
};

export type UserQueryPayload = {
  page?: number;
  per_page?: number;
  search?: string;
};

export abstract class UserContractRepository {
  abstract create(payload: UserCreatePayload): Promise<IUser>;
  abstract findById(id: string): Promise<IUser | null>;
  abstract findMany(payload?: UserQueryPayload): Promise<IUser[]>;
  abstract update(payload: UserUpdatePayload): Promise<IUser>;
  abstract delete(id: string): Promise<void>;
  abstract count(payload?: UserQueryPayload): Promise<number>;
}
```

### Prisma consumindo o schema (trecho)

```typescript
import { Service } from 'fastify-decorators';
import { PrismaClient } from '@generated/prisma';
import { UserContractRepository, type UserCreatePayload } from './user-contract.repository';
import type { IUser } from '@application/core/entities';

const prisma = new PrismaClient();

@Service()
export default class UserPrismaRepository extends UserContractRepository {
  private readonly includeOptions = {
    artisan: true,
    curator: true,
  };

  async create(payload: UserCreatePayload): Promise<IUser> {
    const user = await prisma.user.create({
      data: payload,
      include: this.includeOptions,
    });
    return user as IUser;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findFirst({
      where: { id },
      include: this.includeOptions,
    });
    if (!user) return null;
    return user as IUser;
  }

  // ... demais metodos seguem o template
}
```

### Memory usado em teste unitario

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import UserMemoryRepository from './user-memory.repository';
import CreateUserUseCase from '@application/resources/user/create/create.use-case';

describe('CreateUserUseCase', () => {
  let repository: UserMemoryRepository;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repository = new UserMemoryRepository();
    useCase = new CreateUserUseCase(repository);
  });

  it('deve criar um usuario com sucesso', async () => {
    const result = await useCase.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      phone: '92999999999',
      role: 'ARTISAN',
    });

    expect(result.isRight()).toBe(true);
  });
});
```

---

## Regras e Convencoes

1. **Sempre 3 arquivos por entidade** -- contract, prisma e memory. Nunca crie um sem os outros dois.

2. **O contract e uma classe abstrata**, nao uma interface. Isso permite que o DI container resolva a dependencia por referencia de classe.

3. **Todos os metodos do contract sao `abstract`** e retornam `Promise<T>`. Mesmo operacoes sincronas no memory devem retornar Promise para manter a assinatura consistente.

4. **Payloads sao tipos separados**, nao inline. Cada operacao (`create`, `findById`, `update`, `findMany`) tem seu proprio tipo de payload exportado do arquivo contract.

5. **O decorator `@Service()`** e usado apenas na implementacao Prisma. O memory nao precisa pois e instanciado manualmente nos testes.

6. **`include` para carregar relacoes** -- use `include: { relacao: true }` no Prisma para carregar dados relacionados (equivalente ao `populate()` do Mongoose).

7. **`contains` para buscas de texto** -- use `where: { campo: { contains: valor, mode: 'insensitive' } }` para buscas parciais case-insensitive (equivalente ao `$regex` do MongoDB).

8. **`buildWhereClause()`** centraliza a logica de filtros. Sempre inclui `deleted_at: null` por padrao para excluir registros com soft delete.

9. **`delete()` faz soft delete** -- atualiza `deleted_at: new Date()` ao inves de remover o registro do banco.

10. **Memory `count()` delega para `findMany()`** sem paginacao para reutilizar a logica de filtros e evitar duplicacao.

11. **Memory `findById()` filtra por `deleted_at`** -- registros com soft delete nao devem ser retornados.

12. **Naming convention** -- `[entity]-contract.repository.ts`, `[entity]-prisma.repository.ts`, `[entity]-memory.repository.ts`.

13. **DI registration** -- no `di-registry.ts`, registrar como `injectablesHolder.injectService(EntityContractRepository, EntityPrismaRepository)`.

---

## Checklist

- [ ] A pasta `backend/application/repositories/[entity]/` contem exatamente 3 arquivos
- [ ] O contract e uma `abstract class` com todos os metodos `abstract`
- [ ] Todos os payloads estao tipados e exportados do arquivo contract
- [ ] A implementacao Prisma tem o decorator `@Service()`
- [ ] A implementacao Prisma usa `include` para relacoes (nao `populate`)
- [ ] A implementacao Prisma usa `contains` para buscas (nao `$regex`)
- [ ] A implementacao Prisma usa `id` (nao `_id`)
- [ ] `buildWhereClause()` inclui `deleted_at: null` por padrao
- [ ] `delete()` faz soft delete com `deleted_at: new Date()` (nao remove o registro)
- [ ] A implementacao memory tem `private items: IEntity[] = []`
- [ ] Memory `create()` usa `randomUUID()` para o `id`
- [ ] Memory `count()` delega para `findMany()` sem paginacao
- [ ] Memory tem metodo `reset()` para limpar estado entre testes
- [ ] Ambas as implementacoes estendem o contract (nao implementam interface)
- [ ] O DI Registry registra `injectablesHolder.injectService(ContractRepo, PrismaImpl)`

---

## Erros Comuns

| Erro | Problema | Correcao |
|------|----------|----------|
| Criar interface ao inves de abstract class | DI container nao consegue resolver interfaces TypeScript em runtime | Usar `abstract class` como contract |
| Esquecer `@Service()` no Prisma repository | DI container nao registra a implementacao | Adicionar `@Service()` antes da classe |
| `delete()` com `prisma.entity.delete()` | Remove permanentemente o registro do banco | Usar `prisma.entity.update({ data: { deleted_at: new Date() } })` |
| Usar `populate()` em vez de `include` | `populate` e padrao Mongoose, nao Prisma | Usar `include: { relacao: true }` no Prisma |
| Usar `$regex` em vez de `contains` | `$regex` e padrao MongoDB, nao Prisma | Usar `{ campo: { contains: valor, mode: 'insensitive' } }` |
| Usar `_id` em vez de `id` | `_id` e padrao MongoDB/Mongoose, nao Prisma/PostgreSQL | Usar `id` como campo de chave primaria |
| Memory sem `randomUUID()` no create | `id` fica `undefined`, quebra buscas e updates | Usar `randomUUID()` de `node:crypto` |
| `buildWhereClause()` sem `deleted_at: null` | Queries retornam registros "deletados" | Sempre iniciar o where com `{ deleted_at: null }` |
| `count()` reimplementando logica de filtros | Duplicacao de codigo e risco de inconsistencia | Delegar para `findMany()` sem paginacao no memory, ou usar `prisma.entity.count({ where })` no Prisma |
| `findById()` sem tratar `null` | Prisma retorna `null` quando nao encontra | Checar `if (!entity) return null` antes de retornar |
| Payloads inline nos metodos do contract | Dificulta reuso dos tipos em use cases e testes | Definir tipos separados e exporta-los |
| Memory `findMany()` sem filtrar `deleted_at` | Retorna registros com soft delete nos testes | Iniciar com `this.items.filter((item) => !item.deleted_at)` |

---

> **Cross-references:** ver `008-skill-model.md` para como o schema Prisma e definido, `011-skill-di-registry.md` para como o contract e a implementacao Prisma sao registrados no DI container, e `005-skill-teste-unitario.md` para como o memory repository e usado nos testes.
