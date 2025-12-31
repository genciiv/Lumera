// client/src/pages/dashboard/Users.jsx
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Users() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const [msg, setMsg] = useState("");
  const [creating, setCreating] = useState(false);

  const canManage = useMemo(() => {
    return user?.role === "TenantOwner" || user?.role === "Admin";
  }, [user]);

  async function safeJson(res) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  async function loadUsers() {
    setLoading(true);
    setMsg("");
    try {
      const res = await apiFetch("/users");
      const data = await safeJson(res);

      if (!res.ok) {
        setUsers([]);
        setMsg(data?.message || data?.error || "Failed to load users");
        return;
      }

      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (err) {
      setUsers([]);
      setMsg(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setMsg("");

    if (!canManage) {
      setMsg("You are not allowed to create users.");
      return;
    }

    setCreating(true);
    try {
      const res = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password, role }),
      });

      const data = await safeJson(res);
      if (!res.ok)
        throw new Error(data?.message || data?.error || "Create failed");

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("User");

      await loadUsers();
      setMsg("✅ User created");
    } catch (err) {
      setMsg(err.message || "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id) {
    setMsg("");

    if (!canManage) {
      setMsg("You are not allowed to delete users.");
      return;
    }

    if (!confirm("Delete this user?")) return;

    try {
      const res = await apiFetch(`/users/${id}`, { method: "DELETE" });
      const data = await safeJson(res);

      if (!res.ok)
        throw new Error(data?.message || data?.error || "Delete failed");

      await loadUsers();
      setMsg("✅ User deleted");
    } catch (err) {
      setMsg(err.message || "Delete failed");
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ margin: 0 }}>Users</h1>
      <p style={{ color: "var(--muted)", marginTop: 6 }}>
        Manage users inside your tenant (Owner/Admin).
      </p>

      {msg ? <div style={alertBox}>{msg}</div> : null}

      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Create user</h3>

        {!canManage ? (
          <div style={{ color: "var(--muted)" }}>
            Only <b>TenantOwner</b> or <b>Admin</b> can create users.
          </div>
        ) : null}

        <form
          onSubmit={onCreate}
          style={{ display: "grid", gap: 10, marginTop: 10 }}
        >
          <label>
            Full name
            <input
              style={inputStyle}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label>
            Email
            <input
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>

          <label>
            Password
            <input
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>

          <label>
            Role
            <select
              style={inputStyle}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              {user?.role === "TenantOwner" ? (
                <option value="TenantOwner">TenantOwner</option>
              ) : null}
            </select>
          </label>

          <button
            style={primaryBtn}
            disabled={creating || !canManage}
            type="submit"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>All users</h3>

        {loading ? (
          <div>Loading...</div>
        ) : users.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No users found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={th}>Email</th>
                <th style={th}>Full name</th>
                <th style={th}>Role</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.fullName || "-"}</td>
                  <td style={td}>{u.role}</td>
                  <td style={td}>
                    <button
                      style={dangerBtn}
                      onClick={() => onDelete(u._id)}
                      disabled={!canManage || u._id === user?._id}
                      title={
                        u._id === user?._id
                          ? "You cannot delete yourself"
                          : "Delete user"
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 10 }}>
          <button style={ghostBtn} onClick={loadUsers}>
            Refresh
          </button>
        </div>
      </div>
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

const ghostBtn = {
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "transparent",
  cursor: "pointer",
  fontWeight: 700,
};

const dangerBtn = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "rgba(239,68,68,0.10)",
  cursor: "pointer",
  fontWeight: 800,
};

const alertBox = {
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(239,68,68,0.08)",
};

const th = { padding: "10px 8px", color: "var(--muted)", fontWeight: 800 };
const td = { padding: "10px 8px" };
