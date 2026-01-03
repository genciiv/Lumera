import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      {/* HERO */}
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

      {/* FEATURES */}
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

      {/* PRICING PREVIEW */}
      <section style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 10,
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Pricing</h2>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              Start free. Upgrade when you need more users.
            </div>
          </div>
          <Link to="/pricing" style={ghostBtn}>
            View all plans
          </Link>
        </div>

        <div style={pricingGrid}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 900 }}>Starter</div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>
              Free
            </div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              For testing and small teams.
            </div>
            <Link
              to="/register"
              style={{
                ...primaryBtn,
                display: "inline-block",
                marginTop: 12,
                textDecoration: "none",
              }}
            >
              Start free
            </Link>
          </div>

          <div
            className="card"
            style={{ padding: 18, border: "2px solid var(--primary)" }}
          >
            <div style={{ fontWeight: 900 }}>Team</div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>
              €19 / mo
            </div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              Best value for real usage.
            </div>
            <Link
              to="/register"
              style={{
                ...primaryBtn,
                display: "inline-block",
                marginTop: 12,
                textDecoration: "none",
              }}
            >
              Start now
            </Link>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 900 }}>Business</div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>
              €49 / mo
            </div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              For bigger workspaces.
            </div>
            <Link
              to="/contact"
              style={{
                ...ghostBtn,
                display: "inline-block",
                marginTop: 12,
                textDecoration: "none",
              }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="card" style={homeCTA}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Ready to launch?</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>
            Create your workspace and invite your team in minutes.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            to="/register"
            style={{ ...primaryBtn, textDecoration: "none" }}
          >
            Get started
          </Link>
          <Link to="/contact" style={{ ...ghostBtn, textDecoration: "none" }}>
            Book a demo
          </Link>
        </div>
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

const pricingGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
};

const homeCTA = {
  marginTop: 6,
  padding: 18,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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
