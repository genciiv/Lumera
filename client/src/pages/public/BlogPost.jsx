import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
        // ✅ PUBLIC endpoint
        const res = await fetch(
          `/api/blog/public/${encodeURIComponent(slug)}`,
          {
            headers: { "Cache-Control": "no-store" },
          }
        );

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.message || `Error ${res.status}`);
        }

        if (alive) setPost(data.post);
      } catch (e) {
        if (alive) {
          setPost(null);
          setErr(e?.message || "Failed to load post");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "rgba(239, 68, 68, 0.08)",
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6 }}>
            Couldn’t load post
          </div>
          <div style={{ color: "var(--muted)" }}>{err}</div>
          <div style={{ marginTop: 12 }}>
            <Link to="/blog" style={linkBtn}>
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ color: "var(--muted)" }}>Post not found.</div>
        <div style={{ marginTop: 12 }}>
          <Link to="/blog" style={linkBtn}>
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const created = post?.createdAt ? new Date(post.createdAt) : null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <Link to="/blog" style={linkBtn}>
        ← Back to Blog
      </Link>

      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <h1 style={{ margin: 0 }}>{post.title}</h1>

        <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 13 }}>
          {created ? created.toLocaleString() : null}
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            margin: "16px 0",
          }}
        />

        {/* content */}
        <div style={contentStyle}>{post.content}</div>
      </div>
    </div>
  );
}

const linkBtn = {
  display: "inline-block",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  textDecoration: "none",
  fontWeight: 800,
  color: "black",
  background: "white",
};

const contentStyle = {
  whiteSpace: "pre-wrap",
  lineHeight: 1.6,
  fontSize: 16,
};
