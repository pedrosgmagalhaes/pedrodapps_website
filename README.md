# Pedro dApps Website

Site institucional da Pedro dApps desenvolvido em React com Vite.

## 🚀 Tecnologias

- React 19
- Vite 7
- ESLint
- CSS modular

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- Yarn

### Instalação

```bash
# Instalar dependências
yarn

# Iniciar desenvolvimento
yarn dev
```

### Scripts

- `yarn dev` - Servidor de desenvolvimento
- `yarn build` - Build de produção
- `yarn preview` - Preview do build
- `yarn lint` - Verificação de código

## 📁 Estrutura

```
src/
├── components/     # Componentes React
├── assets/         # Imagens e ícones
├── App.jsx         # Componente principal
└── index.css       # Estilos globais
```

## ✨ Funcionalidades

- Animações de scroll reveal
- Design responsivo
- Otimização de performance
- Acessibilidade (WCAG)

## 🚀 Deploy

### Firebase Hosting

```bash
# Deploy staging
yarn deploy:staging

# Deploy produção
yarn deploy:firebase
```

### Configuração

- Projeto: `pedrodapps-website`
- Site produção: `pedrodapps-website`
- Multi-site configurado via `.firebaserc`

### Acesso em Produção

- **URL Firebase**: `https://pedrodapps-website.web.app`
- **URL Kong (servidor)**: `https://pedrodapps.com` (via Kong proxy)
- **URL Alternativa**: `https://www.pedrodapps.com`
- **Kong Admin**: `http://187.108.196.14:8001` (apenas localhost)
- **Jenkins**: `http://187.108.196.14:8080`

## 📄 Licença

Todos os direitos reservados à Pedro dApps.

---

## 🔌 API Client & Endpoints

O projeto inclui um cliente HTTP reutilizável com seleção automática de base URL e suporte a JWT/admin token.

### Base URL

- Desenvolvimento (localhost): `http://localhost:8080`
- Produção: `https://api.pedrodapps.com`
- Sobreposição opcional via env: defina `VITE_API_BASE_URL`.

### Uso básico

```js
import { API } from "./src/lib/api";

// POST
const res = await API.post("/algum/endpoint", { foo: "bar" });

// GET
const data = await API.get("/status");
```

### JWT automático

- `auth.js` armazena dados em `localStorage` sob `pdapps_auth`.
- Se o objeto de auth conter `token` ou `jwt`, o helper `withAuth()` injeta `Authorization: Bearer <token>` automaticamente.

```js
import { withAuth } from "./src/lib/api";

const api = withAuth();
const res = await api.post("/user/profile", { displayName: "Pedro" });
```

> Observação: o fluxo de login local atual não emite JWT. Para usar `withAuth`, basta salvar o token dentro do objeto `pdapps_auth` (campo `token` ou `jwt`).

### Admin endpoint de teste

Endpoint: `POST /admin/test-create-builder`

- Headers: `content-type: application/json`, `x-admin-token: <token>`
- Payload exemplo:

```json
{
  "email": "pedrosgmagalhaes@gmail.com",
  "name": "Pedro Magalhaes",
  "note": "Manual test: Builders de Elite granted"
}
```

Respostas esperadas:

- Sucesso:

```json
{
  "ok": true,
  "email": "pedrosgmagalhaes@gmail.com",
  "name": "Pedro Magalhaes",
  "membership": { "id": "<uuid>", "tier": "builders-de-elite", "status": "active" },
  "ghost": { "label": "builders-club", "noteSet": true }
}
```

- Erro de autorização:

```json
{ "error": "unauthorized" }
```

- Erro de sync com Ghost (criação no banco não é bloqueada):

```json
{
  "ok": true,
  "ghost": { "error": "ghost sync failed", "message": "<detalhe>" }
}
```

### Ferramenta de teste (UI)

- Página: `/.admin/tools` (rota protegida; faça login em `/login`).
- Componente: `src/components/AdminTools.jsx`.
- Preencha email, nome, nota e `x-admin-token`; clique em Enviar para ver a resposta JSON.

### Convenções de erro

- Erros HTTP `401/403` são normalizados no cliente como `{ error: "unauthorized", status, data }`.
- Outros erros retornam `{ error: "request_failed", status, data }`.

---

## 🔐 Login com Google (oficial)

Integração com Google Identity Services (botão oficial).

### Configuração

- Adicione a variável de ambiente `VITE_GOOGLE_CLIENT_ID` com o Client ID do OAuth 2.0.
- O script oficial é carregado em `index.html`:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Uso

- Componente: `src/components/GoogleLogin.jsx` — renderiza o botão padrão do Google e trata o retorno `credential`.
- Na tela de login (`src/components/Login.jsx`), o botão aparece acima do formulário.
- Ao sucesso, o app salva o JWT e e-mail em `localStorage` via `loginWithGoogle()` (em `src/lib/auth.js`) e redireciona para `/members`.

### Notas

- O JWT é decodificado no cliente para extrair o e-mail; para validação forte, recomenda-se verificar o token no backend.
- Se `VITE_GOOGLE_CLIENT_ID` não estiver definido, o botão não renderiza e um aviso é logado no console.
