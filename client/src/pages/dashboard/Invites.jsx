import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function safeJson(res) {
  return res.json().catch(() => null);
}

export default function Invites() {
  const { user } = useAuth();

  const isOwner = user?.role === "TenantOwner";
  const isAdmin = user?.role === "Admin";
  const canInvite = isOwner || isAdmin;

  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // create invite
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [creating, setCreating] = useState(false);
  const [lastLink, setLastLink] = useState("");

  async function loadInvites() {
    setLoading(true);
    setMsg("");
    try {
      const res = await apiFetch("/invites");
      const data = await safeJson(res);

      if (!res.ok) {
        setInvites([]);
        setMsg(data?.message || "Failed to load invites");
        return;
      }

      setInvites(Array.isArray(data?.invites) ? data.invites : []);
    } catch (e) {
      setInvites([]);
      setMsg(e.message || "Failed to load invites");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canInvite) loadInvites();
    else {
      setLoading(false);
      setInvites([]);
      setMsg("You don't have permission to manage invites.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canInvite]);

  async function onCreate(e) {
    e.preventDefault();
    setMsg("");
    setLastLink("");

    if (!email) return setMsg("Email is required");

    setCreating(true);
    try {
      const res = await apiFetch("/invites", {
        method: "POST",
        body: JSON.stringify({ email, role }),
      });

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message || "Create invite failed");

      setEmail("");
      setRole("User");

      setLastLink(data?.inviteLink || "");
      setMsg("✅ Invite created");
      await loadInvites();
    } catch (e) {
      setMsg(e.message || "Create invite failed");
    } finally {
      setCreating(false);
    }
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setMsg("✅ Copied link");
    } catch {
      setMsg("Copy failed (browser blocked)");
    }
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ margin: 0 }}>Invites</h1>
      <p style={{ color: "var(--muted)", marginTop: 6 }}>
        Invite users to your workspace.
      </p>

      {msg ? <div style={noteBox}>{msg}</div> : null}

      {/* Create invite */}
      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Create invite</div>

        {!canInvite ? (
          <div style={{ color: "var(--muted)" }}>No permission.</div>
        ) : (
          <form onSubmit={onCreate} style={{ display: "grid", gap: 10 }}>
            <label>
              Email
              <input
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="newuser@mail.com"
                required
              />
            </label>

            <label>
              Role
              <select
                style={inputStyle}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <button style={primaryBtn} type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create invite"}
            </button>

            {lastLink ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  Invite link:
                </div>
                <div style={linkBox}>
                  <code style={{ wordBreak: "break-all" }}>{lastLink}</code>
                </div>
                <button
                  type="button"
                  style={ghostBtn}
                  onClick={() => copy(lastLink)}
                >
                  Copy link
                </button>
              </div>
            ) : null}
          </form>
        )}
      </div>

      {/* List */}
      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 900 }}>All invites</div>
          <button style={ghostBtn} onClick={loadInvites} disabled={!canInvite}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ marginTop: 12 }}>Loading...</div>
        ) : invites.length === 0 ? (
          <div style={{ marginTop: 12, color: "var(--muted)" }}>
            No invites yet.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              marginTop: 12,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
                <th style={th}>Status</th>
                <th style={th}>Expires</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => {
                const accepted = !!inv.acceptedAt;
                const expired =
                  inv.expiresAt &&
                  new Date(inv.expiresAt).getTime() < Date.now();

                const status = accepted
                  ? "Accepted"
                  : expired
                  ? "Expired"
                  : "Pending";

                return (
                  <tr
                    key={inv._id}
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    <td style={td}>{inv.email}</td>
                    <td style={td}>{inv.role}</td>
                    <td style={td}>{status}</td>
                    <td style={td}>
                      {inv.expiresAt
                        ? new Date(inv.expiresAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
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
  fontWeight: 900,
  cursor: "pointer",
};

const ghostBtn = {
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "transparent",
  cursor: "pointer",
  fontWeight: 800,
};

const noteBox = {
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(59, 130, 246, 0.08)",
  fontSize: 14,
};

const linkBox = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(0,0,0,0.03)",
  marginBottom: 10,
};

const th = { padding: "10px 8px", color: "var(--muted)", fontWeight: 900 };
const td = { padding: "10px 8px" };
