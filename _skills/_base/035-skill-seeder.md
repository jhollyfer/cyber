# Skill: Seeder (Prisma)

O seeder e o padrao para popular o banco de dados com dados iniciais. O runner principal em `prisma/seeders/main.ts` usa `glob` para descobrir automaticamente todos os arquivos `*.seed.ts`, ordena-los por prefixo timestamp e executa-los sequencialmente. Cada seeder usa `prisma.upsert` com `update: {}` para garantir idempotencia (seguro para executar multiplas vezes). Seeders sao executados via `npx prisma db seed`.

---

## Estrutura do Arquivo

```
backend/
  prisma/
    seeders/
      main.ts                                    <-- Runner: glob + sort + import dinamico
      [timestamp]-[descricao].seed.ts            <-- Seeder individual
  config/
    database.ts                                  <-- Prisma client compartilhado
  package.json                                   <-- prisma.seed config
```

- O runner vive em `prisma/seeders/main.ts`.
- Cada seeder vive em `prisma/seeders/[timestamp]-[descricao].seed.ts`.
- O timestamp garante ordem de execucao (dependencias primeiro).

---

## Template: Runner (`main.ts`)

```typescript
import { glob } from 'glob';

async function seed(): Promise<void> {
  try {
    let seeders = await glob(process.cwd() + '/prisma/seeders/*.seed.ts');

    seeders = seeders.sort((a, b) => {
      return a.localeCompare(b);
    });

    console.info('Iniciando execucao dos seeders...\n');

    for (const seeder of seeders) {
      try {
        console.info(`Seeder iniciado: ${seeder}`);
        const { default: main } = await import(seeder);
        await main();
        console.info(`Seeder finalizado: ${seeder}`);
      } catch (error) {
        console.error(`Erro ao executar ${seeder}:`, error);
        throw error;
      }
    }

    console.info('\nTodos os seeders foram executados com sucesso!');
  } catch (error) {
    console.error('Erro durante a execucao dos seeders:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
```

## Template: Seeder Individual

```typescript
import { prisma } from '../../config/database';

export default async function (): Promise<void> {
  try {
    const items = [
      { id: 'uuid-1', name: 'Item 1', /* ... */ },
      { id: 'uuid-2', name: 'Item 2', /* ... */ },
    ];

    for (const item of items) {
      await prisma.{{entity}}.upsert({
        where: { id: item.id },
        update: {},
        create: item,
      });
    }
  } catch (error) {
    console.error('Erro ao executar seeder:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
```

---

## Exemplo Real

```typescript
// prisma/seeders/1764437967861-administrator.seed.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { Role } from '../../generated/prisma/enums';
import { Env } from '../../start/env';

export default async function (): Promise<void> {
  try {
    const password = await bcrypt.hash(Env.ADMINISTRATOR_PASSWORD, 6);

    await prisma.user.upsert({
      where: { email: Env.ADMINISTRATOR_EMAIL },
      update: {},
      create: {
        email: Env.ADMINISTRATOR_EMAIL,
        name: 'Tumi Wassa Matis',
        role: Role.ADMINISTRATOR,
        password,
        active: true,
        phone: '(00) 00000-0000',
      },
    });
  } catch (error) {
    console.error('Erro ao criar usuario administrador:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
```

```typescript
// prisma/seeders/1734574123456-categories.seed.ts (trecho)
import { prisma } from '../../config/database';

const CATEGORIES = [
  { id: 'cat-1', name: 'Cestaria', description: '...', image_id: 'img-1' },
  { id: 'cat-2', name: 'Ceramica', description: '...', image_id: 'img-2' },
];

const IMAGES = [
  { id: 'img-1', filename: 'cestaria.webp', url: '...', mimetype: 'image/webp', size: 0, original_name: 'cestaria.webp' },
  { id: 'img-2', filename: 'ceramica.webp', url: '...', mimetype: 'image/webp', size: 0, original_name: 'ceramica.webp' },
];

export default async function (): Promise<void> {
  try {
    // Dependencia: Storage primeiro
    for (const image of IMAGES) {
      await prisma.storage.upsert({
        where: { id: image.id },
        update: {},
        create: image,
      });
    }

    // Depois: Categories (depende de Storage)
    for (const category of CATEGORIES) {
      await prisma.category.upsert({
        where: { id: category.id },
        update: {},
        create: category,
      });
    }
  } catch (error) {
    console.error('Erro ao criar categorias:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
```

**Leitura do exemplo:**

1. O timestamp `1764437967861` no nome do arquivo garante a ordem de execucao. Seeders com timestamp menor executam primeiro.
2. `export default async function` e obrigatorio -- o runner usa `import()` dinamico e espera um default export.
3. `upsert` com `update: {}` e o padrao de idempotencia: se o registro ja existe, nada acontece. Se nao existe, cria.
4. O `where` do upsert usa o identificador unico (ID ou campo unique como email).
5. O bloco `finally` faz `prisma.$disconnect()` para liberar a conexao.
6. Seeders podem depender de dados de seeders anteriores (categories depende de storage), garantido pelo timestamp.

---

## Configuracao

```json
// backend/package.json
{
  "prisma": {
    "seed": "tsx prisma/seeders/main.ts"
  }
}
```

Execucao: `npx prisma db seed`

---

## Como Criar um Novo Seeder

### Passo 1: Gerar timestamp

```bash
# No terminal
node -e "console.log(Date.now())"
# Saida: 1764539798006
```

### Passo 2: Criar arquivo

```
prisma/seeders/1764539798006-[descricao].seed.ts
```

### Passo 3: Implementar com upsert

```typescript
import { prisma } from '../../config/database';

export default async function (): Promise<void> {
  try {
    // upsert para cada registro
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
```

---

## Regras e Convencoes

1. **Timestamp prefix obrigatorio** -- todo seeder deve ter prefixo timestamp Unix (milliseconds) para controle de ordem: `[timestamp]-[descricao].seed.ts`.

2. **`export default async function`** -- o runner espera um default export que e uma funcao async. Nunca use named export.

3. **`upsert` com `update: {}`** -- para garantir idempotencia, sempre use `prisma.model.upsert({ where, update: {}, create })`. O `update: {}` garante que registros existentes nao sao modificados.

4. **`where` com campo unico** -- o `where` do upsert deve usar um campo com constraint unique (id, email, etc).

5. **`try-catch-finally` obrigatorio** -- todo seeder deve ter try-catch para logar erros e finally com `prisma.$disconnect()`.

6. **Ordem por dependencia** -- seeders que dependem de dados de outros seeders devem ter timestamp maior. Ex.: categorias (que dependem de storage) devem vir depois.

7. **Dados no proprio arquivo** -- os dados do seeder sao definidos como constantes no proprio arquivo, nao carregados de arquivo externo.

8. **IDs fixos** -- use UUIDs fixos (hardcoded) para seeders, garantindo que re-execucoes nao criem duplicatas.

9. **Variaveis de ambiente via `Env`** -- dados sensiveis (email admin, password) vem de `Env` importado de `@start/env`, nunca hardcoded.

10. **Nao modificar o runner** -- o `main.ts` e generico e nao deve ser alterado. Novos seeders sao adicionados apenas criando novos arquivos `*.seed.ts`.

---

## Checklist

- [ ] O arquivo esta em `prisma/seeders/[timestamp]-[descricao].seed.ts`.
- [ ] O timestamp e um Unix timestamp em milliseconds.
- [ ] O arquivo exporta `export default async function`.
- [ ] Usa `prisma.model.upsert({ where, update: {}, create })`.
- [ ] O `where` usa campo com constraint unique.
- [ ] Tem `try-catch` com `console.error` e `throw`.
- [ ] Tem `finally` com `prisma.$disconnect()`.
- [ ] Dados de dependencia sao criados por seeders com timestamp menor.
- [ ] IDs sao fixos (hardcoded UUIDs).
- [ ] Dados sensiveis vem de `Env`, nao hardcoded.

---

## Erros Comuns

| Erro | Causa | Correcao |
|------|-------|----------|
| Seeder nao executado | Arquivo nao segue padrao `*.seed.ts` | Renomear para `[timestamp]-[nome].seed.ts` |
| Duplicatas criadas | Usando `create` em vez de `upsert` | Trocar para `upsert({ where, update: {}, create })` |
| Erro de foreign key | Seeder executa antes da dependencia | Ajustar timestamp para ser maior que o da dependencia |
| `Cannot find module` | Import path incorreto | Usar paths relativos: `../../config/database` |
| Conexao nao liberada | Faltou `prisma.$disconnect()` no `finally` | Adicionar `finally { await prisma.$disconnect(); }` |
| Runner nao encontra seeders | Glob pattern errado | Verificar que `main.ts` usa `*.seed.ts` como pattern |
| Seeder modifica dados existentes | `update` contem campos | Manter `update: {}` vazio para idempotencia |

---

**Cross-references:** ver [008-skill-model.md](./008-skill-model.md), [031-skill-validacao-env.md](./031-skill-validacao-env.md).
