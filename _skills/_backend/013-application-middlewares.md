# Middlewares

O diretorio `middlewares/` contem dois middlewares Fastify que controlam autenticacao e autorizacao baseada em roles.

---

## authentication.middleware.ts

Middleware de autenticacao via JWT em cookies HTTP. Extrai e valida o `accessToken` presente nos cookies da requisicao.

### Assinatura

```typescript
export function AuthenticationMiddleware(
  options: AuthOptions = { optional: false },
): (request: FastifyRequest) => Promise<void>
```

### Interface de Opcoes

```typescript
interface AuthOptions {
  optional?: boolean;
}
```

### Fluxo de Execucao

1. **Extrai o accessToken** dos cookies da requisicao via `request.cookies.accessToken`.

2. **Sem token**: Se nao ha token e o modo e `optional`, retorna sem erro (`request.user` fica `undefined`). Caso contrario, lanca `HTTPException.Unauthorized('Authentication required', 'AUTHENTICATION_REQUIRED')`.

3. **Decodifica o JWT** usando `request.server.jwt.decode()` e valida que o tipo e `access`.

4. **Define `request.user`** com os dados do payload JWT:

```typescript
request.user = {
  sub: accessTokenDecoded.sub,       // ID do usuario
  email: accessTokenDecoded.email,   // Email
  role: accessTokenDecoded.role,     // Role (ADMINISTRATOR, CURATOR, ARTISAN)
  type: 'access',                    // Tipo do token
};
```

### Modo Opcional

Quando `optional: true`, o middleware nunca lanca excecao. Se o token for invalido ou ausente, `request.user` permanece `undefined`. Util para endpoints que funcionam tanto para visitantes quanto para usuarios autenticados (ex: listagem publica de artesaos e pecas).

### Exemplo de Uso

```typescript
// Autenticacao obrigatoria
onRequest: [AuthenticationMiddleware({ optional: false })]

// Autenticacao opcional (visitantes permitidos)
onRequest: [AuthenticationMiddleware({ optional: true })]
```

---

## permissions.middleware.ts

Middleware de controle de acesso baseado em roles (ADMINISTRATOR, CURATOR, ARTISAN).

### Assinatura

```typescript
export function PermissionMiddleware(
  options: PermissionOptions,
): (request: FastifyRequest) => Promise<void>
```

### Interface de Opcoes

```typescript
interface PermissionOptions {
  allowedRoles: (keyof typeof ERole)[];
}
```

### Fluxo de Execucao

1. Verifica se `request.user` existe (populado pelo AuthenticationMiddleware). Se nao, retorna sem erro (o AuthenticationMiddleware ja tratou esse caso).

2. Verifica se o `role` do usuario autenticado esta na lista de `allowedRoles`.

3. Se o role nao esta na lista, lanca `HTTPException.Forbidden('Insufficient permissions', 'INSUFFICIENT_PERMISSIONS')`.

### Exemplo de Uso

```typescript
// Apenas administradores
onRequest: [
  AuthenticationMiddleware({ optional: false }),
  PermissionMiddleware({ allowedRoles: [ERole.ADMINISTRATOR] }),
]

// Curadores e administradores
onRequest: [
  AuthenticationMiddleware({ optional: false }),
  PermissionMiddleware({ allowedRoles: [ERole.CURATOR, ERole.ADMINISTRATOR] }),
]

// Todos os roles autenticados
onRequest: [
  AuthenticationMiddleware({ optional: false }),
  PermissionMiddleware({ allowedRoles: [ERole.ADMINISTRATOR, ERole.CURATOR, ERole.ARTISAN] }),
]
```

---

## Combinacao de Middlewares

Os middlewares sao sempre utilizados em conjunto via `options.onRequest` nos controllers:

1. `AuthenticationMiddleware` e aplicado primeiro para extrair e validar o token
2. `PermissionMiddleware` e aplicado em seguida para verificar o role

Para endpoints publicos (como listagem de artesaos, pecas por categoria, aldeias), utiliza-se apenas `AuthenticationMiddleware({ optional: true })` sem `PermissionMiddleware`.
