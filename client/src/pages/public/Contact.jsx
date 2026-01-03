export default function Contact() {
  return (
    <div style={{ maxWidth: 720, display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Contact</h1>
      <p style={{ color: "var(--muted)" }}>
        Tell us what you need — we reply with a plan.
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
          Topic
          <select style={inputStyle} defaultValue="demo">
            <option value="demo">Book a demo</option>
            <option value="custom">Custom plan</option>
            <option value="support">Support</option>
          </select>
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
          onClick={() => alert("✅ Sent! (later: connect to backend/email)")}
        >
          Send
        </button>

        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          Later we connect this to backend (Nodemailer).
        </div>
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
  background: "white",
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
