import { NavLink, Outlet } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 12px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 800,
  color: isActive ? "white" : "var(--text)",
  background: isActive ? "var(--primary)" : "transparent",
});

export default function PublicLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>LUMERA</div>
          </NavLink>

          <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <NavLink to="/" end style={linkStyle}>
              Home
            </NavLink>
            <NavLink to="/services" style={linkStyle}>
              Services
            </NavLink>
            <NavLink to="/pricing" style={linkStyle}>
              Pricing
            </NavLink>
            <NavLink to="/blog" style={linkStyle}>
              Blog
            </NavLink>
            <NavLink to="/contact" style={linkStyle}>
              Contact
            </NavLink>
          </nav>

          <NavLink to="/login" style={linkStyle}>
            Login
          </NavLink>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "26px 18px" }}>
        <Outlet />
      </main>

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          marginTop: 32,
          padding: "20px 18px",
          color: "var(--muted)",
          background: "white",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          © {new Date().getFullYear()} Lumera · All rights reserved
        </div>
      </footer>
    </div>
  );
}
