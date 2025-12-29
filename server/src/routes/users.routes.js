import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
  me,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/users/me", requireAuth, me);

router.get(
  "/users",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  listUsers
);
router.post(
  "/users",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  createUser
);
router.patch(
  "/users/:id",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  updateUser
);
router.delete(
  "/users/:id",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  deleteUser
);

export default router;
