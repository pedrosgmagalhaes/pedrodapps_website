// Reusable HTTP client with dynamic base URL and optional JWT/admin headers
const isLocalhost = () => {
  try {
    const host = window.location.hostname;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      /^(.*\.)?localhost$/.test(host)
    );
  } catch {
    return false;
  }
};

export const getBaseURL = () => {
  // Prefer explicit env var if present
  const explicit = import.meta?.env?.VITE_API_BASE_URL;
  if (explicit) return explicit;
  return isLocalhost() ? "http://localhost:8080" : "https://api.pedrodapps.com";
};

async function jsonFetch(path, options = {}) {
  const {
    method = "POST",
    headers = {},
    body,
    token,
    adminToken,
    baseUrl = getBaseURL(),
    credentials = "include",
  } = options;

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const finalHeaders = {
    ...(body ? { "content-type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(adminToken ? { "x-admin-token": adminToken } : {}),
    ...headers,
  };

  let resp;
  try {
    resp = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials,
    });
  } catch (err) {
    const msg = String(err?.message || err || "");
    // Normaliza falhas de rede em um código simples para a UI tratar
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("TypeError")) {
      return { error: "network_error", status: 0, data: null };
    }
    return { error: "unknown_error", status: 0, data: msg };
  }

  const contentType = resp.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await resp.json() : await resp.text();

  if (!resp.ok) {
    // Normalize unauthorized shape for convenience
    if (resp.status === 401 || resp.status === 403) {
      return { error: "unauthorized", status: resp.status, data };
    }
    return { error: "request_failed", status: resp.status, data };
  }

  return data;
}

export const API = {
  request: jsonFetch,
  get: (path, opts = {}) => jsonFetch(path, { ...opts, method: "GET" }),
  post: (path, body, opts = {}) => jsonFetch(path, { ...opts, method: "POST", body }),
  // Education endpoints (courses, modules, lessons, Q&A)
  edu: {
    courses: {
      getModules: (courseSlug, opts = {}) =>
        jsonFetch(`/edu/courses/${courseSlug}/modules`, { ...opts, method: "GET" }),
    },
    modules: {
      get: (slug, opts = {}) => jsonFetch(`/edu/modules/${slug}`, { ...opts, method: "GET" }),
      getLessons: (slug, opts = {}) => jsonFetch(`/edu/modules/${slug}/lessons`, { ...opts, method: "GET" }),
    },
    lessons: {
      get: (slug, opts = {}) => jsonFetch(`/edu/lessons/${slug}`, { ...opts, method: "GET" }),
      questions: {
        list: (slug, opts = {}) => jsonFetch(`/edu/lessons/${slug}/questions`, { ...opts, method: "GET" }),
        create: (slug, { title, content }, opts = {}) =>
          jsonFetch(`/edu/lessons/${slug}/questions`, {
            ...opts,
            method: "POST",
            body: { title, content },
          }),
      },
    },
    questions: {
      thread: (threadId, opts = {}) => jsonFetch(`/edu/questions/${threadId}`, { ...opts, method: "GET" }),
      reply: (threadId, content, parent_post_id = null, opts = {}) =>
        jsonFetch(`/edu/questions/${threadId}/replies`, {
          ...opts,
          method: "POST",
          body: parent_post_id ? { content, parent_post_id } : { content },
        }),
      like: (threadId, opts = {}) => jsonFetch(`/edu/questions/${threadId}/like`, { ...opts, method: "POST" }),
      unlike: (threadId, opts = {}) => jsonFetch(`/edu/questions/${threadId}/like`, { ...opts, method: "DELETE" }),
    },
  },
  // Admin endpoints
  admin: {
    testCreateBuilder: ({ email, name, note }, adminToken, opts = {}) =>
      jsonFetch("/admin/test-create-builder", {
        ...opts,
        method: "POST",
        adminToken,
        body: { email, name, note },
      }),
  },
  // Auth endpoints
  auth: {
    login: (email, password, opts = {}) =>
      jsonFetch("/auth/login", {
        ...opts,
        method: "POST",
        body: { email, password },
      }),
    google: (idToken, opts = {}) =>
      jsonFetch("/auth/google", {
        ...opts,
        method: "POST",
        body: { id_token: idToken },
      }),
    me: (opts = {}) =>
      jsonFetch("/auth/me", {
        ...opts,
        method: "GET",
      }),
    logout: (opts = {}) =>
      jsonFetch("/auth/logout", {
        ...opts,
        method: "POST",
      }),
  },
};

// Helper que injeta Authorization automaticamente a partir do auth local
import { getToken } from "./auth";

export function withAuth() {
  const token = getToken();
  return {
    request: (path, opts = {}) => jsonFetch(path, { ...opts, token }),
    get: (path, opts = {}) => jsonFetch(path, { ...opts, method: "GET", token }),
    post: (path, body, opts = {}) => jsonFetch(path, { ...opts, method: "POST", body, token }),
    admin: {
      testCreateBuilder: ({ email, name, note }, adminToken, opts = {}) =>
        jsonFetch("/admin/test-create-builder", {
          ...opts,
          method: "POST",
          adminToken,
          token,
          body: { email, name, note },
        }),
    },
  };
}