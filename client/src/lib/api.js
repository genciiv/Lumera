const API_URL = "/api";

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

async function safeJson(res) {
  return res.json().catch(() => ({}));
}

async function refreshToken() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Cache-Control": "no-store" },
  });

  if (!res.ok) throw new Error("Refresh failed");
  const data = await safeJson(res);

  accessToken = data.accessToken || null;
  if (!accessToken) throw new Error("No access token on refresh");
  return accessToken;
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Cache-Control", "no-store");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // try refresh once
  if (res.status === 401) {
    try {
      await refreshToken();

      const retryHeaders = new Headers(headers);
      retryHeaders.set("Authorization", `Bearer ${accessToken}`);

      res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });
    } catch {
      clearAccessToken();
      // kthe res origjinale (401) që UI ta trajtojë si logout
    }
  }

  return res;
}

/**
 * Public fetch (no Authorization, no refresh)
 */
export async function publicFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Cache-Control", "no-store");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
}
