// client/src/pages/dashboard/Users.jsx
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Users() {
  const { user, loading } = useAuth();

  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const canManage = useMemo(() => {
    return user?.role === "TenantOwner" || user?.role === "Admin";
  }, [user]);

  async function loadUsers() {
    setErr("");
    const res = await apiFetch("/users");
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setUsers([]);
      setErr(data?.message || "Failed to load users");
      return;
    }
    const data = await res.json().catch(() => null);
    setUsers(Array.isArray(data?.users) ? data.users : []);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setErr("");

    const res = await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password, role }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(data?.message || "Create failed");
      return;
    }

    setFullName("");
    setEmail("");
    setPassword("");
    setRole("User");

    await loadUsers();
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return; // nuk je loguar
    loadUsers();
  }, [loading, user]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Unauthorized</h2>
        <p>Duhet të logohesh.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Users</h2>
      <p style={{ opacity: 0.8 }}>
        Manage users inside your tenant (Owner/Admin).
      </p>

      {err ? (
        <div
          style={{
            background: "#ffd9d9",
            padding: 12,
            borderRadius: 8,
            margin: "12px 0",
          }}
        >
          {err}
        </div>
      ) : null}

      {canManage ? (
        <div
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 12,
            marginTop: 12,
          }}
        >
          <h3>Create user</h3>

          <form
            onSubmit={handleCreate}
            style={{ display: "grid", gap: 10, maxWidth: 420 }}
          >
            <input
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="TenantOwner">TenantOwner</option>
            </select>

            <button type="submit">Create</button>
          </form>
        </div>
      ) : (
        <div style={{ marginTop: 12, opacity: 0.8 }}>
          Vetëm Owner/Admin mund të krijojë user.
        </div>
      )}

      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 12,
          marginTop: 16,
        }}
      >
        <h3>All users</h3>

        {users.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No users found.</div>
        ) : (
          <table
            style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}
          >
            <thead>
              <tr>
                <th align="left">Email</th>
                <th align="left">Full name</th>
                <th align="left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.fullName || "-"}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
