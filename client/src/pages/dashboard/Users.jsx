import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function safeJson(res) {
  return res.json().catch(() => null);
}

export default function Users() {
  const { user } = useAuth();

  const isOwner = user?.role === "TenantOwner";
  const isAdmin = user?.role === "Admin";
  const canManage = isOwner || isAdmin;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // create form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [creating, setCreating] = useState(false);

  // edit modal-ish
  const [editing, setEditing] = useState(null); // user object
  const [editFullName, setEditFullName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editRole, setEditRole] = useState("User");
  const [savingEdit, setSavingEdit] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setMsg("");
    try {
      const res = await apiFetch("/users");
      const data = await safeJson(res);

      if (!res.ok) {
        setUsers([]);
        setMsg(data?.message || "Failed to load users");
        return;
      }

      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (e) {
      setUsers([]);
      setMsg(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canManage) loadUsers();
    else {
      setLoading(false);
      setUsers([]);
      setMsg("You don't have permission to view users.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage]);

  async function onCreate(e) {
    e.preventDefault();
    setMsg("");

    if (!canManage) {
      setMsg("Forbidden");
      return;
    }

    setCreating(true);
    try {
      const res = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password, role }),
      });

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Create failed");

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("User");

      setMsg("✅ User created");
      await loadUsers();
    } catch (e) {
      setMsg(e.message || "Create failed");
    } finally {
      setCreating(false);
    }
  }

  function openEdit(u) {
    setEditing(u);
    setEditFullName(u.fullName || "");
    setEditAvatarUrl(u.avatarUrl || "");
    setEditRole(u.role || "User");
  }

  function closeEdit() {
    setEditing(null);
    setEditFullName("");
    setEditAvatarUrl("");
    setEditRole("User");
  }

  async function onSaveEdit(e) {
    e.preventDefault();
    setMsg("");

    if (!editing) return;

    setSavingEdit(true);
    try {
      const res = await apiFetch(`/users/${editing._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          fullName: editFullName,
          avatarUrl: editAvatarUrl,
          role: editRole,
        }),
      });

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Update failed");

      setMsg("✅ User updated");
      closeEdit();
      await loadUsers();
    } catch (e) {
      setMsg(e.message || "Update failed");
    } finally {
      setSavingEdit(false);
    }
  }

  async function onDelete(id) {
    setMsg("");

    if (!canManage) {
      setMsg("Forbidden");
      return;
    }

    if (!confirm("Delete this user?")) return;

    try {
      const res = await apiFetch(`/users/${id}`, { method: "DELETE" });
      const data = await safeJson(res);

      if (!res.ok) throw new Error(data?.message || "Delete failed");

      setMsg("✅ User deleted");
      await loadUsers();
    } catch (e) {
      setMsg(e.message || "Delete failed");
    }
  }

  const canCreateOwner = useMemo(() => isOwner, [isOwner]);

  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ margin: 0 }}>Users</h1>
      <p style={{ color: "var(--muted)", marginTop: 6 }}>
        Tenant users (Owner/Admin).
      </p>

      {msg ? <div style={noteBox}>{msg}</div> : null}

      {/* Create */}
      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Create user</div>

        {!canManage ? (
          <div style={{ color: "var(--muted)" }}>
            You do not have permission.
          </div>
        ) : (
          <form onSubmit={onCreate} style={{ display: "grid", gap: 10 }}>
            <label>
              Full name
              <input
                style={inputStyle}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
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
                placeholder="user@mail.com"
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
                {canCreateOwner ? (
                  <option value="TenantOwner">TenantOwner</option>
                ) : null}
              </select>
            </label>

            <button style={primaryBtn} type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        )}
      </div>

      {/* List */}
      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 900 }}>All users</div>
          <button style={ghostBtn} onClick={loadUsers} disabled={!canManage}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ marginTop: 12 }}>Loading...</div>
        ) : users.length === 0 ? (
          <div style={{ marginTop: 12, color: "var(--muted)" }}>
            No users found.
          </div>
        ) : (
          <table
            style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}
          >
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
                  <td style={td}>{u.fullName || "—"}</td>
                  <td style={td}>{u.role}</td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={ghostBtn}
                        onClick={() => openEdit(u)}
                        disabled={!canManage}
                      >
                        Edit
                      </button>
                      <button
                        style={dangerBtn}
                        onClick={() => onDelete(u._id)}
                        disabled={!canManage || u._id === user?._id}
                        title={
                          u._id === user?._id
                            ? "Can't delete yourself"
                            : "Delete"
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit modal (simple) */}
      {editing ? (
        <div style={modalBackdrop}>
          <div style={modalCard}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Edit user</div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              {editing.email}
            </div>

            <form
              onSubmit={onSaveEdit}
              style={{ display: "grid", gap: 10, marginTop: 12 }}
            >
              <label>
                Full name
                <input
                  style={inputStyle}
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                />
              </label>

              <label>
                Avatar URL
                <input
                  style={inputStyle}
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                />
              </label>

              <label>
                Role
                <select
                  style={inputStyle}
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  {isOwner ? (
                    <option value="TenantOwner">TenantOwner</option>
                  ) : null}
                </select>
              </label>

              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button style={primaryBtn} type="submit" disabled={savingEdit}>
                  {savingEdit ? "Saving..." : "Save"}
                </button>
                <button type="button" style={ghostBtn} onClick={closeEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
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
  fontWeight: 900,
  cursor: "pointer",
};

const ghostBtn = {
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "transparent",
  cursor: "pointer",
  fontWeight: 800,
};

const dangerBtn = {
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(239, 68, 68, 0.12)",
  cursor: "pointer",
  fontWeight: 900,
};

const noteBox = {
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(59, 130, 246, 0.08)",
  fontSize: 14,
};

const th = { padding: "10px 8px", color: "var(--muted)", fontWeight: 900 };
const td = { padding: "10px 8px" };

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
  display: "grid",
  placeItems: "center",
  padding: 16,
};

const modalCard = {
  width: "100%",
  maxWidth: 520,
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "white",
  padding: 16,
};
