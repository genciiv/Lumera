import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";
import {
  listAdminPosts,
  createPost,
  deletePost,
  listPublicPosts,
  getPublicPostBySlug,
} from "../controllers/blog.controller.js";

const router = Router();

/* ============ PUBLIC BLOG (no auth) ============ */
router.get("/blog/public", listPublicPosts);
router.get("/blog/public/:slug", getPublicPostBySlug);

/* ============ ADMIN BLOG (auth + role) ============ */
router.get(
  "/blog",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  listAdminPosts
);

router.post(
  "/blog",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  createPost
);

router.delete(
  "/blog/:id",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  deletePost
);

export default router;
