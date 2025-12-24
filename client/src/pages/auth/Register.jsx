export default function Register() {
  return (
    <form style={{ display: "grid", gap: 12 }}>
      <label>
        Company name
        <input style={inputStyle} type="text" placeholder="My Business" />
      </label>

      <label>
        Email
        <input
          style={inputStyle}
          type="email"
          placeholder="owner@company.com"
        />
      </label>

      <label>
        Password
        <input
          style={inputStyle}
          type="password"
          placeholder="Create a password"
        />
      </label>

      <button style={primaryBtn} type="button">
        Create account
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
