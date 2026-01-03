import { Link } from "react-router-dom";

const POSTS = [
  {
    slug: "welcome-to-lumera",
    title: "Welcome to Lumera",
    excerpt: "What we built so far and what's next.",
  },
  {
    slug: "roles-permissions",
    title: "Roles & Permissions",
    excerpt: "How Owner/Admin/User works in a tenant.",
  },
  {
    slug: "invites-flow",
    title: "Invite links explained",
    excerpt: "Create invite → accept → join workspace.",
  },
];

export default function Blog() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Blog</h1>
      <p style={{ color: "var(--muted)" }}>
        Public posts (static now, DB later).
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {POSTS.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} style={postCard}>
            <div style={{ fontWeight: 900 }}>{p.title}</div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              {p.excerpt}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const postCard = {
  border: "1px solid var(--border)",
  background: "white",
  borderRadius: 16,
  padding: 16,
  textDecoration: "none",
  color: "inherit",
};
