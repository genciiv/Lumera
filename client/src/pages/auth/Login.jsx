export default function Login() {
  return (
    <form style={{ display: "grid", gap: 12 }}>
      <label>
        Email
        <input style={inputStyle} type="email" placeholder="you@company.com" />
      </label>

      <label>
        Password
        <input style={inputStyle} type="password" placeholder="••••••••" />
      </label>

      <button style={primaryBtn} type="button">
        Login
      </button>
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
