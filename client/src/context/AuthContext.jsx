// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  apiFetch,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
} from "../lib/api.js";

const AuthContext = createContext(null);

function safeJson(res) {
  return res.json().catch(() => null);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    try {
      const res = await apiFetch("/users/me");
      if (!res.ok) {
        setUser(null);
        return null;
      }
      const data = await res.json().catch(() => null);
      setUser(data?.user || null);
      return data?.user || null;
    } catch {
      setUser(null);
      return null;
    }
  }

  async function login(email, password) {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await safeJson(res);
    if (!res.ok)
      throw new Error(data?.message || data?.error || "Login failed");

    setAccessToken(data.accessToken);
    await loadMe();
  }

  async function register(email, password, workspaceName, fullName) {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, workspaceName, fullName }),
    });

    const data = await safeJson(res);
    if (!res.ok)
      throw new Error(data?.message || data?.error || "Register failed");

    setAccessToken(data.accessToken);
    await loadMe();
  }

  async function logout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      clearAccessToken();
      setUser(null);
      window.location.href = "/login";
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (getAccessToken()) {
          await loadMe();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, loadMe }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
