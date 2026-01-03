import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section style={hero}>
        <div style={{ maxWidth: 720 }}>
          <div style={badge}>Multi-tenant SaaS · MERN</div>
          <h1 style={{ margin: "10px 0 0", fontSize: 44, lineHeight: 1.05 }}>
            Manage your workspace, users, and invites — in one clean platform.
          </h1>
          <p
            style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: 16 }}
          >
            Lumera is a lightweight SaaS dashboard with secure auth, roles, user
            management, and invite flows — ready to grow with modules.
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Link to="/register" style={primaryBtn}>
              Get Started
            </Link>
            <Link to="/services" style={ghostBtn}>
              View Services
            </Link>
          </div>
        </div>

        <div style={mockCard}>
          <div style={{ fontWeight: 900 }}>What you have now ✅</div>
          <ul
            style={{
              margin: "10px 0 0",
              paddingLeft: 18,
              color: "var(--muted)",
            }}
          >
            <li>Login/Register + Refresh cookie</li>
            <li>Roles: Owner/Admin/User</li>
            <li>Users CRUD</li>
            <li>Invites: create + accept</li>
            <li>Settings: profile + workspace</li>
          </ul>
        </div>
      </section>

      <section style={grid}>
        <Card
          title="Secure Auth"
          text="JWT access + refresh cookies, protected routes, session persist."
        />
        <Card
          title="Teams & Roles"
          text="Owner/Admin/User roles with tenant-scoped permissions."
        />
        <Card
          title="User Management"
          text="Create, edit, delete users inside a workspace."
        />
        <Card
          title="Invites"
          text="Generate invite links so users can join safely."
        />
      </section>
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

const hero = {
  display: "grid",
  gridTemplateColumns: "1.3fr 1fr",
  gap: 18,
  alignItems: "stretch",
};

const badge = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid var(--border)",
  background: "white",
  fontWeight: 800,
  fontSize: 12,
};

const mockCard = {
  border: "1px solid var(--border)",
  background: "white",
  borderRadius: 16,
  padding: 18,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  background: "var(--primary)",
  color: "white",
  fontWeight: 900,
  textDecoration: "none",
  border: "1px solid var(--primary)",
};

const ghostBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  background: "transparent",
  color: "var(--text)",
  fontWeight: 900,
  textDecoration: "none",
  border: "1px solid var(--border)",
};
