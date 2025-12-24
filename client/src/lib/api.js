const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// access token vetëm në memory
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken() {
  // refreshToken është cookie httpOnly, prandaj duhet credentials: "include"
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    setAccessToken(null);
    return null;
  }

  const data = await res.json();
  setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  // vendos Authorization nëse kemi token
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const firstRes = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // KJO është kritike për cookies
  });

  // Nëse s’është 401, kthe direkt
  if (firstRes.status !== 401) return firstRes;

  // 401 -> provo refresh
  const newToken = await refreshAccessToken();
  if (!newToken) return firstRes;

  // Provo request-in prapë me token të ri
  const retryHeaders = new Headers(options.headers || {});
  if (!retryHeaders.has("Content-Type") && options.body) {
    retryHeaders.set("Content-Type", "application/json");
  }
  retryHeaders.set("Authorization", `Bearer ${newToken}`);

  return fetch(url, {
    ...options,
    headers: retryHeaders,
    credentials: "include",
  });
}
