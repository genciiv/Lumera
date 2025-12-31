import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";
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

// users (Owner/Admin)
router.get(
  "/users",
  requireAuth,
  requireRole("TenantOwner", "Admin"),
  listUsers
);

// create (Owner only)
router.post("/users", requireAuth, requireRole("TenantOwner"), createUser);

// delete (Owner/Admin)
router.delete(
  "/users/:id",
  requireAuth,
  requireRole("TenantOwner", "Admin"),
  deleteUser
);

export default router;
