# Schemas de Validacao

Documentacao dos schemas Zod utilizados para validacao de formularios no frontend do MatisKraft.

**Dependencia principal:** [Zod](https://zod.dev/) v4 -- biblioteca de validacao de schemas com inferencia de tipos.

---

## 1. Visao Geral

Os schemas de validacao sao definidos diretamente nos componentes de formulario (sign-in, sign-up, perfil) utilizando Zod em conjunto com TanStack Form. Nao existe um arquivo centralizado `schemas.ts` -- cada formulario define seu proprio schema.

Os schemas estao organizados por funcionalidade:

| Grupo | Descricao |
|-------|-----------|
| Autenticacao | Login e cadastro (sign-in, sign-up) |
| Perfil | Atualizacao de dados do perfil |

---

## 2. Schema de Sign-In (Login)

**Arquivo:** `src/routes/_authentication/_sign-in/index.tsx`

```typescript
const FormSignInSchema = z.object({
  email: z.email('Digite um email valido'),
  password: z
    .string({ message: 'A senha e obrigatoria' })
    .min(1, 'A senha e obrigatoria'),
});
```

| Campo | Tipo | Regras |
|-------|------|--------|
| `email` | `string` | Formato de email valido |
| `password` | `string` | Obrigatorio, minimo 1 caractere |

---

## 3. Schema de Sign-Up (Cadastro)

**Arquivo:** `src/routes/_authentication/sign-up/index.tsx`

```typescript
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;

const FormSignUpSchema = z
  .object({
    name: z
      .string({ message: 'O nome e obrigatorio' })
      .min(1, 'O nome e obrigatorio'),
    email: z
      .string({ message: 'O email e obrigatorio' })
      .email('Digite um email valido'),
    password: z
      .string({ message: 'A senha e obrigatoria' })
      .min(6, 'A senha deve ter no minimo 6 caracteres')
      .regex(passwordRegex,
        'A senha deve conter: 1 maiuscula, 1 minuscula, 1 numero e 1 especial'),
    confirmPassword: z
      .string({ message: 'A confirmacao de senha e obrigatoria' })
      .min(1, 'A confirmacao de senha e obrigatoria'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas nao coincidem',
    path: ['confirmPassword'],
  });
```

| Campo | Tipo | Regras |
|-------|------|--------|
| `name` | `string` | Obrigatorio, minimo 1 caractere |
| `email` | `string` | Obrigatorio, formato de email valido |
| `password` | `string` | Minimo 6 caracteres + regex de complexidade |
| `confirmPassword` | `string` | Obrigatorio, deve coincidir com `password` |

### Requisitos da Senha (PASSWORD_REGEX)

| Requisito | Regex | Descricao |
|-----------|-------|-----------|
| Minuscula | `(?=.*[a-z])` | Pelo menos 1 letra minuscula |
| Maiuscula | `(?=.*[A-Z])` | Pelo menos 1 letra maiuscula |
| Numero | `(?=.*\d)` | Pelo menos 1 digito |
| Especial | `(?=.*[!@#$%^&*(),.?":{}|<>])` | Pelo menos 1 caractere especial |

---

## 4. Uso com TanStack Form

Os schemas sao integrados via a propriedade `validators.onSubmit`:

```typescript
const form = useForm({
  defaultValues: {
    email: '',
    password: '',
  },
  validators: {
    onSubmit: FormSignInSchema,
  },
  onSubmit: async function ({ value: payload }) {
    await signInMutation.mutateAsync(payload);
  },
});
```

---

## 5. Tabela Resumo

| Schema | Arquivo | Campos | Descricao |
|--------|---------|--------|-----------|
| `FormSignInSchema` | `_authentication/_sign-in/index.tsx` | `email`, `password` | Login |
| `FormSignUpSchema` | `_authentication/sign-up/index.tsx` | `name`, `email`, `password`, `confirmPassword` | Cadastro |
