import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AppLayout() {
  const { user, logout } = useAuth();

  const isOwner = user?.role === "TenantOwner";
  const isAdmin = user?.role === "Admin";
  const canManageUsers = isOwner || isAdmin;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          padding: 16,
          borderRight: "1px solid var(--border)",
          background: "white",
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 10 }}>LUMERA</div>

        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
          {user?.email} · {user?.role}
        </div>

        <nav style={{ display: "grid", gap: 10 }}>
          <NavLink to="/app" style={linkStyle}>
            Dashboard
          </NavLink>

          {canManageUsers ? (
            <NavLink to="/app/users" style={linkStyle}>
              Users
            </NavLink>
          ) : null}

          {isOwner ? (
            <NavLink to="/app/settings" style={linkStyle}>
              Settings
            </NavLink>
          ) : null}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "white",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 24, background: "var(--bg)" }}>
        <Outlet />
      </main>
    </div>
  );
}

const linkStyle = ({ isActive }) => ({
  padding: "10px 12px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 800,
  color: isActive ? "white" : "black",
  background: isActive ? "var(--primary)" : "transparent",
});
