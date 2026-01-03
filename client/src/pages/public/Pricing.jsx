import { Link } from "react-router-dom";

export default function Pricing() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0 }}>Pricing</h1>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Simple plans for teams. (Stripe billing later.)
      </p>

      <div style={grid}>
        <PlanCard
          title="Starter"
          price="Free"
          desc="Perfect to try the platform."
          items={["1 workspace", "Up to 3 users", "Invites", "Basic settings"]}
          ctaText="Start free"
          ctaTo="/register"
          highlight={false}
        />

        <PlanCard
          title="Team"
          price="€19 / mo"
          desc="For small teams that need control."
          items={[
            "Everything in Starter",
            "Up to 25 users",
            "Admin role",
            "Invite management",
          ]}
          ctaText="Start now"
          ctaTo="/register"
          highlight={true}
        />

        <PlanCard
          title="Business"
          price="€49 / mo"
          desc="For growing organizations."
          items={[
            "Everything in Team",
            "Up to 200 users",
            "Audit logs (soon)",
            "Priority support",
          ]}
          ctaText="Contact us"
          ctaTo="/contact"
          highlight={false}
        />
      </div>

      <div className="card" style={ctaBox}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            Want a custom plan?
          </div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>
            We can tailor limits, modules, and deployment for your company.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/contact" style={{ ...ghostBtn, textDecoration: "none" }}>
            Talk to us
          </Link>
          <Link
            to="/register"
            style={{ ...primaryBtn, textDecoration: "none" }}
          >
            Start free
          </Link>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ title, price, desc, items, ctaText, ctaTo, highlight }) {
  return (
    <div
      className="card"
      style={{
        padding: 18,
        border: highlight
          ? "2px solid var(--primary)"
          : "1px solid var(--border)",
        boxShadow: highlight ? "0 10px 30px rgba(37,99,235,0.15)" : "none",
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
        <div style={{ fontWeight: 900, fontSize: 26 }}>{price}</div>
        <div style={{ color: "var(--muted)" }}>{desc}</div>
      </div>

      <ul
        style={{ margin: "14px 0 0", paddingLeft: 18, color: "var(--muted)" }}
      >
        {items.map((x) => (
          <li key={x} style={{ marginBottom: 8 }}>
            {x}
          </li>
        ))}
      </ul>

      <Link
        to={ctaTo}
        style={{
          marginTop: 14,
          display: "inline-block",
          textDecoration: "none",
          ...(highlight ? primaryBtn : ghostBtn),
        }}
      >
        {ctaText}
      </Link>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
};

const ctaBox = {
  marginTop: 8,
  padding: 18,
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
};

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  background: "var(--primary)",
  color: "white",
  fontWeight: 900,
  border: "1px solid var(--primary)",
};

const ghostBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  background: "transparent",
  color: "var(--text)",
  fontWeight: 900,
  border: "1px solid var(--border)",
};
