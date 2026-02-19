# Recurso: Storage

Upload e exclusao de arquivos. Os arquivos sao armazenados localmente no diretorio `_storage/` e servidos estaticamente pelo Fastify.

## Endpoints

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| POST | `/storage` | Opcional | Upload de arquivo(s) |
| DELETE | `/storage/:id` | Opcional | Excluir arquivo |

## Arquitetura

```
application/resources/storage/
  upload/
    upload.controller.ts
    upload.use-case.ts
    upload.doc.ts
  delete/
    delete.controller.ts
    delete.use-case.ts
    delete.doc.ts
```

## POST `/storage` -- Upload

- **Auth**: Opcional (`AuthenticationMiddleware({ optional: true })`)
- **Content-Type**: `multipart/form-data`
- **Body**: Um ou mais arquivos via multipart
- **Limite**: 5MB por arquivo (configurado no kernel via `@fastify/multipart`)
- **Resposta 201**: Array de objetos Storage criados

### Processamento de imagens

Imagens (JPEG, PNG, GIF, BMP, TIFF) sao automaticamente:
- Redimensionadas para max 1200x1200 pixels (mantendo proporcao)
- Convertidas para formato WebP com qualidade 80%

Outros tipos de arquivo sao armazenados sem processamento.

### Resposta de sucesso

```json
[
  {
    "id": "uuid",
    "filename": "45678901.webp",
    "url": "http://localhost:4000/storage/45678901.webp",
    "mimetype": "image/webp",
    "original_name": "foto-perfil.png",
    "size": 102400
  }
]
```

## DELETE `/storage/:id` -- Excluir arquivo

- **Auth**: Opcional (`AuthenticationMiddleware({ optional: true })`)
- **Params**: `id` (UUID do registro Storage)
- **Resposta 200**: `{ message: "File deleted successfully", deletedAt: "ISO date" }`
- **Erros**: 404 (arquivo nao encontrado)

### Fluxo de exclusao

1. Busca o registro Storage por ID no banco
2. Remove o arquivo fisico do diretorio `_storage/`
3. Remove o registro do banco de dados
4. Retorna confirmacao

## Observacoes

- O upload retorna o UUID do Storage, que deve ser usado em campos como `avatar_id`, `image_id`, `affiliation_proof_id`, etc.
- Arquivos sao servidos estaticamente em `/storage/<filename>` pelo plugin `@fastify/static`
- O nome do arquivo no disco e um ID numerico aleatorio para evitar conflitos
