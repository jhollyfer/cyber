# Diretorio `start/`

## Visao Geral

O diretorio `start/` contem os dois arquivos fundamentais para a inicializacao da aplicacao: a validacao de variaveis de ambiente e a configuracao completa da instancia Fastify (kernel).

---

## Estrutura

```
start/
  env.ts       # Validacao e exportacao das variaveis de ambiente
  kernel.ts    # Configuracao da instancia Fastify
```

---

## `env.ts`

Responsavel por carregar, validar e exportar todas as variaveis de ambiente da aplicacao utilizando Zod.

### Carregamento do arquivo `.env`

| Ambiente | Arquivo |
|---|---|
| `test` | `.env.test` |
| `development` / `production` | `.env` |

### Variaveis de ambiente

#### Aplicacao

| Variavel | Tipo | Obrigatoria | Padrao | Descricao |
|---|---|---|---|---|
| `NODE_ENV` | `enum` | Nao | `development` | Ambiente de execucao (`development`, `test`, `production`) |
| `PORT` | `number` | Nao | `4000` | Porta do servidor HTTP |
| `SERVER_URL` | `string` | Sim | - | URL base do servidor (ex: `http://localhost:4000`) |
| `CLIENT_URL` | `string` | Sim | - | URL do frontend (usado em CORS e emails) |

#### Banco de dados

| Variavel | Tipo | Obrigatoria | Padrao | Descricao |
|---|---|---|---|---|
| `DATABASE_URL` | `string` | Sim | - | String de conexao PostgreSQL |
| `DB_HOST` | `string` | Nao | `localhost` | Host do banco de dados |
| `DB_PORT` | `number` | Nao | `5432` | Porta do banco de dados |
| `DB_USER` | `string` | Sim | - | Usuario do banco de dados |
| `DB_PASSWORD` | `string` | Sim | - | Senha do banco de dados |
| `DB_DATABASE` | `string` | Sim | - | Nome do banco de dados |

#### Administrador

| Variavel | Tipo | Obrigatoria | Descricao |
|---|---|---|---|
| `ADMINISTRATOR_EMAIL` | `string (email)` | Sim | Email do administrador padrao criado pelo seeder |
| `ADMINISTRATOR_PASSWORD` | `string` | Sim | Senha do administrador padrao |

#### Autenticacao

| Variavel | Tipo | Obrigatoria | Descricao |
|---|---|---|---|
| `JWT_PUBLIC_KEY` | `string` | Sim | Chave publica RS256 codificada em Base64 |
| `JWT_PRIVATE_KEY` | `string` | Sim | Chave privada RS256 codificada em Base64 |
| `COOKIE_SECRET` | `string` | Sim | Segredo para assinatura de cookies |
| `COOKIE_DOMAIN` | `string` | Nao | Dominio dos cookies (ex: `.matiscraft.com`) |

#### Email

| Variavel | Tipo | Obrigatoria | Descricao |
|---|---|---|---|
| `EMAIL_PROVIDER_HOST` | `string` | Sim | Host do servidor SMTP |
| `EMAIL_PROVIDER_PORT` | `number` | Sim | Porta do servidor SMTP |
| `EMAIL_PROVIDER_USER` | `string` | Sim | Usuario SMTP |
| `EMAIL_PROVIDER_PASSWORD` | `string` | Sim | Senha SMTP |

### Validacao

A validacao utiliza `safeParse` do Zod. Se a validacao falhar:
1. Os erros sao logados no console com `console.error`
2. Um `Error('Invalid environment variables')` e lancado, impedindo a aplicacao de iniciar

---

## `kernel.ts`

Arquivo central que configura a instancia do Fastify com todos os plugins, middlewares, error handler, documentacao e bootstrap dos controllers.

### Plugins registrados

| Plugin | Configuracao |
|---|---|
| **CORS** | Origens permitidas: `CLIENT_URL`, `SERVER_URL`. Metodos: GET, POST, PUT, DELETE, PATCH, OPTIONS. Headers customizados incluem `X-Timezone`. |
| **Cookie** | Secret via `COOKIE_SECRET` |
| **JWT (RS256)** | Chaves decodificadas de Base64. Access token expira em 24h. Cookie `accessToken` (nao assinado). |
| **Multipart** | Limite de 5MB por arquivo |
| **Static** | Serve `_storage/` no prefixo `/storage/` |
| **Swagger** | OpenAPI 3.0 com titulo "Matis API". Security scheme: `cookieAuth` (apiKey em cookie `accessToken`). |
| **Scalar** | Interface grafica em `/documentation` |

### Error Handler

| Tipo de erro | Status | Causa |
|---|---|---|
| `HTTPException` | Variavel (400-511) | Definida pelo desenvolvedor |
| `ZodError` | 400 | `INVALID_PAYLOAD_FORMAT` |
| `FST_ERR_VALIDATION` | Variavel | `INVALID_PAYLOAD_FORMAT` |
| Erro generico | 500 | `SERVER_ERROR` |

### Registro de Dependencias e Bootstrap

```typescript
registerDependencies();  // Registra 12 repositorios + EmailService

kernel.register(bootstrap, {
  controllers: [...(await loadControllers())],
});
```

Os controllers sao carregados dinamicamente da pasta `application/resources/`, descobrindo recursivamente todos os arquivos `*.controller.ts` (excluindo `*.spec.*`).

### Endpoints de infraestrutura

| Rota | Descricao |
|---|---|
| `/documentation` | Interface Scalar para documentacao da API |
| `/openapi.json` | Especificacao OpenAPI 3.0 em JSON |
| `/storage/*` | Arquivos estaticos do diretorio `_storage/` |
