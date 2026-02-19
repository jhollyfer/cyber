# Banco de Dados - Prisma + PostgreSQL

## Visao Geral

O backend utiliza **Prisma 7** como ORM com **PostgreSQL** como banco de dados. O schema Prisma define todos os modelos e enums, enquanto os seeders populam dados iniciais. O cliente Prisma e gerado em `generated/prisma/client` e a conexao utiliza o adapter `@prisma/adapter-pg`.

---

## Estrutura

```
prisma/
  schema.prisma                              # Schema com todos os modelos e enums
  migrations/                                # Migrations geradas pelo Prisma
  seeders/
    main.ts                                  # Orquestrador dos seeders
    1734574123456-categories.seed.ts         # Seeder de categorias (11 categorias)
    1764437967861-administrator.seed.ts      # Seeder do usuario administrador
    1764439798006-village.seed.ts            # Seeder de aldeias
    1764439798008-cultural-content.seed.ts   # Seeder de conteudos culturais
```

---

## Configuracao do Prisma

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

### `config/database.ts`

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { Env } from '@start/env';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: Env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

---

## Comando para executar seeders

```bash
npm run seed
```

---

## `main.ts` - Orquestrador

Descobre e executa automaticamente todos os arquivos `*.seed.ts` em ordem lexicografica (por timestamp).

```typescript
import { glob } from 'glob';

async function seed(): Promise<void> {
  let seeders = await glob(process.cwd() + '/prisma/seeders/*.seed.ts');
  seeders = seeders.sort((a, b) => a.localeCompare(b));

  for (const seeder of seeders) {
    const { default: main } = await import(seeder);
    await main();
  }

  process.exit(0);
}

seed();
```

---

## Seeders

### `1734574123456-categories.seed.ts` - Categorias

Cria 11 categorias de artesanato indigena com imagens associadas (Storage). Utiliza `upsert` para idempotencia.

| Categoria | Slug |
|---|---|
| Cestaria e Trancados | `cestaria-e-trancados` |
| Ceramica | `ceramica` |
| Tecelagem e Fibras | `tecelagem-e-fibras` |
| Adornos e Acessorios | `adornos-e-acessorios` |
| Madeira e Cuias | `madeira-e-cuias` |
| Instrumentos Musicais | `instrumentos-musicais` |
| Pintura e Grafismo | `pintura-e-grafismo` |
| Armas Tradicionais | `armas-tradicionais` |
| Objetos Rituais e Cerimoniais | `objetos-rituais-e-cerimoniais` |
| Informativo e Cultural | `informativo-e-cultural` |
| Biojoias | `biojoias` |

Para cada categoria, primeiro cria um registro Storage com a imagem, depois cria a categoria vinculando a imagem.

### `1764437967861-administrator.seed.ts` - Administrador

Cria o usuario administrador padrao utilizando as variaveis de ambiente `ADMINISTRATOR_EMAIL` e `ADMINISTRATOR_PASSWORD`. A senha e hasheada com bcrypt (salt round 6). Utiliza `upsert` para idempotencia.

```typescript
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
```

### `1764439798006-village.seed.ts` - Aldeias

Cria a aldeia inicial "Aldeia Paraiso" na Terra Indigena Vale do Javari, Amazonas:

| Campo | Valor |
|---|---|
| name | Aldeia Paraiso |
| region | Norte |
| latitude | -5.875472 |
| longitude | -70.938 |

### `1764439798008-cultural-content.seed.ts` - Conteudos Culturais

Cria 6 conteudos culturais de exemplo (3 publicados, 3 em rascunho), cobrindo temas como cestaria, ceramica, tecelagem, instrumentos musicais, grafismo e adornos. Cada conteudo tem secoes com texto, imagens e videos. O autor e o usuario administrador.

---

## Cadeia de dependencias

```
1. categories.seed.ts         -> Sem dependencias (cria Storage + Category)
2. administrator.seed.ts      -> Sem dependencias (cria User admin)
3. village.seed.ts             -> Sem dependencias (cria Village)
4. cultural-content.seed.ts   -> Depende de categories e administrator
```

---

## Criando um novo seeder

1. Crie um arquivo em `prisma/seeders/` com o padrao `<timestamp>-<nome>.seed.ts`
2. Exporte uma funcao `default` assincrona
3. O timestamp deve ser maior que o do ultimo seeder para garantir a ordem
4. Importe o `prisma` de `../../config/database`

```typescript
import { prisma } from '../../config/database';

export default async function (): Promise<void> {
  // ... logica do seeder usando prisma
  await prisma.$disconnect();
}
```
