import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../lib/api";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    apiFetch(`/blog/${slug}`).then(async (res) => {
      const data = await res.json();
      setPost(data.post);
    });
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1>{post.title}</h1>
      <p style={{ color: "var(--muted)" }}>{post.excerpt}</p>
      <div style={{ whiteSpace: "pre-wrap", marginTop: 18 }}>
        {post.content}
      </div>
    </div>
  );
}
