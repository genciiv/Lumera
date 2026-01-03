import { useParams, Link } from "react-router-dom";

export default function BlogPost() {
  const { slug } = useParams();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Link to="/blog" style={{ color: "var(--muted)" }}>
        ← Back to Blog
      </Link>

      <h1 style={{ margin: 0, textTransform: "capitalize" }}>
        {slug.replaceAll("-", " ")}
      </h1>

      <div className="card" style={{ padding: 18, color: "var(--muted)" }}>
        Placeholder post page. Later we will load blog content from MongoDB.
      </div>
    </div>
  );
}
