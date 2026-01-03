import BlogPost from "../models/BlogPost.js";

// ===== PUBLIC =====
// GET /api/blog/public
export async function getPublicPosts(req, res) {
  try {
    const posts = await BlogPost.find({ published: true })
      .sort({ createdAt: -1 })
      .select("title slug createdAt");

    return res.json({ posts });
  } catch (err) {
    console.error("getPublicPosts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// GET /api/blog/public/:slug
export async function getPublicPostBySlug(req, res) {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOne({ slug, published: true });
    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.json({ post });
  } catch (err) {
    console.error("getPublicPostBySlug error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// ===== ADMIN (Tenant scoped) =====
// GET /api/blog
export async function listPosts(req, res) {
  try {
    const posts = await BlogPost.find({ tenantId: req.user.tenantId }).sort({
      createdAt: -1,
    });

    return res.json({ posts });
  } catch (err) {
    console.error("listPosts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// POST /api/blog
export async function createPost(req, res) {
  try {
    const { title, slug, content, published = true } = req.body;

    if (!title || !slug || !content) {
      return res
        .status(400)
        .json({ message: "title, slug, content are required" });
    }

    const post = await BlogPost.create({
      tenantId: req.user.tenantId,
      title,
      slug: slug.trim().toLowerCase(),
      content,
      published: !!published,
    });

    return res.status(201).json({ post });
  } catch (err) {
    // duplicate key (tenantId+slug)
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Slug already exists" });
    }
    console.error("createPost error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/blog/:id
export async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const deleted = await BlogPost.findOneAndDelete({
      _id: id,
      tenantId: req.user.tenantId,
    });

    if (!deleted) return res.status(404).json({ message: "Not found" });

    return res.json({ ok: true });
  } catch (err) {
    console.error("deletePost error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
