# Recurso: Villages

Listagem publica de aldeias/comunidades indigenas.

## Endpoints

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| GET | `/villages` | Opcional | Listar todas as aldeias |

## Arquitetura

```
application/resources/villages/
  find-all.controller.ts
  find-all.use-case.ts
  find-all.use-case.spec.ts
  find-all.controller.spec.ts
  find-all.doc.ts
```

## GET `/villages` -- Listar aldeias

- **Auth**: Opcional (`AuthenticationMiddleware({ optional: true })`)
- **Resposta 200**: Array de aldeias com todos os campos

### Modelo Village

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | `String (UUID)` | Identificador |
| `name` | `String` | Nome da aldeia |
| `region` | `String` | Regiao |
| `description` | `String` | Descricao |
| `latitude` | `Decimal` | Latitude (coordenada geografica) |
| `longitude` | `Decimal` | Longitude (coordenada geografica) |
| `created_at` | `DateTime` | Data de criacao |
| `updated_at` | `DateTime` | Data de atualizacao |

### Exemplo de resposta

```json
[
  {
    "id": "uuid",
    "name": "Aldeia Paraiso",
    "region": "Norte",
    "description": "Aldeia localizada na Terra Indigena Vale do Javari, Amazonas",
    "latitude": -5.875472,
    "longitude": -70.938,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```
