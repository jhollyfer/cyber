# Resource: Profile

## Visao Geral

O resource de perfil permite que o usuario autenticado visualize seus proprios dados. Opera sobre o usuario logado, identificado pelo token JWT (`request.user.sub`).

**Diretorio**: `backend/application/resources/profile/`

**Prefixo de rota**: `profile` (definido em `@Controller({ route: 'profile' })`)

## Endpoints

| Metodo | Rota | Auth | Roles | Descricao |
|---|---|---|---|---|
| GET | `/profile` | Sim | ADMINISTRATOR, ARTISAN, CURATOR | Dados do usuario autenticado |

---

## GET /profile

Retorna os dados do usuario autenticado, incluindo dados do artesao ou curador associado.

### Estrutura de Arquivos

```
profile/show/
  show.controller.ts
  show.use-case.ts
  show.schema.ts
  show.doc.ts
  show.controller.spec.ts
  show.use-case.spec.ts
```

### Middlewares

```typescript
onRequest: [
  AuthenticationMiddleware({ optional: false }),
  PermissionMiddleware({
    allowedRoles: [ERole.ADMINISTRATOR, ERole.ARTISAN, ERole.CURATOR],
  }),
]
```

### Schema (Zod)

O ID do usuario e extraido do token JWT (`request.user`):

```typescript
export const ProfileShowSchema = z.object({
  sub: z.string(),
});
```

### Controller

```typescript
@Controller({ route: 'profile' })
export default class {
  @GET({
    url: '',
    options: {
      onRequest: [
        AuthenticationMiddleware({ optional: false }),
        PermissionMiddleware({
          allowedRoles: [ERole.ADMINISTRATOR, ERole.ARTISAN, ERole.CURATOR],
        }),
      ],
      schema: ProfileShowDocumentationSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const payload = ProfileShowSchema.parse(request?.user);
    const result = await this.useCase.execute(payload);

    if (result.isLeft()) {
      const error = result.value;
      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
      });
    }

    return response.status(200).send(result.value);
  }
}
```

### Fluxo do Use Case

1. Busca o usuario pelo `id` (UUID, extraido do JWT `sub`)
2. Se nao encontrar, retorna `Left(HTTPException.NotFound('User not found', 'USER_NOT_FOUND'))`
3. Retorna `Right(user)` sem o campo `password`

### Exemplo de Resposta

```json
{
  "id": "uuid",
  "name": "Maria Silva",
  "email": "maria@exemplo.com",
  "phone": "(92) 99999-9999",
  "role": "ARTISAN",
  "active": true,
  "artisan": {
    "bio": "Artesa indigena",
    "ethnicity": "Matis",
    "approved": true,
    "village_id": "uuid",
    "avatar_id": "uuid",
    "affiliation_proof_id": "uuid"
  },
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-02-20T14:00:00.000Z"
}
```

### Codigos de Resposta

| Codigo | Causa | Descricao |
|---|---|---|
| 200 | - | Dados do usuario autenticado |
| 401 | - | Usuario nao autenticado |
| 403 | - | Role nao permitido |
| 404 | `USER_NOT_FOUND` | Usuario nao encontrado |
| 500 | `PROFILE_ME_ERROR` | Erro interno do servidor |
