import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "User",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load users
  const loadUsers = async () => {
    try {
      const res = await apiFetch("/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Create user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Create failed");
      }

      setForm({
        email: "",
        password: "",
        role: "User",
        fullName: "",
      });

      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <h2>Users</h2>
      <p style={{ color: "#666" }}>
        Manage users inside your tenant (Owner / Admin)
      </p>

      {error && (
        <div style={{ background: "#fee", padding: 10, borderRadius: 8 }}>
          {error}
        </div>
      )}

      {/* CREATE USER */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Create user</h3>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <input
            placeholder="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="TenantOwner">TenantOwner</option>
          </select>

          <button disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      {/* USERS LIST */}
      <div className="card" style={{ marginTop: 30 }}>
        <h3>All users</h3>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table width="100%">
            <thead>
              <tr>
                <th>Email</th>
                <th>Full name</th>
                <th>Role</th>
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
