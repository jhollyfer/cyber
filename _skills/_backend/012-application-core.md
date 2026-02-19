# Core - Nucleo da Aplicacao

O diretorio `core/` contem os fundamentos da aplicacao: tipos, entidades, padroes de erro, injecao de dependencias e auto-descoberta de controllers.

---

## entities.ts

Arquivo central de tipos, enums e interfaces TypeScript. Define todas as entidades do dominio.

### Tipos Utilitarios

```typescript
// Torna propriedades especificas opcionais
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
```

### Interface Base

Todas as entidades estendem a interface `Base`:

```typescript
interface Base {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
```

### Enums (const objects)

#### ERole - 3 papeis de usuario

```typescript
export const ERole = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  CURATOR: 'CURATOR',
  ARTISAN: 'ARTISAN',
} as const;
```

#### EArtisanUpdateRequestStatus

```typescript
export const EArtisanUpdateRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
```

#### EPieceRequestStatus

```typescript
export const EPieceRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
} as const;
```

#### EPieceRequestType

```typescript
export const EPieceRequestType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;
```

#### ECulturalContentStatus

```typescript
export const ECulturalContentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;
```

#### ECulturalContentRequestStatus

```typescript
export const ECulturalContentRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
} as const;
```

#### ECuratorUpdateRequestStatus

```typescript
export const ECuratorUpdateRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
```

#### ECulturalContentRequestType

```typescript
export const ECulturalContentRequestType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;
```

### JWTPayload

```typescript
export interface JWTPayload {
  sub: string;
  email: string;
  role: keyof typeof ERole;
  type: 'access' | 'refresh';
}
```

### Tipos de Paginacao

```typescript
export interface Meta {
  total: number;
  page: number;
  per_page: number;
  last_page: number;
  first_page: number;
}

export interface Paginated<Entity> {
  data: Entity[];
  meta: Meta;
}
```

### Interfaces de Entidade

As principais interfaces refletem os modelos Prisma:

| Interface | Descricao |
|---|---|
| `IUser` | Usuario com `name`, `email`, `password`, `phone`, `role`, `active` |
| `IArtisan` | Artesao com `bio`, `ethnicity`, `approved`, relacoes com `user`, `village`, `avatar`, `affiliation_proof` |
| `ICurator` | Curador com `bio`, `specialization`, `institution`, `academic_background`, relacoes com `user`, `avatar`, `credential_proof` |
| `IVillage` | Aldeia com `name`, `region`, `description`, `latitude`, `longitude` |
| `ICategory` | Categoria com `name`, `description`, `slug`, `active`, `image` |
| `IPiece` | Peca artesanal com `title`, `description`, `materials`, `symbolism`, `technique`, `price`, `installments` |
| `IPieceRequest` | Solicitacao de peca com `status`, `type`, campos da peca, `rejection_reason`, `revision_reason` |
| `ICulturalContent` | Conteudo cultural com `title`, `sections`, `status`, `published_at` |
| `ICulturalContentRequest` | Solicitacao de conteudo cultural com `status`, `type`, campos do conteudo |
| `IArtisanUpdateRequest` | Solicitacao de atualizacao de artesao com campos opcionais e `status` |
| `ICuratorUpdateRequest` | Solicitacao de atualizacao de curador com campos opcionais e `status` |
| `IStorage` | Arquivo armazenado com `filename`, `url`, `mimetype`, `size`, `original_name` |
| `IPieceImage` | Relacao entre peca e imagem (Storage) |
| `IPieceRequestImage` | Relacao entre solicitacao de peca e imagem (Storage) |

Todas as interfaces usam `id` (UUID) como identificador, seguindo a convencao do Prisma/PostgreSQL.

---

## either.ts

Implementacao do padrao **Either** para tratamento funcional de erros. `Left` representa erro, `Right` representa sucesso.

```typescript
// ERROR
export class Left<L, R> {
  readonly value: L;
  constructor(value: L) { this.value = value; }
  isRight(): this is Right<L, R> { return false; }
  isLeft(): this is Left<L, R> { return true; }
}

// SUCCESS
export class Right<L, R> {
  readonly value: R;
  constructor(value: R) { this.value = value; }
  isRight(): this is Right<L, R> { return true; }
  isLeft(): this is Left<L, R> { return false; }
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

// Helpers
export const left = <L, R>(value: L): Either<L, R> => new Left(value);
export const right = <L, R>(value: R): Either<L, R> => new Right(value);
```

**Exemplo de uso em um use case:**

```typescript
async function execute(payload): Promise<Either<HTTPException, IUser>> {
  const existing = await userRepository.findBy({ email: payload.email });
  if (existing) {
    return left(HTTPException.Conflict('Email ja cadastrado'));
  }
  const user = await userRepository.create(payload);
  return right(user);
}
```

---

## exception.ts

Classe `HTTPException` que estende `Error` com suporte a todos os codigos HTTP de erro (4xx e 5xx).

### Interface

```typescript
export interface Exception {
  message: string;
  code: number;
  cause: string;
  errors?: Record<string, string>;
}
```

### Classe HTTPException

```typescript
export default class HTTPException extends Error {
  public readonly code: number;
  public override readonly cause: string;
  public errors?: Record<string, string>;

  protected constructor(payload: Exception) {
    super(payload.message);
    this.cause = payload.cause;
    this.code = payload.code;
    if (payload.errors) this.errors = payload.errors;
  }

  // Factory methods estaticos
  static BadRequest(message?, cause?, errors?): HTTPException;     // 400
  static Unauthorized(message?, cause?): HTTPException;            // 401
  static Forbidden(message?, cause?): HTTPException;               // 403
  static NotFound(message?, cause?): HTTPException;                // 404
  static Conflict(message?, cause?): HTTPException;                // 409
  static UnprocessableEntity(message?, cause?): HTTPException;     // 422
  static InternalServerError(message?, cause?): HTTPException;     // 500
  // ... e todos os demais codigos de 400 a 511
}
```

**Exemplo de uso:**

```typescript
throw HTTPException.BadRequest('Parametros invalidos', 'INVALID_PARAMETERS', {
  email: 'Email e obrigatorio',
  name: 'Nome deve ter no minimo 3 caracteres',
});
```

---

## di-registry.ts

Registro central de dependencias. Mapeia contratos abstratos para implementacoes Prisma usando `fastify-decorators`.

```typescript
import { injectablesHolder } from 'fastify-decorators';

export function registerDependencies(): void {
  // 12 repositorios
  injectablesHolder.injectService(UserContractRepository, UserPrismaRepository);
  injectablesHolder.injectService(ArtisanContractRepository, ArtisanPrismaRepository);
  injectablesHolder.injectService(CuratorContractRepository, CuratorPrismaRepository);
  injectablesHolder.injectService(VillageContractRepository, VillagePrismaRepository);
  injectablesHolder.injectService(CategoryContractRepository, CategoryPrismaRepository);
  injectablesHolder.injectService(PieceContractRepository, PiecePrismaRepository);
  injectablesHolder.injectService(PieceRequestContractRepository, PieceRequestPrismaRepository);
  injectablesHolder.injectService(CulturalContentContractRepository, CulturalContentPrismaRepository);
  injectablesHolder.injectService(CulturalContentRequestContractRepository, CulturalContentRequestPrismaRepository);
  injectablesHolder.injectService(ArtisanUpdateRequestContractRepository, ArtisanUpdateRequestPrismaRepository);
  injectablesHolder.injectService(CuratorUpdateRequestContractRepository, CuratorUpdateRequestPrismaRepository);
  injectablesHolder.injectService(StorageContractRepository, StoragePrismaRepository);

  // 1 servico de email
  injectablesHolder.injectService(EmailContractService, NodemailerEmailService);
}
```

Para trocar de ORM ou provedor de email, basta alterar os imports e registros neste arquivo.

---

## controllers.ts

Auto-descoberta e carregamento de controllers. Escaneia recursivamente o diretorio `application/resources/` buscando arquivos `*.controller.ts`.

```typescript
const controllerPattern = /^(?!.*\.spec\.).*\.controller\.(ts|js)$/;

export async function loadControllers(): Promise<Controllers> {
  const controllers: Controllers = [];
  const controllersPath = join(process.cwd(), 'application/resources');
  const files = await readdir(controllersPath, { recursive: true });

  const controllerFiles = files
    .filter((file) => controllerPattern.test(file))
    .sort((a, b) => a.localeCompare(b));

  for (const file of controllerFiles) {
    const module = await import(join(controllersPath, file));
    controllers.push(module.default);
  }

  return controllers;
}
```

- Exclui arquivos `.spec.ts` (testes)
- Loga cada controller carregado em modo `development`
- Ordena controllers alfabeticamente para carregamento deterministico
