# Resource: Authentication

## Visao Geral

O resource de autenticacao gerencia todo o ciclo de vida de acesso do usuario: cadastro de artesao, login, logout e renovacao de tokens.

Todos os controllers deste resource utilizam `@Controller({ route: 'authentication' })`.

**Diretorio**: `backend/application/resources/authentication/`

## Endpoints

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| POST | `/authentication/sign-up` | Nao | Cadastro de novo artesao |
| POST | `/authentication/sign-in` | Nao | Login com email e senha |
| POST | `/authentication/sign-out` | Sim | Logout (limpa cookies) |
| POST | `/authentication/refresh-token` | Sim | Renova tokens de acesso |

---

## POST /authentication/sign-up

Cadastra um novo artesao no sistema. Cria um User com role ARTISAN e um Artisan associado.

### Estrutura de Arquivos

```
authentication/sign-up/
  sign-up.controller.ts
  sign-up.schema.ts
  sign-up.use-case.ts
  sign-up.use-case.spec.ts
  sign-up.controller.spec.ts
  sign-up.doc.ts
```

### Schema (Zod)

```typescript
export const AuthenticationArtisanSignUpBodySchema = z.object({
  name: z.string().trim().refine(
    (value) => value.split(' ').length >= 2,
    'Informe um Nome Completo',
  ),
  email: z.email('Informe um email valido').trim(),
  password: z.string().trim()
    .min(8, 'A senha deve ter no minimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiuscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minuscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um numero')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
  phone: z.string().trim()
    .min(1, 'O celular e obrigatorio')
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato invalido. Use (XX) XXXXX-XXXX'),
  ethnicity: z.string().min(1, 'A etnia e obrigatoria').trim(),
  bio: z.string().min(1, 'A biografia e obrigatoria').trim(),
  village_id: z.string(),
  avatar_id: z.string(),
  affiliation_proof_id: z.string(),
});
```

### Campos do Body

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| `name` | string | Sim | Nome completo (minimo 2 palavras) |
| `email` | string (email) | Sim | Email do usuario |
| `password` | string | Sim | Senha (min. 8 chars, maiuscula, minuscula, numero, especial) |
| `phone` | string | Sim | Telefone no formato (XX) XXXXX-XXXX |
| `ethnicity` | string | Sim | Etnia do artesao |
| `bio` | string | Sim | Biografia do artesao |
| `village_id` | string (UUID) | Sim | ID da aldeia |
| `avatar_id` | string (UUID) | Sim | ID do Storage com foto de perfil |
| `affiliation_proof_id` | string (UUID) | Sim | ID do Storage com comprovante de afiliacao |

### Fluxo do Use Case

1. Verifica se o email ja esta cadastrado (`UserContractRepository.findBy`)
2. Se existir com mesmo email, retorna `Left(HTTPException.Conflict('USER_EMAIL_ALREADY_EXISTS'))`
3. Se existir com mesmo telefone, retorna `Left(HTTPException.Conflict('USER_PHONE_ALREADY_EXISTS'))`
4. Gera hash da senha com `bcryptjs` (salt rounds: 6)
5. Cria o User com role `ARTISAN` e `active: true`
6. Cria o Artisan associado com `approved: false`
7. Retorna `Right(artisan)` com status 200

### Codigos de Resposta

| Codigo | Causa | Descricao |
|---|---|---|
| 200 | - | Artesao cadastrado com sucesso |
| 409 | `USER_EMAIL_ALREADY_EXISTS` | Email ja cadastrado |
| 409 | `USER_PHONE_ALREADY_EXISTS` | Telefone ja cadastrado |
| 500 | `ARTISAN_SIGN_UP_ERROR` | Erro interno do servidor |

---

## POST /authentication/sign-in

Autentica um usuario com email e senha, retornando tokens JWT como cookies httpOnly.

### Estrutura de Arquivos

```
authentication/sign-in/
  sign-in.controller.ts
  sign-in.schema.ts
  sign-in.use-case.ts
  sign-in.use-case.spec.ts
  sign-in.controller.spec.ts
  sign-in.doc.ts
```

### Schema (Zod)

```typescript
export const SignInBodySchema = z.object({
  email: z.email('Informe um email valido').trim(),
  password: z.string().trim()
    .refine((value) => value.length > 0, 'A senha e obrigatoria'),
});
```

### Fluxo do Use Case

1. Busca o usuario pelo email (`UserContractRepository.findBy` com `exact: true`)
2. Se nao encontrar, retorna `Left(HTTPException.Unauthorized('Credenciais invalidas', 'USER_NOT_FOUND'))`
3. Verifica se o usuario esta ativo (`user.active`)
4. Se inativo, retorna `Left(HTTPException.Unauthorized('Credenciais invalidas', 'USER_INACTIVE'))`
5. Se role ARTISAN, verifica se o artesao esta aprovado (`user.artisan?.approved`)
6. Se nao aprovado, retorna `Left(HTTPException.Unauthorized('Cadastro nao aprovado', 'USER_NOT_APPROVED'))`
7. Compara a senha com `bcrypt.compare`
8. Se senha nao confere, retorna `Left(HTTPException.Unauthorized('Credenciais invalidas'))`
9. Retorna `Right(user)` (sem password)

### Fluxo do Controller (apos use case)

1. Gera tokens JWT (`createTokens`) - accessToken e refreshToken
2. Define cookies httpOnly (`setCookieTokens`)
3. Retorna status 200

### Codigos de Resposta

| Codigo | Causa | Descricao |
|---|---|---|
| 200 | - | Autenticacao bem-sucedida (cookies definidos) |
| 401 | `USER_NOT_FOUND` | Email nao encontrado |
| 401 | `USER_INACTIVE` | Usuario inativo |
| 401 | `USER_NOT_APPROVED` | Artesao nao aprovado |
| 401 | - | Senha incorreta |
| 500 | `SIGN_IN_ERROR` | Erro interno do servidor |

---

## POST /authentication/sign-out

Encerra a sessao do usuario limpando os cookies de autenticacao.

### Estrutura de Arquivos

```
authentication/sign-out/
  sign-out.controller.ts
  sign-out.doc.ts
```

### Middlewares

```typescript
onRequest: [
  AuthenticationMiddleware({ optional: false }),
  PermissionMiddleware({ allowedRoles: [ERole.ADMINISTRATOR, ERole.ARTISAN, ERole.CURATOR] }),
]
```

### Fluxo do Controller

1. Middlewares verificam autenticacao e role
2. Limpa cookies `accessToken` e `refreshToken` (maxAge: 0)
3. Retorna status 200

### Codigos de Resposta

| Codigo | Causa | Descricao |
|---|---|---|
| 200 | - | Logout bem-sucedido |
| 401 | - | Usuario nao autenticado |
| 403 | - | Role nao permitido |

---

## POST /authentication/refresh-token

Renova os tokens de acesso utilizando o refresh token dos cookies.

### Estrutura de Arquivos

```
authentication/refresh-token/
  refresh-token.controller.ts
  refresh-token.use-case.ts
  refresh-token.doc.ts
```

### Middlewares

```typescript
onRequest: [
  AuthenticationMiddleware({ optional: false }),
  PermissionMiddleware({ allowedRoles: [ERole.ADMINISTRATOR, ERole.ARTISAN, ERole.CURATOR] }),
]
```

### Fluxo do Controller

1. Middlewares verificam autenticacao e role
2. Extrai `refreshToken` dos cookies
3. Se ausente, retorna 401 (`MISSING_REFRESH_TOKEN`)
4. Decodifica o token JWT e verifica se o tipo e `refresh`
5. Se invalido, retorna 401 (`INVALID_REFRESH_TOKEN`)
6. Executa o use case passando o `id` (UUID do usuario, extraido do `sub`)
7. Use case busca o usuario e verifica se esta ativo
8. Gera novos tokens (`createTokens`)
9. Define novos cookies (`setCookieTokens`)
10. Retorna status 200

### Codigos de Resposta

| Codigo | Causa | Descricao |
|---|---|---|
| 200 | - | Tokens renovados com sucesso |
| 401 | `MISSING_REFRESH_TOKEN` | Refresh token ausente |
| 401 | `INVALID_REFRESH_TOKEN` | Refresh token invalido ou expirado |
| 404 | `USER_NOT_FOUND` | Usuario nao encontrado |
| 401 | `USER_INACTIVE` | Usuario inativo |
| 500 | `REFRESH_TOKEN_ERROR` | Erro interno do servidor |

---

## Seguranca

- Tokens JWT sao armazenados em cookies **httpOnly** (nao acessiveis via JavaScript no browser)
- Existem dois tipos de token JWT: `access` e `refresh`
- Senhas sao hasheadas com `bcryptjs` (salt rounds: 6)
- O regex de senha exige: pelo menos 1 maiuscula, 1 minuscula, 1 numero e 1 caractere especial (min. 8 caracteres)
- Artesaos cadastrados ficam com `approved: false` e precisam ser aprovados por um curador para fazer login
- O sign-up e exclusivo para artesaos (curadores e administradores sao criados por administradores)
