# Autenticação – Contratos de API (Frontend)

Este documento descreve os contratos de autenticação consumidos pelo frontend. Todas as URLs assumem o prefixo global `api` configurado no servidor.

## Registro (signup)

- URL: `POST /api/auth/register`
- Payload:
  - `email` (string, e-mail válido)
  - `password` (string, mínimo 6 caracteres)
  - `name` (string, mínimo 2 caracteres)
- Resposta (sucesso):
  - Status: `201`
  - Body:
    ```json
    {
      "accessToken": "<jwt>",
      "user": { "id": "<uuid>", "email": "<email>", "name": "<name>" }
    }
    ```
- Erros:
  - `400` — Email already registered
  - `422` — validação de payload (por ValidationPipe)
  - `500` — erro inesperado

## Login

- URL: `POST /api/auth/login`
- Payload:
  - `email` (string, e-mail válido)
  - `password` (string, mínimo 6 caracteres)
- Resposta (sucesso):
  - Status: `201` (padrão NestJS em POST)
  - Body:
    ```json
    {
      "accessToken": "<jwt>",
      "user": { "id": "<uuid>", "email": "<email>", "name": "<name>" }
    }
    ```
- Erros:
  - `401` — Invalid credentials
  - `429` — Account temporarily locked due to failed attempts (proteção contra brute-force)
  - `422` — validação de payload
  - `500` — erro inesperado
- Observação:
  - Se preferir `200` para login, podemos ajustar o controlador para retornar `200`.

## Esqueci minha senha (lost password)

- URL: `POST /api/auth/forgot-password`
- Payload:
  - `email` (string, e-mail válido)
- Resposta (sucesso):
  - Status: `201`
  - Body:
    ```json
    {
      "message": "password reset requested",
      "resetToken": "<jwt_reset_15m>"
    }
    ```
- Erros:
  - `400` — Email not found
  - `422` — validação de payload
  - `500` — erro inesperado
- Observações:
  - O envio de e-mail está stubado no backend; em produção, integrar provedor (SES, SendGrid, etc.).
  - O `resetToken` expira em 15 minutos.

## Signup com Google (proposta)

- Status: não implementado no código atual.
- Contrato proposto para o frontend:
  - URL: `POST /api/auth/google`
  - Payload:
    - `idToken` (string) — token do Google obtido no frontend (One Tap / OAuth)
  - Resposta (sucesso):
    - Status: `201`
    - Body:
      ```json
      {
        "accessToken": "<jwt>",
        "user": { "id": "<uuid>", "email": "<email>", "name": "<name>" }
      }
      ```
  - Erros:
    - `401` — token inválido ou não verificável
    - `400` — dados faltando (`idToken`)
    - `500` — erro inesperado
  - Notas técnicas:
    - Backend valida `idToken` com `GOOGLE_CLIENT_ID`.
    - Se não houver usuário, cria com base no perfil do Google; senão, autentica.

## Cabeçalhos e autenticação subsequente

- Autorização:
  - Usar `Authorization: Bearer <accessToken>` em chamadas autenticadas.
- Content-Type:
  - `Content-Type: application/json` em `POST`.

## Exemplos de uso

### Signup

```bash
curl -sS -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","password":"Password123","name":"John"}'
```

### Login

```bash
curl -sS -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","password":"Password123"}'
```

### Lost password

```bash
curl -sS -X POST http://localhost:3000/api/auth/forgot-password \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com"}'
```

---

Manter este arquivo atualizado ajuda o frontend e o backend a permanecerem alinhados quanto aos contratos e status codes.