# Templates de Email

## Visao Geral

O diretorio `templates/` contem os templates de e-mail utilizados pelo backend para envio de mensagens transacionais. Os templates sao escritos em **EJS** (Embedded JavaScript) e renderizados pelo servico `NodemailerEmailService`.

---

## Estrutura

```
templates/
  email/
    approved-update-request.ejs     # Solicitacao de atualizacao aprovada
    rejected-update-request.ejs     # Solicitacao de atualizacao rejeitada
    artisan-piece-relation.ejs      # Nova peca publicada para artesao
```

---

## Templates Disponiveis

### `approved-update-request.ejs`

Enviado ao artesao ou curador quando sua solicitacao de atualizacao de perfil e **aprovada**.

**Variaveis EJS:**

| Variavel | Tipo | Descricao |
|---|---|---|
| `name` | `string` | Nome do usuario |
| `id` | `string` | ID da solicitacao |

**Visual:** Header verde (#10b981), icone de check, mensagem de aprovacao com detalhes da solicitacao.

### `rejected-update-request.ejs`

Enviado ao artesao ou curador quando sua solicitacao de atualizacao de perfil e **rejeitada**.

**Variaveis EJS:**

| Variavel | Tipo | Descricao |
|---|---|---|
| `name` | `string` | Nome do usuario |
| `id` | `string` | ID da solicitacao |

**Visual:** Header vermelho (#ef4444), icone de X, mensagem de rejeicao com dica para enviar nova solicitacao.

### `artisan-piece-relation.ejs`

Enviado ao artesao quando uma nova peca e **publicada** (aprovada pelo curador).

**Variaveis EJS:**

| Variavel | Tipo | Descricao |
|---|---|---|
| `artisan.user.name` | `string` | Nome do artesao |
| `title` | `string` | Titulo da peca |
| `category.name` | `string` | Nome da categoria |
| `technique` | `string` | Tecnica utilizada |
| `materials` | `string \| string[]` | Materiais (exibidos como lista separada por virgula) |
| `symbolism` | `string` | Simbolismo da peca |
| `id` | `string` | Identificador da peca |

**Visual:** Header verde escuro (#059669), detalhes da peca em card (titulo, categoria, tecnica, materiais), citacao do simbolismo em italico.

---

## Uso no Codigo

Os templates sao renderizados pelo metodo `buildTemplate()` do `NodemailerEmailService`:

```typescript
const html = await emailService.buildTemplate({
  template: 'approved-update-request',  // Nome do arquivo sem .ejs
  data: {
    name: 'Artesao Exemplo',
    id: 'uuid-da-solicitacao',
  },
});

await emailService.sendEmail({
  to: ['artesao@email.com'],
  subject: 'Solicitacao Aprovada - MatisCraft',
  body: html,
});
```

Os templates ficam em `backend/templates/email/`. O parametro `template` e o nome do arquivo sem extensao.

---

## Customizacao

Para criar novos templates de e-mail:

1. Adicione um arquivo `.ejs` dentro de `templates/email/`
2. Utilize a sintaxe EJS para interpolar variaveis (ex: `<%= name %>`)
3. Passe os dados necessarios como `Record<string, unknown>` ao chamar o servico de e-mail
4. Todos os templates devem ser HTML responsivo com estilos inline (compatibilidade com clientes de email)
