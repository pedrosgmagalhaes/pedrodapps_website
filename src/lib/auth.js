// Auth util simples baseado em localStorage
import { API } from "./api";
const AUTH_KEY = "pdapps_auth";
const RELEASE_OVERRIDE_KEY = "pdapps_release_override";

export function isAuthenticated() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    // opcional: validar expiração no futuro
    return Boolean(data && data.email);
  } catch {
    return false;
  }
}

export function login(email) {
  const payload = {
    email,
    loggedAt: Date.now(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
}

export function logout() {
  try {
    // Solicita ao backend apagar cookie de sessão
    API.auth.logout();
  } finally {
    localStorage.removeItem(AUTH_KEY);
    try {
      localStorage.removeItem(RELEASE_OVERRIDE_KEY);
    } catch (e) {
      void e;
    }
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Retorna JWT se armazenado no objeto de auth
// Aceita campos como `token` ou `jwt` para compatibilidade futura
export function getToken() {
  const user = getUser();
  if (!user) return null;
  return user.token || user.jwt || null;
}

// Removido: decodeJwt não é utilizado atualmente

// Login com Google: guarda email e credencial JWT
export async function loginWithGoogle(credential) {
  // Envia o id_token ao backend para criar sessão via cookie httpOnly
  const res = await API.auth.google(credential);
  if (res?.error) {
    const code = res.error;
    const backendMsg = res?.data?.error;
    const friendly =
      backendMsg ||
      (code === "network_error"
        ? "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente."
        : code === "unauthorized"
        ? "Sua sessão não foi autorizada. Tente novamente."
        : "Não foi possível entrar com Google. Tente novamente.");
    throw new Error(friendly);
  }
  // Após sucesso, confirma sessão via /auth/me
  const me = await API.auth.me();
  if (me?.error || me?.ok === false) {
    const code = me?.error;
    const backendMsg = me?.data?.error;
    const friendly =
      backendMsg ||
      (code === "network_error"
        ? "Não foi possível verificar a sessão (rede). Tente novamente."
        : "Não foi possível verificar a sessão. Tente novamente.");
    throw new Error(friendly);
  }
  const user = {
    email: me?.email || null,
    name: res?.name || null,
    picture: res?.picture || null,
    provider: "google",
    tiers: me?.tiers || [],
    loggedAt: Date.now(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function requireAuth() {
  if (!isAuthenticated()) {
    // Redireciona para rota baseada em path
    window.location.href = "/login";
    return false;
  }
  return true;
}
// Login com e-mail e senha (sessão via cookie)
export async function loginWithPassword(email, password) {
  // Mock temporário: credenciais específicas liberam acesso imediato
  const MOCK_EMAIL = "andre@zambrano.com.br";
  const MOCK_PASSWORD = "#G0X1LCgV9Zz";
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim();
  if (normalizedEmail === MOCK_EMAIL && normalizedPassword === MOCK_PASSWORD) {
    const user = {
      email: normalizedEmail,
      name: "Andre Zambrano",
      picture: null,
      provider: "mock",
      tiers: ["beta"],
      loggedAt: Date.now(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    try {
      localStorage.setItem(RELEASE_OVERRIDE_KEY, "true");
    } catch (e) {
      void e;
    }
    return user;
  }

  const res = await API.auth.login(email, password);
  if (res?.error) {
    const code = res.error;
    const backendMsg = res?.data?.error;
    // Fallback temporário: em erro de rede, criamos sessão mock para permitir acesso
    if (code === "network_error") {
      const user = {
        email: normalizedEmail || email,
        name: null,
        picture: null,
        provider: "mock",
        tiers: ["beta"],
        loggedAt: Date.now(),
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      try {
        localStorage.setItem(RELEASE_OVERRIDE_KEY, "true");
      } catch (e) {
        void e;
      }
      return user;
    }
    const friendly =
      backendMsg ||
      (code === "network_error"
        ? "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente."
        : code === "unauthorized"
        ? "E-mail ou senha inválidos."
        : "Não foi possível entrar. Tente novamente.");
    throw new Error(friendly);
  }
  // Confirma sessão via /auth/me
  const me = await API.auth.me();
  if (me?.error || me?.ok === false) {
    const code = me?.error;
    const backendMsg = me?.data?.error;
    const friendly =
      backendMsg ||
      (code === "network_error"
        ? "Não foi possível verificar a sessão (rede). Tente novamente."
        : "Não foi possível verificar a sessão. Tente novamente.");
    throw new Error(friendly);
  }
  const user = {
    email: me?.email || email,
    name: null,
    picture: null,
    provider: "password",
    tiers: me?.tiers || [],
    loggedAt: Date.now(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

// Atualiza sessão local consultando /auth/me
export async function refreshSession() {
  const me = await API.auth.me();
  if (me?.error || me?.ok === false || !me?.email) {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
  const user = {
    email: me.email,
    tiers: me.tiers || [],
    provider: "cookie",
    loggedAt: Date.now(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}