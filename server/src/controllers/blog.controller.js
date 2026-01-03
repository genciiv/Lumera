import BlogPost from "../models/BlogPost.js";

export async function listPosts(req, res) {
  const tenantId = req.user.tenantId;
  const posts = await BlogPost.find({ tenantId }).sort({ createdAt: -1 });
  res.json({ posts });
}

export async function createPost(req, res) {
  const tenantId = req.user.tenantId;
  const { title, slug, content } = req.body;

  if (!title || !slug || !content) {
    return res
      .status(400)
      .json({ message: "title, slug, content are required" });
  }

  const created = await BlogPost.create({
    tenantId,
    title,
    slug: slug.trim().toLowerCase(),
    content,
    createdBy: req.user._id,
  });

  res.status(201).json({ post: created });
}

export async function deletePost(req, res) {
  const tenantId = req.user.tenantId;
  const { id } = req.params;

  const deleted = await BlogPost.findOneAndDelete({ _id: id, tenantId });
  if (!deleted) return res.status(404).json({ message: "Post not found" });

  res.json({ ok: true });
}
