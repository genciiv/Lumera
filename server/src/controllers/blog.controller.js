import BlogPost from "../models/BlogPost.js";
import Tenant from "../models/Tenant.js";

/** helper: nxjerr tenant nga query ?tenant=slug  */
async function tenantFromQuery(req) {
  const slug = (req.query.tenant || "").trim().toLowerCase();
  if (!slug) return null;
  return Tenant.findOne({ slug });
}

/* ===================== PUBLIC ===================== */

/**
 * GET /api/blog/public?tenant=lumera
 * Kthen postet publike për tenant slug.
 */
export async function listPublicPosts(req, res) {
  const tenant = await tenantFromQuery(req);
  if (!tenant) return res.status(404).json({ message: "Tenant not found" });

  const posts = await BlogPost.find({
    tenantId: tenant._id,
    published: true,
  })
    .sort({ createdAt: -1 })
    .select("title slug createdAt");

  res.json({ posts });
}

/**
 * GET /api/blog/public/:slug?tenant=lumera
 * Kthen 1 post publik.
 */
export async function getPublicPostBySlug(req, res) {
  const tenant = await tenantFromQuery(req);
  if (!tenant) return res.status(404).json({ message: "Tenant not found" });

  const slug = (req.params.slug || "").trim().toLowerCase();

  const post = await BlogPost.findOne({
    tenantId: tenant._id,
    slug,
    published: true,
  }).select("title slug content createdAt");

  if (!post) return res.status(404).json({ message: "Post not found" });

  res.json({ post });
}

/* ===================== ADMIN ===================== */

/**
 * GET /api/blog
 * Lista admin për tenant-in e user-it.
 */
export async function listAdminPosts(req, res) {
  const posts = await BlogPost.find({
    tenantId: req.user.tenantId,
  })
    .sort({ createdAt: -1 })
    .select("title slug published createdAt");

  res.json({ posts });
}

/**
 * POST /api/blog
 * Body: { title, slug, content }
 */
export async function createPost(req, res) {
  const { title, slug, content = "" } = req.body || {};

  if (!title || !slug) {
    return res.status(400).json({ message: "Title and slug are required" });
  }

  const newPost = await BlogPost.create({
    tenantId: req.user.tenantId,
    authorId: req.user._id,
    title: String(title).trim(),
    slug: String(slug).trim().toLowerCase(),
    content: String(content),
    published: true,
  });

  res.status(201).json({ post: newPost });
}

/**
 * DELETE /api/blog/:id
 */
export async function deletePost(req, res) {
  const { id } = req.params;

  const post = await BlogPost.findOne({
    _id: id,
    tenantId: req.user.tenantId,
  });

  if (!post) return res.status(404).json({ message: "Post not found" });

  await post.deleteOne();
  res.json({ ok: true });
}
