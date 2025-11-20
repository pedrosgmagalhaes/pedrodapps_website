// Auth util simples baseado em localStorage
import { API } from "./api";
const AUTH_KEY = "pdapps_auth";

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
  const res = await API.auth.login(email, password);
  if (res?.error) {
    const code = res.error;
    const backendMsg = res?.data?.error;
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