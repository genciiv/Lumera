export default function Services() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Services</h1>
      <p style={{ color: "var(--muted)" }}>
        Choose modules you can add on top of your SaaS core.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 12,
        }}
      >
        <Card
          title="Workspace + Team"
          text="Manage users, roles, invites, permissions."
        />
        <Card
          title="Content / Blog"
          text="Public posts, categories, SEO, admin editor."
        />
        <Card
          title="Payments"
          text="Stripe billing plans, limits, invoices (later)."
        />
        <Card
          title="Admin Panel"
          text="Audit logs, settings, platform monitoring."
        />
      </div>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <div style={{ marginTop: 8, color: "var(--muted)" }}>{text}</div>
    </div>
  );
}
