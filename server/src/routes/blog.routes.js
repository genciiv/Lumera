import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import {
  listPosts,
  createPost,
  deletePost,
} from "../controllers/blog.controller.js";

const router = Router();

router.get("/", requireAuth, listPosts);
router.post("/", requireAuth, createPost);
router.delete("/:id", requireAuth, deletePost);

export default router;
