export default function Contact() {
  return (
    <div style={{ maxWidth: 720, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Contact</h1>
      <p style={{ color: "var(--muted)" }}>
        Simple contact form (backend email later).
      </p>

      <form className="card" style={{ padding: 18, display: "grid", gap: 10 }}>
        <label>
          Name
          <input style={inputStyle} placeholder="Your name" />
        </label>
        <label>
          Email
          <input style={inputStyle} type="email" placeholder="you@mail.com" />
        </label>
        <label>
          Message
          <textarea
            style={{ ...inputStyle, minHeight: 120 }}
            placeholder="Write your message..."
          />
        </label>

        <button
          type="button"
          style={primaryBtn}
          onClick={() => alert("Later we connect this to backend/email.")}
        >
          Send
        </button>
      </form>
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
