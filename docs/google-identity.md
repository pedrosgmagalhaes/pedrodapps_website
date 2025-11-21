# Guia de Login com Google (GIS): One Tap + Botão

Este guia explica como integrar Google Identity Services (GIS) usando One Tap como padrão e o botão de Sign-In como fallback, além de como isso se conecta ao backend pelo endpoint `POST /auth/google` (ID Token).

## Recomendação

- Use **One Tap** como padrão (melhor conversão, menos atrito) e **sempre renderize o botão de Sign-In** como fallback.
- Fluxo: o frontend recebe um `id_token` do Google e envia para o backend, que valida, cria/atualiza o membro e emite sessão via cookie httpOnly.

## Pré-requisitos

- Criar um **OAuth Client ID** para aplicação Web no Google Cloud Console:
  1. Acesse “APIs & Services → Credentials → Create Credentials → OAuth client ID”.
  2. Tipo: **Web Application**.
  3. Configure **Authorized JavaScript origins** (ex.: `http://localhost:3000`, `https://seu-dominio.com`).
  4. Copie o **Client ID** (será usado no frontend e backend).
- Backend: definir `GOOGLE_CLIENT_ID` em `backend/.env`.
- CORS do backend: `CORS_ORIGIN` deve incluir a origem do frontend; usar `credentials: true`.
- HTTPS em produção; em dev `http://localhost` é aceito.

> Importante: a criação/gestão do OAuth Client ID para GIS NÃO é suportada via `gcloud` CLI. Isso é feito no Console.

## Conceitos GIS

- **One Tap**: prompt não intrusivo que retorna um `credential` (ID Token) sem popups/redirects.
- **Botão de Sign-In**: ação explícita do usuário; retorna o mesmo `credential`.
- **ID Token**: JWT emitido pelo Google contendo `sub` (subject), `email`, `email_verified`, `name`, `picture`. O backend valida com `GOOGLE_CLIENT_ID`.

## Endpoint Backend

- `POST /auth/google`
  - Body: `{ id_token }`
  - Response (200): `{ ok: true, email, name, picture, tiers }` e cookie httpOnly de sessão.
  - Erros comuns:
    - `400 { error: "id_token required" }`
    - `500 { error: "GOOGLE_CLIENT_ID not configured" }`
    - `401 { error: "email not verified" }`
    - `401 { error: "invalid id_token" }`

Detalhes adicionais dos fluxos de autenticação estão em `docs/auth.md`.

## Implementação Frontend (Vanilla JS)

1. Carregar biblioteca do GIS (no HTML):

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

2. Inicializar e habilitar One Tap:

```html
<script>
  const GOOGLE_CLIENT_ID = "SEU_CLIENT_ID";
  const API_BASE_URL = "http://localhost:8080"; // ajuste para produção

  function handleCredentialResponse(response) {
    const idToken = response.credential;
    fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include", // necessário para cookie de sessão
      body: JSON.stringify({ id_token: idToken }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "login failed");
        console.log("Autenticado:", data);
        // Ex.: atualizar UI, redirecionar, carregar estado com /auth/me
      })
      .catch((err) => {
        console.error("Erro no login Google:", err);
        // mostrar fallback (botão) ou mensagem amigável
      });
  }

  window.onload = function () {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: true,
      ux_mode: "popup", // padrão para One Tap
      // optional: login_uri se quiser delegar ao backend (não necessário aqui)
    });

    // Tenta exibir One Tap; pode ser suprimido
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Renderizar fallback: botão de Sign-In
        const btnContainer = document.getElementById("google-signin-btn");
        google.accounts.id.renderButton(btnContainer, {
          theme: "outline",
          size: "large",
          text: "signin_with",
        });
      }
    });
  };
</script>
<div id="google-signin-btn"></div>
```

## Implementação Frontend (React)

Hook + componente simples:

```jsx
import { useEffect, useRef } from "react";

export function useGoogleAuth({ clientId, apiBaseUrl, onSuccess, onError }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const res = await fetch(`${apiBaseUrl}/auth/google`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ id_token: response.credential }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "login failed");
            onSuccess?.(data);
          } catch (e) {
            onError?.(e);
          }
        },
        auto_select: true,
      });

      // Mostrar One Tap (se suprimido, renderizamos botão em fallback)
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const container = document.getElementById("google-signin-btn");
          if (container) {
            google.accounts.id.renderButton(container, {
              theme: "outline",
              size: "large",
              text: "signin_with",
            });
          }
        }
      });
    };
    document.head.appendChild(script);
  }, [clientId, apiBaseUrl, onSuccess, onError]);
}

export function GoogleAuthSection({ clientId, apiBaseUrl, onSuccess }) {
  const btnRef = useRef(null);
  useGoogleAuth({ clientId, apiBaseUrl, onSuccess, onError: console.error });
  return (
    <div>
      <div id="google-signin-btn" ref={btnRef} />
    </div>
  );
}
```

## Tratamento de Erros (Frontend)

- One Tap suprimido: renderize botão de Sign-In.
- `fetch` com `credentials: 'include'`: necessário para cookie; sem isso o usuário não fica logado.
- CORS: garantir `CORS_ORIGIN` correto no backend.
- HTTPS: em produção, necessário para cookies `secure`.
- Respostas do backend:
  - `401 email not verified`: informe usuário para verificar e-mail.
  - `401 invalid id_token`: peça para tentar novamente (token expirado/emitido para outro client id).
  - `500 GOOGLE_CLIENT_ID not configured`: verificar variáveis de ambiente no backend.

## Tratamento de Erros (Backend)

- Validar `id_token` com `google-auth-library` e `GOOGLE_CLIENT_ID`.
- Recusar se `email_verified` for falso.
- Emitir JWT e setar cookie httpOnly.
- Retornar mensagens objetivas e status apropriados (400/401/500).

## Casos de Uso

- Landing com login rápido: One Tap habilitado; se suprimido, mostrar botão.
- Conteúdo protegido: exibir botão; se login bem-sucedido, liberar acesso.
- App híbrido: oferecer passwordless ou e-mail/senha se usuário recusar GIS.

## Sobre `gcloud` CLI

- A criação de **OAuth Client ID para GIS** não é suportada via `gcloud` CLI; use o **Google Cloud Console**.
- CLI pode habilitar serviços de forma geral (`gcloud services enable`), mas não gerencia credenciais do GIS para Web nem a tela de consentimento.

## Testes Locais

- Em `api-tests`, existe `npm run test:auth-google` que usa `GOOGLE_ID_TOKEN` se você definir em `api-tests/.env`.
- Em dev, pegue um `id_token` pelo GIS (One Tap ou botão) na sua página local e cole em `GOOGLE_ID_TOKEN` para testar o endpoint.

## Checklist Final

- Console: OAuth Client ID Web criado; origins configurados.
- Backend: `GOOGLE_CLIENT_ID`, `CORS_ORIGIN` definidos; endpoint `/auth/google` ativo.
- Frontend: GIS carregado; One Tap + botão; `credentials: 'include'` nas requisições.
- Produção: HTTPS ativo; cookies seguros; CORS correto.
