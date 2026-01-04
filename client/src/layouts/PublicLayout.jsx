import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header
        style={{
          background: "white",
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
            gap: 14,
          }}
        >
          <div style={{ fontWeight: 900, letterSpacing: 0.5 }}>LUMERA</div>

          <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <NavLink to="/" style={linkStyle}>
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

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {user ? (
              <>
                <NavLink to="/app" style={pillStyle}>
                  Dashboard
                </NavLink>
                <button onClick={onLogout} style={ghostBtn}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" style={pillStyle}>
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 18 }}>
        <Outlet />
      </main>

      <footer
        style={{
          marginTop: 40,
          borderTop: "1px solid var(--border)",
          background: "white",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: 16,
            color: "var(--muted)",
          }}
        >
          © 2026 Lumera · All rights reserved
        </div>
      </footer>
    </div>
  );
}

const linkStyle = ({ isActive }) => ({
  padding: "8px 10px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 800,
  color: isActive ? "white" : "black",
  background: isActive ? "var(--primary)" : "transparent",
});

const pillStyle = {
  padding: "8px 12px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 900,
  background: "var(--primary)",
  color: "white",
};

const ghostBtn = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid var(--border)",
  background: "white",
  cursor: "pointer",
  fontWeight: 900,
};
