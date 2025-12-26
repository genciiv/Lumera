export default function Users() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Users</h1>

      <p style={{ marginTop: 10, color: "var(--muted)" }}>
        Manage users inside your workspace.
      </p>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "white",
        }}
      >
        <p>👤 User list will appear here</p>
        <p>➕ Invite users</p>
        <p>🔐 Manage roles (Admin / User)</p>
      </div>
    </div>
  );
}
