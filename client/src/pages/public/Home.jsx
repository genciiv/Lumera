import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");

  function onNewsletter(e) {
    e.preventDefault();
    if (!email.trim()) return alert("Shkruaj email-in.");
    alert("✅ Subscribed! (later: connect to backend)");
    setEmail("");
  }

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

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            <Link to="/register" style={primaryBtn}>
              Get Started
            </Link>
            <Link to="/pricing" style={ghostBtn}>
              View Pricing
            </Link>
            <Link to="/contact" style={ghostBtn}>
              Book a demo
            </Link>
          </div>

          <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 13 }}>
            No Tailwind. Clean CSS variables. Ready for production deploy.
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

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <div style={miniStat}>
              <div style={{ fontWeight: 900 }}>Secure</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Access tokens + refresh cookies
              </div>
            </div>
            <div style={miniStat}>
              <div style={{ fontWeight: 900 }}>Tenant-scoped</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Separate workspaces, safe data
              </div>
            </div>
            <div style={miniStat}>
              <div style={{ fontWeight: 900 }}>Role-based</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Owner/Admin/User permissions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={grid2}>
        <Feature
          title="Secure Auth"
          text="JWT access + refresh cookies, protected routes, session persist."
        />
        <Feature
          title="Teams & Roles"
          text="Owner/Admin/User roles with tenant-scoped permissions."
        />
        <Feature
          title="User Management"
          text="Create, edit, delete users inside a workspace."
        />
        <Feature
          title="Invites"
          text="Generate invite links so users can join safely."
        />
      </section>

      {/* PRICING PREVIEW */}
      <section style={{ display: "grid", gap: 12 }}>
        <div style={sectionHeader}>
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
              style={{ ...primaryBtn, display: "inline-block", marginTop: 12 }}
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
              style={{ ...primaryBtn, display: "inline-block", marginTop: 12 }}
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
              style={{ ...ghostBtn, display: "inline-block", marginTop: 12 }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ display: "grid", gap: 12 }}>
        <div style={sectionHeader}>
          <div>
            <h2 style={{ margin: 0 }}>What teams say</h2>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              Lightweight, fast, and clean UX.
            </div>
          </div>
        </div>

        <div style={grid3}>
          <Testimonial
            quote="We launched a workspace in minutes. Roles and invites work exactly as expected."
            name="Ardit"
            role="Team Lead"
          />
          <Testimonial
            quote="Finally a clean dashboard without heavy UI frameworks. It feels fast and simple."
            name="Elira"
            role="Product"
          />
          <Testimonial
            quote="Multi-tenant + auth + user management is a solid base. Ready to add modules."
            name="Bledi"
            role="Engineer"
          />
        </div>
      </section>

      {/* FAQ */}
      <section style={{ display: "grid", gap: 12 }}>
        <div style={sectionHeader}>
          <div>
            <h2 style={{ margin: 0 }}>FAQ</h2>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              Quick answers before you start.
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <Faq
            q="Is this a real SaaS base or just a template?"
            a="It’s a real SaaS base: multi-tenant, roles, protected routes, users CRUD, invites, settings."
          />
          <Faq
            q="Can I deploy it with custom domain?"
            a="Yes. Frontend on Vercel/Netlify + Backend on Render/Railway/VPS + custom domain + SSL."
          />
          <Faq
            q="Do I need Tailwind?"
            a="No. This project uses clean CSS variables + inline styles, easy on the eyes."
          />
          <Faq
            q="When will payments be added?"
            a="When you’re ready: Stripe billing (plans, limits, subscriptions) is a next module."
          />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="card" style={newsletterBox}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            Get product updates
          </div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>
            Subscribe for new modules (blog, billing, analytics).
          </div>
        </div>

        <form onSubmit={onNewsletter} style={newsletterForm}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@mail.com"
            style={newsletterInput}
          />
          <button type="submit" style={primaryBtn}>
            Subscribe
          </button>
        </form>
      </section>

      {/* CTA */}
      <section className="card" style={homeCTA}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Ready to launch?</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>
            Create your workspace and invite your team in minutes.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/register" style={primaryBtn}>
            Get started
          </Link>
          <Link to="/contact" style={ghostBtn}>
            Book a demo
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <div style={{ marginTop: 8, color: "var(--muted)" }}>{text}</div>
    </div>
  );
}

function Testimonial({ quote, name, role }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ color: "var(--text)", fontWeight: 800, lineHeight: 1.4 }}>
        “{quote}”
      </div>
      <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
        <b style={{ color: "var(--text)" }}>{name}</b> · {role}
      </div>
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <details className="card" style={{ padding: 16 }}>
      <summary style={{ cursor: "pointer", fontWeight: 900 }}>{q}</summary>
      <div style={{ marginTop: 10, color: "var(--muted)" }}>{a}</div>
    </details>
  );
}

const hero = {
  display: "grid",
  gridTemplateColumns: "1.25fr 1fr",
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

const miniStat = {
  padding: 12,
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "rgba(37,99,235,0.05)",
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: 10,
};

const pricingGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
};

const newsletterBox = {
  padding: 18,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const newsletterForm = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
};

const newsletterInput = {
  width: 260,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  outline: "none",
};

const homeCTA = {
  padding: 18,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
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
