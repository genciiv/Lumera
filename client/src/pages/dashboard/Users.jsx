import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const card = {
  background: "white",
  border: "1px solid var(--border)",
  borderRadius: 18,
  padding: 18,
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  outline: "none",
};

const btn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "white",
  cursor: "pointer",
  fontWeight: 700,
};

const primaryBtn = {
  ...btn,
  background: "rgba(59,130,246,1)",
  color: "white",
  border: "none",
};

export default function Users() {
  const { user } = useAuth();
  const canManage = useMemo(
    () => ["TenantOwner", "Admin"].includes(user?.role),
    [user?.role]
  );

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [users, setUsers] = useState([]);

  // create form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [fullName, setFullName] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await apiFetch("/users");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load users");
      setUsers(data.users || []);
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!canManage) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage]);

  async function onCreate(e) {
    e.preventDefault();
    setErr("");

    try {
      const res = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({ email, password, role, fullName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Create failed");

      setEmail("");
      setPassword("");
      setRole("Member");
      setFullName("");
      await load();
    } catch (e2) {
      setErr(e2.message || "Error");
    }
  }

  async function onRoleChange(id, newRole) {
    setErr("");
    try {
      const res = await apiFetch(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Update failed");

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch (e) {
      setErr(e.message || "Error");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this user?")) return;

    setErr("");
    try {
      const res = await apiFetch(`/users/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Delete failed");

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      setErr(e.message || "Error");
    }
  }

  if (!canManage) {
    return (
      <div style={card}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Users</h2>
        <p style={{ color: "var(--muted)" }}>
          You don’t have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={card}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Users</h2>
        <p style={{ color: "var(--muted)", marginTop: 6 }}>
          Manage users inside your tenant (Owner/Admin).
        </p>

        {err ? (
          <div
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(239,68,68,0.25)",
              background: "rgba(239,68,68,0.08)",
              color: "rgba(153,27,27,1)",
              fontWeight: 600,
            }}
          >
            {err}
          </div>
        ) : null}
      </div>

      <div style={card}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Create user</h3>
        <form
          onSubmit={onCreate}
          style={{ marginTop: 12, display: "grid", gap: 10 }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div
              style={{ fontWeight: 700, fontSize: 13, color: "var(--muted)" }}
            >
              Full name (optional)
            </div>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={input}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <div
              style={{ fontWeight: 700, fontSize: 13, color: "var(--muted)" }}
            >
              Email
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={input}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <div
              style={{ fontWeight: 700, fontSize: 13, color: "var(--muted)" }}
            >
              Password
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={input}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <div
              style={{ fontWeight: 700, fontSize: 13, color: "var(--muted)" }}
            >
              Role
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={input}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
              <option value="TenantOwner">TenantOwner</option>
            </select>
          </div>

          <button type="submit" style={primaryBtn}>
            Create
          </button>
        </form>
      </div>

      <div style={card}>
        <h3 style={{ margin: 0, fontSize: 18 }}>All users</h3>

        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading…</p>
        ) : (
          <div style={{ marginTop: 12, overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 10px",
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    color: "var(--muted)",
                    fontSize: 13,
                  }}
                >
                  <th>Email</th>
                  <th>Full name</th>
                  <th>Role</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ background: "rgba(0,0,0,0.02)" }}>
                    <td style={{ padding: 10, borderRadius: 12 }}>{u.email}</td>
                    <td style={{ padding: 10 }}>{u.fullName || "—"}</td>
                    <td style={{ padding: 10 }}>
                      <select
                        value={u.role}
                        onChange={(e) => onRoleChange(u._id, e.target.value)}
                        style={{ ...input, maxWidth: 180 }}
                      >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                        <option value="TenantOwner">TenantOwner</option>
                      </select>
                    </td>
                    <td style={{ padding: 10 }}>
                      <button
                        style={btn}
                        onClick={() => onDelete(u._id)}
                        disabled={u._id === user?._id}
                        title={
                          u._id === user?._id
                            ? "You cannot delete yourself"
                            : "Delete"
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ padding: 10, color: "var(--muted)" }}
                    >
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
