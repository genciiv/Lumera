const API_URL = "http://localhost:5000/api";
const TOKEN_KEY = "lumera_access_token";

let accessToken = localStorage.getItem(TOKEN_KEY) || null;

// ================================
// TOKEN HELPERS
// ================================
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

// ================================
// REFRESH TOKEN
// ================================
async function refreshToken() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  setAccessToken(data.accessToken);
  return data.accessToken;
}

// ================================
// API FETCH
// ================================
export async function apiFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Cache-Control", "no-store");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      await refreshToken();

      const retryHeaders = new Headers(headers);
      retryHeaders.set("Authorization", `Bearer ${accessToken}`);

      res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });
    } catch {
      clearAccessToken();
      throw new Error("Session expired");
    }
  }

  return res;
}
