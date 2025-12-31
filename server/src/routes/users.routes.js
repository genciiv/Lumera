// server/src/routes/users.routes.js
import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import {
  me,
  updateMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

// Profile (current user)
router.get("/users/me", requireAuth, me);
router.patch("/users/me", requireAuth, updateMe);

// Users CRUD (tenant scoped) - vetëm Owner/Admin
router.get("/users", requireAuth, getUsers);
router.post("/users", requireAuth, createUser);
router.patch("/users/:id", requireAuth, updateUser);
router.delete("/users/:id", requireAuth, deleteUser);

export default router;
