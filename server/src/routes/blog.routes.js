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

// PUBLIC
router.get("/public", listPublicPosts);
router.get("/public/:slug", getPublicPostBySlug);

// ADMIN
router.get(
  "/",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  listAdminPosts
);

router.post(
  "/",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  createPost
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  deletePost
);

export default router;
