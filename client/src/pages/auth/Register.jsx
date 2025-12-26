import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await register(email, password, workspaceName);
      navigate("/app", { replace: true });
    } catch (err) {
      setMsg(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
      <label>
        Workspace name
        <input
          style={inputStyle}
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
      </label>

      <label>
        Email
        <input
          style={inputStyle}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        Password
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button style={primaryBtn} type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create account"}
      </button>

      {msg ? <div style={errorBox}>{msg}</div> : null}
    </form>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  outline: "none",
};

const primaryBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "none",
  background: "var(--primary)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

const errorBox = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255, 0, 0, 0.25)",
  background: "rgba(255, 0, 0, 0.06)",
  color: "#8a1f1f",
  fontSize: 14,
};
