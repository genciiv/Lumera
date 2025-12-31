import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../lib/api.js";

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await apiFetch("/invites/accept", {
        method: "POST",
        body: JSON.stringify({ token, password, fullName }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Accept failed");

      setMsg("✅ Account created. Please login.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setMsg(err.message || "Accept failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h1>Accept Invite</h1>
      <p style={{ color: "var(--muted)" }}>
        Set your password to join the workspace.
      </p>

      {!token ? (
        <div
          style={{
            padding: 12,
            border: "1px solid var(--border)",
            borderRadius: 12,
          }}
        >
          Missing token.
        </div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label>
            Full name (optional)
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button disabled={loading} type="submit">
            {loading ? "Creating..." : "Create account"}
          </button>

          {msg ? <div style={{ marginTop: 8 }}>{msg}</div> : null}
        </form>
      )}
    </div>
  );
}
