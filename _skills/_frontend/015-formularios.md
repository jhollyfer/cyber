# Sistema de Formularios

Documentacao do sistema de formularios do frontend MatisKraft. Os formularios utilizam diretamente `useForm` do TanStack Form, com validacao via Zod schemas. Nao ha `createFormHook` ou campos registrados -- todos os campos sao construidos inline usando componentes de UI do shadcn/ui.

---

## Visao Geral

O sistema de formularios e composto por:

| Elemento                          | Descricao                                          |
|-----------------------------------|----------------------------------------------------|
| `@tanstack/react-form` (`useForm`)| Hook principal para gerenciar estado de formularios |
| `zod` (schemas)                   | Validacao de dados                                 |
| Componentes UI (`Field`, etc.)    | Componentes visuais de `src/components/ui/field.tsx`|
| Componentes UI (`InputGroup`)     | Inputs composicionais de `src/components/ui/input-group.tsx` |
| Comboboxes customizados           | Comboboxes de dominio (Village, Category, etc.)    |
| `FileUploadWithStorage`           | Upload de arquivos com integracao ao backend       |

---

## Padrao de Formulario

O MatisKraft utiliza `useForm` do TanStack Form diretamente (sem `createFormHook`). Cada formulario define seus `defaultValues`, `validators` (schema Zod) e `onSubmit`:

```tsx
import { useForm } from '@tanstack/react-form';
import z from 'zod';

const MySchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  email: z.email('Email invalido'),
});

function MyFormComponent(): React.JSX.Element {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
    validators: {
      onSubmit: MySchema,
    },
    onSubmit: async ({ value: payload }) => {
      await mutation.mutateAsync(payload);
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
    </form>
  );
}
```

---

## Formularios da Aplicacao

### Sign-In (Login)

**Arquivo:** `src/routes/_authentication/sign-in.tsx`

| Campo      | Tipo     | Validacao                     | Icone       |
|------------|----------|-------------------------------|-------------|
| `email`    | `string` | Email valido, obrigatorio     | `MailIcon`  |
| `password` | `string` | Minimo 6 caracteres           | `LockIcon`  |

Fluxo: Chama `useAuthenticationSignIn`, busca perfil via `API.get('/profile')`, salva no Zustand store, redireciona por role.

### Sign-Up (Cadastro de Artesao)

**Arquivo:** `src/routes/_authentication/sign-up/index.tsx`

O formulario de cadastro e mais extenso, com tres secoes navegaveis via `ScrollSpy`:

| Secao                  | Campos                                              |
|------------------------|------------------------------------------------------|
| Dados Pessoais         | `name`, `email`, `password`, `phone`                |
| Informacoes Culturais  | `ethnicity`, `village_id` (VillageCombobox), `bio`  |
| Comprovantes           | `avatar` (FileUpload), `affiliation_proof` (FileUpload) |

Campos com tratamento especial:
- **phone**: Formatacao automatica para `(XX) XXXXX-XXXX`
- **password**: Validacao em tempo real (`onChange`) com regex para maiuscula, minuscula, numero e caractere especial
- **village_id**: Usa `VillageCombobox` para selecao de vila/aldeia
- **avatar** e **affiliation_proof**: Usam `FileUploadWithStorage` com upload ao backend, armazenando o `storage_id` retornado

---

## Componentes de Formulario Utilizados

### Componentes do shadcn/ui

| Componente          | Import                       | Descricao                              |
|---------------------|------------------------------|----------------------------------------|
| `Field`             | `@/components/ui/field`      | Container de campo individual          |
| `FieldLabel`        | `@/components/ui/field`      | Label do campo                         |
| `FieldError`        | `@/components/ui/field`      | Mensagem de erro                       |
| `FieldGroup`        | `@/components/ui/field`      | Grupo de campos com gap                |
| `FieldDescription`  | `@/components/ui/field`      | Texto descritivo                       |
| `InputGroup`        | `@/components/ui/input-group`| Container do input com addons          |
| `InputGroupInput`   | `@/components/ui/input-group`| Input de texto                         |
| `InputGroupTextarea`| `@/components/ui/input-group`| Area de texto                          |
| `InputGroupAddon`   | `@/components/ui/input-group`| Addon (icone, botao)                   |
| `InputGroupButton`  | `@/components/ui/input-group`| Botao dentro do addon                  |
| `Button`            | `@/components/ui/button`     | Botao de submit                        |
| `Spinner`           | `@/components/ui/spinner`    | Indicador de carregamento              |

### Comboboxes de Dominio

| Componente          | Import                                   | Descricao                          |
|---------------------|------------------------------------------|------------------------------------|
| `VillageCombobox`   | `@/components/common/village-combobox`   | Selecao de vila/aldeia             |
| `CategoryCombobox`  | `@/components/common/category-combobox`  | Selecao de categoria de peca       |
| `ArtisanCombobox`   | `@/components/common/artisan-combobox`   | Selecao de artesao                 |
| `CuratorCombobox`   | `@/components/common/curator-combobox`   | Selecao de curador                 |

### Upload de Arquivos

| Componente              | Import                                         | Descricao                              |
|-------------------------|-------------------------------------------------|----------------------------------------|
| `FileUpload`            | `@/components/common/file-upload`               | Upload generico com dropzone           |
| `FileUploadWithStorage` | `@/components/common/file-upload-with-storage`  | Upload com integracao ao backend storage|

---

## Padrao de Validacao

O campo e considerado invalido quando:
- `isTouched` e `true` (o usuario interagiu com o campo)
- `isValid` e `false` (existe pelo menos uma regra de validacao que falhou)

```tsx
const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
```

Os erros sao extraidos de `field.state.meta.errors` e passados para o componente `FieldError`:

```tsx
{isInvalid && <FieldError errors={field.state.meta.errors} />}
```

---

## Padrao de Tratamento de Erros do Servidor

Os formularios tratam erros HTTP usando `AxiosError` e mapeiam para campos especificos via `form.setFieldMeta`:

```tsx
if (error instanceof AxiosError) {
  const data = error.response?.data as IHTTPExceptionError | undefined;

  if (data?.code === 409 && data.cause === 'USER_EMAIL_ALREADY_EXISTS') {
    form.setFieldMeta('email', (prev) => ({
      ...prev,
      isTouched: true,
      errors: [{ message: 'Este e-mail ja esta cadastrado' }],
      errorMap: {
        onSubmit: { message: 'Este e-mail ja esta cadastrado' },
      },
    }));
    return;
  }
}
```

---

## Fluxo Completo de um Formulario

```
1. Componente chama useForm com defaultValues e validators (Zod schema)
2. form.Field renderiza cada campo com name e children render prop
3. Dentro do children, o campo recebe field.state.value, field.handleChange, field.handleBlur
4. Usuario interage -> handleChange atualiza o estado
5. handleBlur marca o campo como tocado (isTouched)
6. No submit, o schema Zod valida todos os campos
7. Se invalido, erros sao exibidos via FieldError
8. Se valido, onSubmit recebe os valores tipados
9. Em caso de erro HTTP, form.setFieldMeta mapeia erros do servidor para campos
```
