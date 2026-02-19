# Declaracoes de Tipos (`_types/`)

O diretorio `_types/` contem arquivos de declaracao TypeScript (`.d.ts`) que estendem tipos de bibliotecas externas utilizadas no projeto.

## Estrutura

```
_types/
  fastify-jwt.d.ts
```

## Arquivos

### fastify-jwt.d.ts

Estende a interface `FastifyJWT` do plugin `@fastify/jwt` para tipar o payload do token JWT:

```typescript
import type { JWTPayload } from '@application/core/entities';
import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: JWTPayload;
  }
}
```

A interface `JWTPayload` (definida em `application/core/entities.ts`) contem os seguintes campos:

| Campo   | Tipo | Descricao |
|---------|------|-----------|
| `sub`   | `string` | ID do usuario (subject) |
| `email` | `string` | Endereco de e-mail do usuario |
| `role`  | `keyof typeof ERole` | Papel do usuario no sistema (ADMINISTRATOR, CURATOR, ARTISAN) |
| `type`  | `'access' \| 'refresh'` | Tipo do token |

Com essa extensao, `request.user` possui tipagem completa em toda a aplicacao, incluindo `request.user.sub`, `request.user.email`, `request.user.role` e `request.user.type`.

## Uso

Por ser uma declaracao ambiente, esse tipo e reconhecido automaticamente pelo compilador TypeScript em todo o projeto. Basta que o diretorio `_types/` esteja incluido no `tsconfig.json`.
