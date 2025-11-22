# Endpoints de Usuários

Este documento descreve os endpoints relacionados a usuários consumidos pelo frontend.

## Verificar se um e‑mail está cadastrado

- Método: `GET`
- Caminho: `/api/users/exists`
- Query: `email` (obrigatório)
- Autenticação: `Authorization: Bearer <JWT_TOKEN>` (obrigatório)
- Resposta (sucesso):

```json
{ "email": "<email>", "exists": true }
```

Ou:

```json
{ "email": "<email>", "exists": false }
```

### Exemplos de uso

Curl:

```bash
curl -sS -X GET \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  "http://localhost:8080/api/users/exists?email=sandbox.tester%2B123@example.com"
```

JavaScript (frontend):

```js
import { API } from "../src/lib/api";

const res = await API.users.exists("sandbox.tester+123@example.com");
if (!res?.error) {
  console.log(res.exists ? "Email cadastrado" : "Email não cadastrado");
}
```

JavaScript (com JWT automático):

```js
import { withAuth } from "../src/lib/api";

const api = withAuth();
const res = await api.get(`/api/users/exists?email=${encodeURIComponent(email)}`);
```

### Erros comuns

- `401 Unauthorized`: token ausente ou inválido
- `400 Bad Request`: parâmetro `email` ausente

### Observações

- Em desenvolvimento, o base URL padrão é `http://localhost:8080`. Em produção, `https://api.pedrodapps.com`.
- Para sobrepor o base URL, defina `VITE_API_BASE_URL` no `.env`.
- O `withAuth()` injeta `Authorization: Bearer <token>` automaticamente se `pdapps_auth` contiver `token` ou `jwt`.