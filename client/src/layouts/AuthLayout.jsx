import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="container">
      <div
        className="card"
        style={{ padding: 24, maxWidth: 420, margin: "60px auto" }}
      >
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>LUMERA</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>
            Sign in to manage your workspace.
          </div>
        </div>

        <Outlet />

        <div style={{ marginTop: 16, color: "var(--muted)", fontSize: 14 }}>
          <Link to="/login">Login</Link> · <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
