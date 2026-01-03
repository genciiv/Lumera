import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import {
  listPosts,
  createPost,
  deletePost,
  getPublicPosts,
  getPublicPostBySlug,
} from "../controllers/blog.controller.js";

const router = Router();

// ===== PUBLIC =====
router.get("/public", getPublicPosts);
router.get("/public/:slug", getPublicPostBySlug);

// ===== ADMIN =====
router.get("/", requireAuth, listPosts);
router.post("/", requireAuth, createPost);
router.delete("/:id", requireAuth, deletePost);

export default router;
