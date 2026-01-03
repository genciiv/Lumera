import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../lib/api";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    apiFetch("/blog").then(async (res) => {
      const data = await res.json();
      setPosts(data.posts);
    });
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1>Blog</h1>

      {posts.map((p) => (
        <Link key={p.slug} to={`/blog/${p.slug}`} className="card" style={card}>
          <div style={{ fontWeight: 900 }}>{p.title}</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>{p.excerpt}</div>
        </Link>
      ))}
    </div>
  );
}

const card = {
  padding: 18,
  textDecoration: "none",
  color: "inherit",
};
