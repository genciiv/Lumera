const API_URL = "http://localhost:5000/api";

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

async function refreshToken() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  accessToken = data.accessToken;
  return accessToken;
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
      throw new Error("Session expired");
    }
  }

  return res;
}
