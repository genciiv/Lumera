import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiFetch } from "../../lib/api.js";

export default function Settings() {
  const { user, loading, updateProfile } = useAuth();
  const [tenant, setTenant] = useState(null);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [tenantMsg, setTenantMsg] = useState("");

  useEffect(() => {
    setFullName(user?.fullName || "");
    setAvatarUrl(user?.avatarUrl || "");
  }, [user]);

  useEffect(() => {
    (async () => {
      setTenantMsg("");
      try {
        // endpoint: /api/tenants/me  (apiFetch already prefixes /api)
        const res = await apiFetch("/tenants/me");

        // Nëse serveri kthen HTML (404 page) kjo e shmang crash-in
        const ct = res.headers.get("content-type") || "";
        const data = ct.includes("application/json")
          ? await res.json().catch(() => null)
          : null;

        if (!res.ok) {
          setTenant(null);
          setTenantMsg(
            data?.message || data?.error || `Tenant load failed (${res.status})`
          );
          return;
        }

        setTenant(data?.tenant || data || null);
      } catch (e) {
        setTenant(null);
        setTenantMsg(e?.message || "Tenant load failed");
      }
    })();
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      await updateProfile({ fullName, avatarUrl });
      setMsg("✅ Saved");
    } catch (err) {
      setMsg(err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ margin: 0 }}>Settings</h1>
      <p style={{ color: "var(--muted)", marginTop: 6 }}>
        Profile & workspace info.
      </p>

      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 800 }}>Account</div>
          <div style={{ color: "var(--muted)" }}>
            {user?.email} · {user?.role}
          </div>

          {tenant ? (
            <div style={{ color: "var(--muted)" }}>
              Workspace: <b>{tenant.name}</b>
              {tenant.slug ? ` (${tenant.slug})` : ""}
            </div>
          ) : tenantMsg ? (
            <div
              style={{
                ...noteBox,
                borderColor: "rgba(239,68,68,.4)",
                background: "rgba(239,68,68,.08)",
              }}
            >
              {tenantMsg}
            </div>
          ) : null}
        </div>
      </div>

      <form
        onSubmit={onSave}
        className="card"
        style={{ padding: 18, marginTop: 18, display: "grid", gap: 12 }}
      >
        <div style={{ fontWeight: 800 }}>Profile</div>

        <label>
          Full name
          <input
            style={inputStyle}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <label>
          Avatar URL (optional)
          <input
            style={inputStyle}
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </label>

        <button style={primaryBtn} type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>

        {msg ? <div style={noteBox}>{msg}</div> : null}
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  outline: "none",
};

const primaryBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "none",
  background: "var(--primary)",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
};

const noteBox = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(59, 130, 246, 0.08)",
  fontSize: 14,
};
