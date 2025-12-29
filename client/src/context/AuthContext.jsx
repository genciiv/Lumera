import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, setAccessToken, clearAccessToken } from "../lib/api.js";

const AuthContext = createContext(null);

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    const res = await apiFetch("/users/me");

    if (!res.ok) {
      setUser(null);
      return null;
    }

    const data = await safeJson(res);
    const u = data?.user || null;
    setUser(u);
    return u;
  }

  async function login(email, password) {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await safeJson(res.clone());
      throw new Error(data?.error || data?.message || "Login failed");
    }

    const data = await safeJson(res);
    if (!data?.accessToken) throw new Error("Missing accessToken from server");

    setAccessToken(data.accessToken);
    await loadMe();
  }

  async function register(email, password, workspaceName) {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, workspaceName }),
    });

    if (!res.ok) {
      const data = await safeJson(res.clone());
      throw new Error(data?.error || data?.message || "Register failed");
    }

    const data = await safeJson(res);
    if (!data?.accessToken) throw new Error("Missing accessToken from server");

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
      // mos e detyro reload, ProtectedRoute do e çojë vetë te /login
    }
  }

  async function updateProfile(payload) {
    const res = await apiFetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await safeJson(res.clone());
      throw new Error(data?.error || data?.message || "Update failed");
    }

    const data = await safeJson(res);
    const u = data?.user || null;
    setUser(u);
    return u;
  }

  // ✅ Bootstrap session on app start (pas refresh)
  // Mos kontrollo getAccessToken() sepse humbet pas refresh (RAM).
  // Lëre apiFetch të bëjë refresh me cookie nëse ekziston.
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
      login,
      register,
      logout,
      updateProfile,
      loadMe,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
