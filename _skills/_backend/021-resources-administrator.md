# Recurso: Administrator

Acoes exclusivas do administrador: gerenciamento de artesaos, curadores, categorias e perfil administrativo.

## Endpoints

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| POST | `/administrator/artisans` | ADMINISTRATOR | Criar artesao |
| GET | `/administrator/artisans/:id` | ADMINISTRATOR | Buscar artesao por ID |
| DELETE | `/administrator/artisans/:id` | ADMINISTRATOR | Excluir artesao |
| PATCH | `/administrator/artisans/:id/approval` | ADMINISTRATOR | Aprovar/rejeitar cadastro de artesao |
| GET | `/administrator/artisans/update-requests` | ADMINISTRATOR | Listar solicitacoes de atualizacao de artesaos |
| GET | `/administrator/artisans/update-requests/:id` | ADMINISTRATOR | Ver detalhes de solicitacao de artesao |
| PUT | `/administrator/artisans/update-requests/:id` | ADMINISTRATOR | Aprovar/rejeitar solicitacao de atualizacao de artesao |
| POST | `/administrator/categories` | ADMINISTRATOR | Criar categoria |
| PUT | `/administrator/categories/:id` | ADMINISTRATOR | Atualizar categoria |
| DELETE | `/administrator/categories/:id` | ADMINISTRATOR | Excluir categoria |
| POST | `/administrator/curators` | ADMINISTRATOR | Criar curador |
| GET | `/administrator/curators` | ADMINISTRATOR | Listar curadores |
| GET | `/administrator/curators/:id` | ADMINISTRATOR | Buscar curador por ID |
| DELETE | `/administrator/curators/:id` | ADMINISTRATOR | Excluir curador |
| GET | `/administrator/curators/update-requests` | ADMINISTRATOR | Listar solicitacoes de atualizacao de curadores |
| GET | `/administrator/curators/update-requests/:id` | ADMINISTRATOR | Ver detalhes de solicitacao de curador |
| PUT | `/administrator/curators/update-requests/:id` | ADMINISTRATOR | Aprovar/rejeitar solicitacao de curador |
| POST | `/administrator/update` | ADMINISTRATOR | Atualizar perfil do admin |

## Arquitetura

```
application/resources/administrator/
  artisans/
    create/
    find-by-id/
    delete/
    approve-registration/
    find-update-requests/
    show-update-request/
    approve-update-request/
  categories/
    create/
    update/
    delete/
  curators/
    create/
    find-all/
    find-by-id/
    delete/
    find-update-requests/
    show-update-request/
    approve-update-request/
  profile/
    update/
```

Todos os endpoints exigem `AuthenticationMiddleware({ optional: false })` e `PermissionMiddleware({ allowedRoles: [ERole.ADMINISTRATOR] })`.

## POST `/administrator/artisans` -- Criar artesao

- **Body**: Dados do usuario (name, email, password, phone) + dados do artesao (bio, ethnicity, village_id, avatar_id, affiliation_proof_id)
- **Resposta 200**: Artesao criado com status aprovado

## PATCH `/administrator/artisans/:id/approval` -- Aprovar/rejeitar cadastro

- **Params**: `id` (UUID do artesao)
- **Body**: `{ approved: boolean }`
- **Resposta 200**: Artesao atualizado

## PUT `/administrator/artisans/update-requests/:id` -- Aprovar/rejeitar atualizacao

- **Params**: `id` (UUID da solicitacao)
- **Body**: `{ status: "APPROVED" | "REJECTED" }`
- **Descricao**: Envia email de notificacao (approved-update-request ou rejected-update-request)

## POST `/administrator/categories` -- Criar categoria

- **Body**: `{ name, description, slug, image_id }`
- **Resposta 201**: Categoria criada

## POST `/administrator/curators` -- Criar curador

- **Body**: Dados do usuario (name, email, password, phone) + dados do curador (bio, specialization, institution, academic_background, years_of_experience, avatar_id, credential_proof_id)
- **Resposta 200**: Curador criado

## POST `/administrator/update` -- Atualizar perfil admin

- **Body**: Campos opcionais: `name`, `email`, `phone`, `password`
- **Resposta 201**: Perfil atualizado
