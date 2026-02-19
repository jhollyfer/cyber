# Diretorio `config/`

## Visao Geral

O diretorio `config/` contem arquivos de configuracao para servicos externos utilizados pela aplicacao. Sao dois arquivos, cada um com uma responsabilidade especifica.

---

## Estrutura

```
config/
  database.ts    # Conexao com PostgreSQL via Prisma + @prisma/adapter-pg
  email.ts       # Configuracao do provedor de email (Nodemailer)
```

---

## `database.ts`

Responsavel por criar e exportar a instancia do PrismaClient conectada ao PostgreSQL.

### Codigo fonte

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { Env } from '@start/env';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: Env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

### Detalhes

- Utiliza o adapter `@prisma/adapter-pg` para conectar o Prisma ao PostgreSQL
- A conexao e estabelecida via `DATABASE_URL` (string de conexao PostgreSQL)
- O `PrismaClient` e importado do diretorio `generated/prisma/client`, gerado pelo comando `prisma generate`
- A instancia `prisma` e um singleton exportado e utilizado por todos os repositorios

### Variaveis de ambiente

| Variavel | Tipo | Obrigatoria | Descricao |
|---|---|---|---|
| `DATABASE_URL` | `string` | Sim | String de conexao PostgreSQL (ex: `postgresql://user:pass@localhost:5432/matiscraft`) |

---

## `email.ts`

Exporta o objeto de configuracao para o provedor de email via Nodemailer.

### Codigo fonte

```typescript
import { Env } from '@start/env';

export const NodemailerEmailProviderConfig = {
  host: Env.EMAIL_PROVIDER_HOST,
  port: Env.EMAIL_PROVIDER_PORT,
  secure: Env.EMAIL_PROVIDER_PORT === 465,
  requireTLS: true,
  auth: {
    user: Env.EMAIL_PROVIDER_USER,
    pass: Env.EMAIL_PROVIDER_PASSWORD,
  },
};
```

### Objeto `NodemailerEmailProviderConfig`

Este objeto e utilizado pelo servico `NodemailerEmailService` para criar o transporte de email.

**Propriedades:**

| Propriedade | Tipo | Descricao |
|---|---|---|
| `host` | `string` | Host do servidor SMTP |
| `port` | `number` | Porta do servidor SMTP |
| `secure` | `boolean` | `true` quando a porta e 465 (SSL/TLS implicito), `false` para outras portas |
| `requireTLS` | `boolean` | Sempre `true`, exige conexao TLS (STARTTLS para portas != 465) |
| `auth.user` | `string` | Usuario de autenticacao SMTP |
| `auth.pass` | `string` | Senha de autenticacao SMTP |

### Logica de seguranca

A propriedade `secure` e determinada automaticamente pela porta:
- **Porta 465**: `secure = true` (SSL/TLS implicito)
- **Outras portas** (ex: 587): `secure = false`, mas `requireTLS = true` forca o uso de STARTTLS

### Variaveis de ambiente

| Variavel | Tipo | Obrigatoria | Descricao |
|---|---|---|---|
| `EMAIL_PROVIDER_HOST` | `string` | Sim | Host do servidor SMTP |
| `EMAIL_PROVIDER_PORT` | `number` | Sim | Porta do servidor SMTP |
| `EMAIL_PROVIDER_USER` | `string` | Sim | Usuario SMTP |
| `EMAIL_PROVIDER_PASSWORD` | `string` | Sim | Senha SMTP |
