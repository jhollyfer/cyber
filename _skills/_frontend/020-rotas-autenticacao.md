# Rotas de Autenticacao

Documentacao das rotas de autenticacao do MatisKraft: sign-in (login) e sign-up (cadastro de artesao). Localizadas em `src/routes/_authentication/`.

---

## Visao Geral

| Rota | Arquivo | Descricao |
|------|---------|-----------|
| `/sign-in` | `src/routes/_authentication/sign-in.tsx` | Formulario de login |
| `/sign-up` | `src/routes/_authentication/sign-up/index.tsx` | Formulario de cadastro de artesao |
| `/sign-up/success` | `src/routes/_authentication/sign-up/success.tsx` | Pagina de sucesso apos cadastro |

Todas as rotas estao dentro do layout `_authentication`, que e um layout sem autenticacao (publico).

---

## Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| `@tanstack/react-form` (`useForm`) | Gerenciamento de formularios |
| `@tanstack/react-router` | Roteamento e navegacao |
| `@tanstack/react-query` (`useMutation`) | Mutations HTTP |
| `zod` | Validacao de schema |
| `axios` / `AxiosError` | Requisicoes HTTP e tratamento de erros |
| `sonner` | Notificacoes toast |
| `Zustand` | Store de autenticacao |

---

## Sign-In (Login)

**Arquivo:** `src/routes/_authentication/sign-in.tsx`

### Rota

```tsx
export const Route = createFileRoute('/_authentication/sign-in')({
  component: RouteComponent,
});
```

### Schema de Validacao

```tsx
const FormSignInSchema = z.object({
  email: z.email('Digite um e-mail valido').min(1, 'E-mail e obrigatorio'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .min(1, 'Senha e obrigatoria'),
});
```

| Campo | Tipo | Validacao |
|-------|------|-----------|
| `email` | `string` | Formato de email valido |
| `password` | `string` | Obrigatorio, minimo 6 caracteres |

### Fluxo de Login

```
1. Usuario preenche email e senha
2. Clica em "Entrar" -> form.handleSubmit()
3. Validacao Zod (onSubmit) e executada
4. Se valido: signInMutation.mutateAsync(payload)
5. Hook useAuthenticationSignIn chama POST /authentication/sign-in
6. Em caso de SUCESSO:
   a. Busca perfil via API.get<IUser>('/profile')
   b. Salva no store Zustand:
      authentication.setAuthenticated({
        name: profile.name,
        email: profile.email,
        role: profile.role,
        sub: profile.id
      })
   c. Define o perfil no cache do TanStack Query
   d. Determina rota padrao por role: ROLE_DEFAULT_ROUTE[profile.role]
   e. Navega para a rota: router.navigate({ to: route, replace: true })
   f. Exibe toast de sucesso
7. Em caso de ERRO:
   a. 401 USER_NOT_APPROVED -> Toast "Cadastro em analise"
   b. Outros AxiosError -> Erro nos campos email/password
   c. Erro generico -> Toast de erro
```

### Tratamento de Erros

| Codigo HTTP | Causa | Comportamento |
|------------|-------|---------------|
| 401 | `USER_NOT_APPROVED` | Toast informando que o cadastro esta em analise pelo curador |
| 401 | Outros | Erro no campo email com mensagem do servidor |
| Outros | - | Toast generico de erro |

### Links

- Link para cadastro: `/sign-up`
- Link para pagina inicial: `/`

---

## Sign-Up (Cadastro de Artesao)

**Arquivo:** `src/routes/_authentication/sign-up/index.tsx`

O cadastro e exclusivamente para artesaos e utiliza um formulario multi-secoes com navegacao via `ScrollSpy`.

### Rota

```tsx
export const Route = createFileRoute('/_authentication/sign-up/')({
  component: RouteComponent,
});
```

### Schema de Validacao

```tsx
const FormSignUpArtisanSchema = z.object({
  name: z.string().trim().refine(
    (value) => value.split(' ').length >= 2,
    'Informe um Nome Completo',
  ),
  email: z.email('Informe um email valido').trim(),
  password: z.string().trim()
    .min(8, 'A senha deve ter no minimo 8 caracteres')
    .regex(/[A-Z]/, 'Pelo menos uma letra maiuscula')
    .regex(/[a-z]/, 'Pelo menos uma letra minuscula')
    .regex(/[0-9]/, 'Pelo menos um numero')
    .regex(/[^A-Za-z0-9]/, 'Pelo menos um caractere especial'),
  phone: z.string().trim()
    .min(1, 'O celular e obrigatorio')
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato invalido'),
  ethnicity: z.string().min(1, 'A etnia e obrigatoria').trim(),
  bio: z.string().min(1, 'A biografia e obrigatoria').trim(),
  village_id: z.string().min(1, 'A vila e obrigatoria'),
  avatar: z.array(z.custom<File>()).min(1).max(1),
  avatar_id: z.string(),
  affiliation_proof: z.array(z.custom<File>()).min(1).max(1),
  affiliation_proof_id: z.string(),
});
```

### Secoes do Formulario

| Secao | Campos | Descricao |
|-------|--------|-----------|
| Dados Pessoais | `name`, `email`, `password`, `phone` | Dados basicos do usuario |
| Informacoes Culturais | `ethnicity`, `village_id`, `bio` | Dados culturais do artesao |
| Comprovantes | `avatar`, `affiliation_proof` | Upload de foto de perfil e comprovante de afiliacao |

### Campos Especiais

| Campo | Componente | Tratamento |
|-------|-----------|------------|
| `phone` | `InputGroupInput` | Formatacao automatica `(XX) XXXXX-XXXX` |
| `password` | `InputGroupInput` | Validacao em tempo real (onChange) com regex |
| `village_id` | `VillageCombobox` | Selecao de vila/aldeia via combobox |
| `avatar` | `FileUploadWithStorage` | Upload com integracao ao storage backend |
| `affiliation_proof` | `FileUploadWithStorage` | Upload de comprovante de afiliacao |

### Fluxo de Cadastro

```
1. Usuario preenche as tres secoes do formulario
2. Faz upload do avatar e comprovante de afiliacao
3. Clica em "Finalizar Cadastro" -> form.handleSubmit()
4. Verifica se uploads estao em andamento (bloqueia se sim)
5. Verifica se avatar_id e affiliation_proof_id existem
6. Validacao Zod (onSubmit) e executada
7. Se valido: signUpMutation.mutateAsync(data)
8. API POST /authentication/sign-up com todos os campos
9. Em caso de SUCESSO:
   a. Toast de sucesso
   b. Redireciona para /sign-up/success
10. Em caso de ERRO:
    a. 409 USER_EMAIL_ALREADY_EXISTS -> Erro no campo email
    b. 409 USER_PHONE_ALREADY_EXISTS -> Erro no campo phone
    c. Outros -> Toast de erro generico
```

### Tratamento de Erros

| Codigo HTTP | Causa | Comportamento |
|------------|-------|---------------|
| 409 | `USER_EMAIL_ALREADY_EXISTS` | Erro no campo email: "Este e-mail ja esta cadastrado" |
| 409 | `USER_PHONE_ALREADY_EXISTS` | Erro no campo phone: "Este celular ja esta cadastrado" |
| Outros | - | Toast generico: "Erro ao realizar cadastro" |

---

## Store de Autenticacao (Zustand)

O `useAuthenticationStore` e um store Zustand que gerencia o estado de autenticacao:

```tsx
type Authenticated = Pick<IUser, 'name' | 'email' | 'role'> & {
  sub: string;
};
```

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `name` | `string` | Nome do usuario |
| `email` | `string` | Email do usuario |
| `role` | `'ADMINISTRATOR' \| 'ARTISAN' \| 'CURATOR'` | Papel do usuario |
| `sub` | `string` | ID unico do usuario |

### Redirecionamento por Role

Apos login bem-sucedido, o usuario e redirecionado para a rota padrao do seu papel:

```tsx
const route = ROLE_DEFAULT_ROUTE[profile.role];
router.navigate({ to: route, replace: true });
```

| Role | Rota Padrao |
|------|-------------|
| `ADMINISTRATOR` | `/administrator` |
| `CURATOR` | `/curator` |
| `ARTISAN` | `/artisan` |

O mapeamento `ROLE_DEFAULT_ROUTE` e definido em `src/lib/utils/access-permissions.ts`.

---

## Componentes de UI Utilizados

| Componente | Import | Descricao |
|-----------|--------|-----------|
| `Button` | `@/components/ui/button` | Botao de submit |
| `Field`, `FieldLabel`, `FieldError`, `FieldGroup`, `FieldDescription` | `@/components/ui/field` | Estrutura de campos |
| `InputGroup`, `InputGroupInput`, `InputGroupAddon`, `InputGroupButton`, `InputGroupTextarea` | `@/components/ui/input-group` | Inputs com addons |
| `Spinner` | `@/components/ui/spinner` | Indicador de carregamento |
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetTrigger` | `@/components/ui/sheet` | Menu mobile no sign-up |
| `ScrollSpy`, `ScrollSpyNav`, `ScrollSpyLink`, `ScrollSpySection`, `ScrollSpyViewport` | `@/components/common/scroll-spy` | Navegacao por secoes no sign-up |
| `VillageCombobox` | `@/components/common/village-combobox` | Selecao de vila |
| `FileUploadWithStorage` | `@/components/common/file-upload-with-storage` | Upload de arquivos |
