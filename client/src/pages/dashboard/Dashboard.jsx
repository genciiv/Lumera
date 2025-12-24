export default function Dashboard() {
  return (
    <div>
      <h1 style={{ margin: 0 }}>Dashboard</h1>

      <p style={{ color: "var(--muted)", marginTop: 6 }}>
        Welcome to Lumera. This is your workspace overview.
      </p>

      <div
        className="card"
        style={{
          padding: 18,
          marginTop: 24,
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 700 }}>What’s next?</div>

        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
          <li>Authentication (login / register)</li>
          <li>Multi-tenant logic</li>
          <li>Modules (Inventory, Real Estate, Ecommerce)</li>
        </ul>
      </div>
    </div>
  );
}
