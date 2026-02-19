# Skill: Teste E2E (Prisma/PostgreSQL)

Testes end-to-end (E2E) validam o fluxo completo de uma requisicao HTTP, desde o controller ate o banco de dados PostgreSQL, passando por autenticacao, middlewares e use cases. Diferente dos testes unitarios que usam repositorios memory, os testes E2E utilizam o kernel real da aplicacao e um banco de dados de teste com Prisma, simulando o comportamento exato que um cliente teria ao consumir a API. O ambiente de teste usa um schema isolado no PostgreSQL para garantir que os testes nao interfiram no banco de desenvolvimento.

---

## Estrutura do Arquivo

O arquivo de teste E2E fica co-localizado com o controller que ele testa, dentro da pasta da entidade e acao correspondente.

```
backend/
  application/
    resources/
      [entity]/
        [action]/
          [action].controller.ts
          [action].controller.spec.ts    <-- arquivo de teste E2E
  prisma/
    schema.prisma                        <-- schema compartilhado
  vitest.e2e.config.ts                   <-- configuracao separada para E2E
```

Cada arquivo `.controller.spec.ts` deve conter:

1. **Imports** - `supertest`, vitest (`describe`, `it`, `expect`, `beforeEach`, `afterAll`), Prisma client, kernel e helpers de autenticacao
2. **Bloco `describe` externo** - identifica o controller E2E
3. **`beforeEach`** - inicializa o kernel e limpa as tabelas do banco de teste
4. **`afterAll`** - encerra o kernel e desconecta o Prisma
5. **Blocos `describe` internos** - agrupados por rota HTTP (`GET /users/:id`, `POST /users`, etc.)
6. **Casos de teste** - cenarios com e sem autenticacao, status codes e validacao do body

## Template

```typescript
import supertest from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { PrismaClient } from '@generated/prisma';
import { kernel } from '@start/kernel';
import { createAuthenticatedUser } from '@test/helpers/auth.helper';

const prisma = new PrismaClient();

describe('E2E [Entity] [Action] Controller', () => {
  beforeEach(async () => {
    await kernel.ready();

    // Limpar tabelas na ordem correta (respeitar FKs)
    await prisma.$transaction([
      prisma.[childEntity].deleteMany(),
      prisma.[entity].deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await kernel.close();
  });

  describe('[METHOD] /[entity-route]', () => {
    it('deve [descricao do cenario de sucesso]', async () => {
      const { cookies, user } = await createAuthenticatedUser();

      const response = await supertest(kernel.server)
        .[method](`/[entity-route]/${user.id}`)
        .set('Cookie', cookies);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(user.id);
    });

    it('deve retornar 401 quando nao autenticado', async () => {
      const response = await supertest(kernel.server)
        .[method]('/[entity-route]/any-id');

      expect(response.statusCode).toBe(401);
    });
  });
});
```

## Exemplo Real

```typescript
import supertest from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { PrismaClient } from '@generated/prisma';
import { kernel } from '@start/kernel';
import { createAuthenticatedUser } from '@test/helpers/auth.helper';

const prisma = new PrismaClient();

describe('E2E User Show Controller', () => {
  beforeEach(async () => {
    await kernel.ready();

    // Limpar tabelas respeitando foreign keys
    await prisma.$transaction([
      prisma.artisan.deleteMany(),
      prisma.curator.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await kernel.close();
  });

  describe('GET /users/:id', () => {
    it('deve retornar usuario com sucesso', async () => {
      const { cookies, user } = await createAuthenticatedUser();
      const response = await supertest(kernel.server)
        .get(`/users/${user.id}`)
        .set('Cookie', cookies);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(user.id);
      expect(response.body.email).toBe(user.email);
      expect(response.body.password).toBeUndefined();
    });

    it('deve retornar 404 quando usuario nao existe', async () => {
      const { cookies } = await createAuthenticatedUser();
      const response = await supertest(kernel.server)
        .get('/users/00000000-0000-0000-0000-000000000000')
        .set('Cookie', cookies);

      expect(response.statusCode).toBe(404);
    });

    it('deve retornar 401 quando nao autenticado', async () => {
      const response = await supertest(kernel.server)
        .get('/users/any-id');

      expect(response.statusCode).toBe(401);
    });
  });
});
```

## Regras e Convencoes

1. **`kernel.ready()` no `beforeEach`** - O kernel deve ser inicializado antes de cada teste para garantir que o servidor e todas as dependencias estejam prontos.

2. **Limpeza com `prisma.$transaction` e `deleteMany()`** - As tabelas envolvidas no teste devem ser limpas antes de cada execucao usando transacoes Prisma. A ordem importa: limpe tabelas filhas (com FKs) antes das tabelas pais para evitar erros de constraint.

3. **`prisma.$disconnect()` no `afterAll`** - Desconectar o Prisma Client apos todos os testes para liberar conexoes com o banco de dados.

4. **`kernel.close()` no `afterAll`** - O kernel deve ser encerrado apos todos os testes do bloco `describe` para fechar o servidor HTTP. Usar `afterAll` (nao `afterEach`) pois o kernel e reutilizado entre testes.

5. **Banco de teste separado** - Os testes E2E devem rodar contra um banco de dados PostgreSQL de teste, configurado via variavel de ambiente `DATABASE_URL` no `.env.test`. Nunca rode testes contra o banco de desenvolvimento.

6. **`prisma migrate` para setup** - O banco de teste deve ser preparado com `npx prisma migrate deploy` antes de rodar os testes E2E, garantindo que o schema esteja atualizado.

7. **Vitest com config separada** - Os testes E2E usam `vitest.e2e.config.ts` com configuracao especifica (timeout maior, setup de banco, etc.), separada dos testes unitarios.

8. **`createAuthenticatedUser` helper** - Utilizar o helper `createAuthenticatedUser()` importado de `@test/helpers/auth.helper` para criar um usuario autenticado. Este helper retorna `{ cookies, user }` onde `cookies` contem os cookies de sessao e `user` contem os dados do usuario criado.

9. **`supertest(kernel.server)` para requisicoes** - Todas as requisicoes HTTP devem ser feitas atraves do `supertest` utilizando `kernel.server` como argumento.

10. **`.set('Cookie', cookies)` para autenticacao** - Rotas protegidas devem incluir os cookies de sessao no header da requisicao.

11. **Testar com e sem autenticacao** - Para rotas protegidas, incluir pelo menos um teste sem autenticacao para garantir que o middleware de auth retorna 401.

12. **Verificar status codes e body** - Cada teste deve verificar tanto o `response.statusCode` quanto os campos relevantes do `response.body`. Para dados sensiveis como `password`, verificar com `toBeUndefined()`.

13. **Descricao dos testes em portugues** - Assim como nos testes unitarios, os textos dentro de `it('...')` devem ser escritos em portugues.

14. **IDs no formato UUID** - Os testes devem usar UUIDs para IDs de teste (ex.: `00000000-0000-0000-0000-000000000000`), nao ObjectIds MongoDB.

## Checklist

- [ ] O arquivo esta em `backend/application/resources/[entity]/[action]/[action].controller.spec.ts`
- [ ] Imports incluem `supertest`, hooks do `vitest`, `PrismaClient`, `kernel` e `createAuthenticatedUser`
- [ ] `beforeEach` chama `await kernel.ready()`
- [ ] `beforeEach` limpa tabelas com `prisma.$transaction([prisma.[entity].deleteMany()])`
- [ ] A ordem de limpeza respeita foreign keys (filhas antes de pais)
- [ ] `afterAll` chama `await prisma.$disconnect()`
- [ ] `afterAll` chama `await kernel.close()`
- [ ] Requisicoes feitas com `supertest(kernel.server)`
- [ ] Rotas protegidas incluem `.set('Cookie', cookies)`
- [ ] Teste de sucesso verifica `statusCode` e campos do `body`
- [ ] Teste sem autenticacao verifica retorno 401 para rotas protegidas
- [ ] Campos sensiveis (ex: `password`) verificados com `toBeUndefined()`
- [ ] Descricoes dos testes (`it('...')`) escritas em portugues
- [ ] Blocos `describe` internos organizam testes por rota HTTP
- [ ] IDs de teste usam formato UUID (nao ObjectId)
- [ ] Usa `id` (nao `_id`) em URLs e assertions

## Erros Comuns

1. **Esquecer de chamar `kernel.ready()` no `beforeEach`** - Sem a inicializacao do kernel, o servidor nao estara disponivel e todas as requisicoes `supertest` falharao.

2. **Nao respeitar a ordem de foreign keys na limpeza** - Tentar limpar uma tabela pai antes das filhas causa `violates foreign key constraint`. Sempre limpe na ordem correta dentro de `prisma.$transaction()`.

3. **Usar `deleteMany({})` no estilo Mongoose** - No Prisma, use `prisma.[model].deleteMany()` sem argumentos (ou com `where` se necessario). A sintaxe `Model.deleteMany({})` e do Mongoose.

4. **Esquecer `prisma.$disconnect()` no `afterAll`** - Conexoes nao fechadas podem causar timeouts ou exaustao de pool de conexoes, fazendo testes subsequentes falharem.

5. **Usar `afterEach` em vez de `afterAll` para `kernel.close()`** - Fechar o kernel apos cada teste e reabri-lo e desnecessariamente lento.

6. **Esquecer de enviar cookies em rotas protegidas** - Sem `.set('Cookie', cookies)`, a requisicao retornara 401.

7. **Usar ObjectIds em vez de UUIDs** - IDs de teste devem ser UUIDs validos (ex.: `00000000-0000-0000-0000-000000000000`), nao strings no formato ObjectId do MongoDB.

8. **Usar `_id` em vez de `id` nas rotas e assertions** - O padrao do projeto com Prisma/PostgreSQL e `id`, nao `_id`.

9. **Rodar testes contra banco de desenvolvimento** - Sempre configure um banco de teste separado via `.env.test` com variavel `DATABASE_URL` dedicada.

10. **Confundir teste E2E com teste unitario** - Testes E2E usam banco de dados real (PostgreSQL) e o kernel completo. Testes unitarios usam repositorios memory. Nao misturar abordagens.

> **Cross-references**: ver [002-skill-controller.md](./002-skill-controller.md) para a estrutura do controller testado e [014-skill-kernel.md](./014-skill-kernel.md) para detalhes sobre o kernel da aplicacao.
