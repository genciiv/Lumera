import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicFetch } from "../../lib/api.js"; // nëse je te public

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // loading true by default
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    // ✅ microtask: s’quhet "synchronously" nga ESLint rule
    Promise.resolve().then(async () => {
      if (!alive) return;

      setErr("");

      try {
        const res = await publicFetch("/blog/public"); // ✅ saktë me API helper
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);

        if (alive) setPosts(data.posts || []);
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to load blog");
      } finally {
        if (alive) setLoading(false);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ marginTop: 0 }}>Blog</h1>

      {loading ? <div style={{ color: "var(--muted)" }}>Loading...</div> : null}

      {err ? (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "rgba(239, 68, 68, 0.08)",
            marginTop: 12,
          }}
        >
          {err}
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {posts.map((p) => (
          <Link
            key={p._id || p.slug}
            to={`/blog/${p.slug}`}
            className="card"
            style={{
              padding: 16,
              textDecoration: "none",
              color: "inherit",
              borderRadius: 14,
            }}
          >
            <div style={{ fontWeight: 900 }}>{p.title}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
              {p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}
            </div>
          </Link>
        ))}

        {!loading && !err && posts.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No posts yet.</div>
        ) : null}
      </div>
    </div>
  );
}
