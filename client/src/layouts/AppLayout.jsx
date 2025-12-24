import { Outlet, NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 12px",
  borderRadius: 12,
  display: "block",
  background: isActive ? "rgba(59, 130, 246, 0.12)" : "transparent",
  color: isActive ? "var(--text)" : "var(--muted)",
  fontWeight: isActive ? 600 : 500,
});

export default function AppLayout() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        minHeight: "100vh",
      }}
    >
      <aside
        style={{
          padding: 18,
          borderRight: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 18 }}>
          LUMERA
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          <NavLink to="/app" end style={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/app/settings" style={linkStyle}>
            Settings
          </NavLink>
        </nav>
      </aside>

      <main style={{ padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}
