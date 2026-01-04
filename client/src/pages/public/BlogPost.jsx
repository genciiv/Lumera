// client/src/pages/public/BlogPost.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { publicFetch } from "../../lib/api.js";

const TENANT = import.meta.env.VITE_TENANT_SLUG || "lumera";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await publicFetch(
          `/blog/public/${encodeURIComponent(slug)}?tenant=${encodeURIComponent(
            TENANT
          )}`
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);

        if (alive) setPost(data.post || null);
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to load post");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) return <div style={{ color: "var(--muted)" }}>Loading...</div>;

  if (err) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <Link to="/blog" style={{ textDecoration: "none", fontWeight: 900 }}>
          ← Back
        </Link>
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
      </div>
    );
  }

  if (!post) return null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <Link to="/blog" style={{ textDecoration: "none", fontWeight: 900 }}>
        ← Back
      </Link>

      <h1 style={{ marginTop: 14 }}>{post.title}</h1>

      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
      </div>

      <div
        className="card"
        style={{ padding: 16, marginTop: 16, whiteSpace: "pre-wrap" }}
      >
        {post.content || ""}
      </div>
    </div>
  );
}
