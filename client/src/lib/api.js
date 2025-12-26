const API_URL = "http://localhost:5000/api";

// ✅ ruaje token në localStorage që të mos humbet me refresh
const TOKEN_KEY = "lumera_access_token";

let accessToken = localStorage.getItem(TOKEN_KEY);

export function setAccessToken(token) {
  accessToken = token;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
  localStorage.removeItem(TOKEN_KEY);
}

async function refreshToken() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  setAccessToken(data.accessToken); // ✅ ruaj token-in e ri
  return data.accessToken;
}

export async function apiFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Cache-Control", "no-store");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      await refreshToken();

      const retryHeaders = new Headers(headers);
      retryHeaders.set("Authorization", `Bearer ${accessToken}`);

      return fetch(`${API_URL}${url}`, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });
    } catch {
      clearAccessToken();
      return res;
    }
  }

  return res;
}
