import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <h1>404</h1>
      <p style={{ color: "var(--muted)" }}>Page not found.</p>
      <Link to="/app">Go to dashboard</Link>
    </div>
  );
}
