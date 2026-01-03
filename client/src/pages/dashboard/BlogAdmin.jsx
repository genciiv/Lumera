import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api.js";

export default function BlogAdmin() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("");
    const res = await apiFetch("/blog"); // ✅ API route (JO /app/blog)
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      setMsg(txt || "Failed to load posts");
      return;
    }
    const data = await res.json();
    setPosts(Array.isArray(data.posts) ? data.posts : []);
  }

  useEffect(() => {
    // eslint rule e bezdisur -> e bëjmë async wrapper
    (async () => {
      await load();
    })();
  }, []);

  async function create(e) {
    e.preventDefault();
    setMsg("");

    const res = await apiFetch("/blog", {
      method: "POST",
      body: JSON.stringify({ title, slug, content }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMsg(data?.message || "Create failed");
      return;
    }

    setTitle("");
    setSlug("");
    setContent("");
    await load();
  }

  async function remove(id) {
    setMsg("");
    const res = await apiFetch(`/blog/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMsg(data?.message || "Delete failed");
      return;
    }
    await load();
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ marginTop: 0 }}>Blog (Admin)</h1>

      {msg ? (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "rgba(239,68,68,0.08)",
            marginBottom: 12,
          }}
        >
          {msg}
        </div>
      ) : null}

      <form
        onSubmit={create}
        className="card"
        style={{ padding: 16, display: "grid", gap: 10 }}
      >
        <div style={{ fontWeight: 800 }}>Create post</div>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Slug (p.sh. first-post)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ ...inputStyle, minHeight: 140 }}
        />

        <button style={btnStyle} type="submit">
          Create
        </button>
      </form>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>All posts</div>

        {posts.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No posts yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {posts.map((p) => (
              <div
                key={p._id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "10px 12px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>
                    /blog/{p.slug}
                  </div>
                </div>

                <button
                  onClick={() => remove(p._id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "white",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
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
};

const btnStyle = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "none",
  background: "var(--primary)",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
};
