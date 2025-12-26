import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [email, setEmail] = useState("vaqo@gmail.com");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const w = workspaceName.trim();
    const em = email.trim();
    const pw = password.trim();

    if (!em || !pw) return setError("Email and password are required");
    if (!w) return setError("Workspace name is required");

    setLoading(true);
    try {
      await register(em, pw, w);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 22 }}>LUMERA</div>
      <div style={{ color: "var(--muted)", marginTop: 6 }}>
        Sign in to manage your workspace.
      </div>

      <form onSubmit={onSubmit} style={{ marginTop: 14 }}>
        <label style={label}>
          Workspace name
          <input
            style={input}
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </label>

        <label style={label}>
          Email
          <input
            style={input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label style={label}>
          Password
          <input
            style={input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button style={btn} disabled={loading} type="submit">
          {loading ? "Creating..." : "Create account"}
        </button>

        {error ? <div style={errBox}>{error}</div> : null}

        <div style={{ marginTop: 10, fontSize: 14 }}>
          <Link to="/login">Login</Link> ·{" "}
          <span style={{ color: "var(--muted)" }}>Register</span>
        </div>
      </form>
    </div>
  );
}

const label = { display: "grid", gap: 6, marginTop: 12, fontWeight: 700 };
const input = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  outline: "none",
};

const btn = {
  width: "100%",
  marginTop: 14,
  padding: "10px 12px",
  borderRadius: 12,
  border: "none",
  background: "var(--primary)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const errBox = {
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(239, 68, 68, 0.08)",
  color: "#b91c1c",
  fontWeight: 700,
};
