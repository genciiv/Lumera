import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const linkStyle = ({ isActive }) => ({
  padding: "10px 12px",
  borderRadius: 12,
  display: "block",
  background: isActive ? "rgba(59, 130, 246, 0.12)" : "transparent",
  color: isActive ? "var(--text)" : "var(--muted)",
  fontWeight: isActive ? 600 : 500,
});

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const canSeeUsers = ["TenantOwner", "Admin"].includes(user?.role);

  async function onLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

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
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>LUMERA</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
            {user?.email || "—"} · {user?.role || "—"}
          </div>
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          <NavLink to="/app" end style={linkStyle}>
            Dashboard
          </NavLink>

          {canSeeUsers && (
            <NavLink to="/app/users" style={linkStyle}>
              Users
            </NavLink>
          )}

          <NavLink to="/app/settings" style={linkStyle}>
            Settings
          </NavLink>
        </nav>

        <button onClick={onLogout} style={logoutBtn}>
          Logout
        </button>
      </aside>

      <main style={{ padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}

const logoutBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "white",
  cursor: "pointer",
  fontWeight: 700,
};
