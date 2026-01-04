import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api.js";

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    const res = await apiFetch("/blog");
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setErr(data?.message || "Failed to load posts");
      return;
    }
    setPosts(data.posts || []);
  }

  async function create(e) {
    e?.preventDefault?.();
    setErr("");

    const res = await apiFetch("/blog", {
      method: "POST",
      body: JSON.stringify({ title, slug, content }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data?.message || "Create failed");
      return;
    }

    setTitle("");
    setSlug("");
    setContent("");
    load();
  }

  async function remove(id) {
    setErr("");
    const res = await apiFetch(`/blog/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data?.message || "Delete failed");
      return;
    }
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ marginTop: 0 }}>Blog (Admin)</h1>

      {err ? (
        <div
          className="card"
          style={{
            padding: 12,
            marginBottom: 12,
            border: "1px solid var(--border)",
            background: "rgba(239,68,68,.08)",
          }}
        >
          {err}
        </div>
      ) : null}

      <form className="card" onSubmit={create} style={{ padding: 16 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Create post</div>

        <input
          style={inputStyle}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="Slug (p.sh. bizness-privat)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <textarea
          style={{ ...inputStyle, minHeight: 130 }}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button style={btnStyle} type="submit">
          Create
        </button>
      </form>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>All posts</div>

        {posts.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No posts yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {posts.map((p) => (
              <div
                key={p._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: 12,
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 900 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>
                    /blog/{p.slug}
                  </div>
                </div>

                <button
                  onClick={() => remove(p._id)}
                  type="button"
                  style={delBtnStyle}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  outline: "none",
  marginBottom: 10,
};

const btnStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "none",
  background: "var(--primary)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const delBtnStyle = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "white",
  cursor: "pointer",
  fontWeight: 900,
};
