// server/src/routes/users.routes.js
import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import {
  me,
  updateMe,
  listUsers,
  createUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

// profile
router.get("/users/me", requireAuth, me);
router.patch("/users/me", requireAuth, updateMe);

// users CRUD (tenant scope)
router.get("/users", requireAuth, listUsers);
router.post("/users", requireAuth, createUser);
router.delete("/users/:id", requireAuth, deleteUser);

export default router;
