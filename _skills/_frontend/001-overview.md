# Visao Geral da Arquitetura do Frontend

## Introducao
O frontend do MatisKraft e uma aplicacao React 19 com Server-Side Rendering (SSR) construida com **TanStack Start**, **TypeScript** e **Tailwind CSS v4**. A interface utiliza **shadcn/ui** sobre **Radix UI** para componentes acessiveis e **TanStack Query** para gerenciamento de estado do servidor. O projeto e uma plataforma de artesanato indigena que conecta artesaos, curadores e administradores.

---

## Stack Tecnologica

| Tecnologia | Versao | Funcao |
|---|---|---|
| React | 19.2+ | Biblioteca de UI |
| TanStack Start | 1.132+ | Meta-framework SSR |
| TanStack Router | 1.132+ | Roteamento file-based |
| TanStack Query | 5.66+ | Estado do servidor (cache, fetching) |
| TanStack Form | 1.0+ | Gerenciamento de formularios |
| Vite | 7.1+ | Build tool |
| Nitro | latest | Servidor SSR |
| TypeScript | 5.7+ | Linguagem |
| Tailwind CSS | 4.0+ | Estilizacao utility-first |
| shadcn/ui | -- | Componentes UI (Radix + CVA) |
| Zustand | 5.0+ | Estado local (autenticacao) |
| Zod | 4.1+ | Validacao de schemas |
| Axios | 1.13+ | Cliente HTTP |
| i18next | 25.8+ | Internacionalizacao |
| react-i18next | 16.5+ | Integracao i18n com React |
| Leaflet | 1.9+ | Mapas interativos |
| react-leaflet | 5.0+ | Integracao Leaflet com React |
| Recharts | 2.15+ | Graficos (dashboards) |
| jsPDF | 4.0+ | Geracao de relatorios PDF |
| Lucide React | 0.544+ | Icones |

---

## Autenticacao

A autenticacao e gerenciada via **cookies httpOnly** emitidos pelo backend (JWT). O frontend armazena apenas dados basicos do usuario (nome, email, role, sub) em um store Zustand persistido no localStorage:

```typescript
// src/stores/authentication.ts
export type Authenticated = Pick<IUser, 'name' | 'email' | 'role'> & {
  sub: string;
};
```

O fluxo de login:
1. Formulario envia POST `/authentication/sign-in` com email e senha
2. Backend retorna cookies httpOnly (accessToken + refreshToken)
3. Frontend faz GET `/profile` para obter dados do usuario
4. Dados sao armazenados no Zustand store
5. Redirect para rota padrao do role (`ROLE_DEFAULT_ROUTE`)

---

## Roteamento

O roteamento utiliza **TanStack Router** com file-based routing. As rotas sao geradas automaticamente a partir da estrutura de diretorios em `src/routes/`:

- **`_authentication/`**: Rotas publicas (sign-in, sign-up)
- **`_private/`**: Rotas protegidas com guard de autenticacao
- **`_public/`**: Rotas publicas do site (home, artesaos, pecas, categorias, conteudos culturais)
- **`__root.tsx`**: Layout raiz com HTML head, meta tags e Toaster

---

## Validacao

A validacao de dados e feita com **Zod** em conjunto com **TanStack Form**:

```typescript
const FormSignInSchema = z.object({
  email: z.email('Digite um email valido'),
  password: z.string().min(1, 'A senha e obrigatoria'),
});
```

---

## Gerenciamento de Estado

| Tipo | Tecnologia | Uso |
|---|---|---|
| Estado do servidor | TanStack Query | Cache, fetching, mutations |
| Autenticacao | Zustand + persist | Dados do usuario logado |
| Formularios | TanStack Form + Zod | Estado e validacao de formularios |
| UI (sidebar) | React Context | Estado do sidebar |
| Tema | next-themes | Dark mode |
| Internacionalizacao | i18next + react-i18next | Traducao da interface publica |

---

## Build e Desenvolvimento

| Comando | Descricao |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento (Vite dev server, porta 3000) |
| `npm run build` | Compila para producao (SSR via Nitro, max-old-space-size=4096) |
| `npm start` | Executa o build de producao (`node .output/server/index.mjs`) |
| `npm run preview` | Preview do build |
| `npm test` | Executa testes com Vitest |
| `npm run lint` | Prettier + ESLint com auto-fix |

---

## Estrutura de Diretorios

```
frontend/
├── public/                     # Arquivos estaticos
│   ├── favicon.png             # Icone do navegador
│   └── ...
├── src/
│   ├── components/
│   │   ├── ui/                 # ~40 componentes shadcn/Radix (inclui map-container, chart)
│   │   └── common/             # ~36 componentes de negocio
│   ├── hooks/
│   │   ├── tanstack-query/     # Hooks de query/mutation
│   │   │   ├── _query-keys.ts  # Chaves de cache (PROFILE)
│   │   │   ├── use-authentication-sign-in.ts
│   │   │   ├── use-artisan-update-request.ts
│   │   │   ├── use-curator-update-request.ts
│   │   │   └── use-profile.ts
│   │   ├── use-debounced-value.ts
│   │   └── use-mobile.ts
│   ├── integrations/
│   │   ├── tanstack-form/      # Form hook, fields, validacao
│   │   └── tanstack-query/     # Provider, devtools, SSR
│   ├── lib/
│   │   ├── entities.ts         # Tipos TypeScript (IUser, IArtisan, ICurator, IPiece, etc.)
│   │   ├── interfaces.ts       # IHTTPExceptionError
│   │   ├── constants/          # request-badges.ts
│   │   ├── api.ts              # Axios instance
│   │   ├── query-client.ts     # QueryClient config
│   │   ├── pdf-builder.ts      # Classe PDFBuilder (jsPDF)
│   │   ├── reports/            # 7 geradores de relatorios PDF
│   │   ├── utils.ts            # Funcao cn()
│   │   └── utils/              # access-permissions, format-phone, format-price, get-changed-fields, menu
│   ├── routes/
│   │   ├── __root.tsx          # Layout raiz
│   │   ├── _authentication/    # Sign-in, sign-up
│   │   ├── _private/           # Rotas protegidas
│   │   │   ├── layout.tsx      # Guard + sidebar + header
│   │   │   ├── administrator/  # Dashboard e CRUD admin
│   │   │   ├── artisan/        # Dashboard e CRUD artesao
│   │   │   ├── curator/        # Dashboard e CRUD curador
│   │   │   └── profile/        # Perfil do usuario
│   │   └── _public/            # Site publico (home, artesaos, pecas, categorias, conteudos)
│   ├── stores/
│   │   └── authentication.ts   # Zustand store
│   ├── env.ts                  # T3 Env (variaveis de ambiente)
│   ├── router.tsx              # Configuracao do router
│   ├── routeTree.gen.ts        # Arvore de rotas (auto-gerada)
│   └── styles.css              # Estilos globais (Tailwind v4)
├── components.json             # Configuracao shadcn/ui
├── Dockerfile-local            # Docker para desenvolvimento
├── Dockerfile-production       # Docker para producao
├── docker-entrypoint.sh        # Script de entrada (substituicao de URL)
├── vite.config.ts              # Configuracao Vite
├── tsconfig.json               # Configuracao TypeScript
├── eslint.config.js            # Configuracao ESLint
└── prettier.config.js          # Configuracao Prettier
```

---

## Sistema de Roles

O sistema de permissoes no frontend possui 3 roles:

| Role | Menu Sidebar | Acesso |
|---|---|---|
| **ADMINISTRATOR** | Inicio, Artesaos, Solicitacoes Artesaos, Curadores, Solicitacoes Curadores, Solicitacoes Pecas, Pecas, Solicitacoes Conteudos, Conteudos Culturais, Perfil | Acesso total ao sistema |
| **CURATOR** | Inicio, Artesaos, Solicitacoes Artesaos, Solicitacoes Pecas, Pecas, Solicitacoes Conteudos, Conteudos Culturais, Perfil | Curadoria de pecas e conteudos |
| **ARTISAN** | Inicio, Solicitacoes Pecas, Pecas, Solicitacoes Conteudos, Conteudos Culturais, Perfil | Gerenciamento de pecas proprias e conteudos |

---

## Internacionalizacao (i18n)

O site publico (`_public/`) utiliza **i18next** e **react-i18next** para suporte a multiplos idiomas. A troca de idioma e feita pelo componente `LanguageSwitcher` presente na `Navbar`.

---

## Relatorios PDF

O sistema possui 7 geradores de relatorios PDF em `src/lib/reports/`, utilizando a classe `PDFBuilder` (wrapper sobre jsPDF):

| Relatorio | Arquivo |
|---|---|
| Artesaos | `artisans-report.ts` |
| Solicitacoes de Atualizacao de Artesaos | `artisan-update-requests-report.ts` |
| Solicitacoes de Conteudos Culturais | `cultural-content-requests-report.ts` |
| Conteudos Culturais | `cultural-contents-report.ts` |
| Operacoes de Curador | `curator-operations-report.ts` |
| Solicitacoes de Pecas | `piece-requests-report.ts` |
| Pecas | `pieces-report.ts` |
