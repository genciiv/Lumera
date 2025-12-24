import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, setAccessToken, getAccessToken } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // bootstrap
  const [error, setError] = useState("");

  async function loadMe() {
    setError("");
    const res = await apiFetch("/auth/me", { method: "GET" });
    if (!res.ok) {
      setUser(null);
      return null;
    }
    const data = await res.json();
    setUser(data.user);
    return data.user;
  }

  async function login(email, password) {
    setError("");
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error(data?.error || "Login failed");
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    await loadMe();
  }

  async function register(email, password) {
    setError("");
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error(data?.error || "Register failed");
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    await loadMe();
  }

  async function logout() {
    setError("");
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  // Bootstrap: në start provo /me (që do bëjë refresh automatik nëse cookie ekziston)
  useEffect(() => {
    (async () => {
      try {
        await loadMe();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthed: Boolean(user) && Boolean(getAccessToken()),
      login,
      register,
      logout,
      loadMe,
      setError,
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
