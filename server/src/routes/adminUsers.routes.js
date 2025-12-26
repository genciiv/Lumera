import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import {
  listTenantUsers,
  updateUserRole,
} from "../controllers/adminUsers.controller.js";

const router = Router();

// vetëm Owner/Admin
router.get(
  "/admin/users",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  (req, res, next) => listTenantUsers(req, res).catch(next)
);

router.patch(
  "/admin/users/:userId/role",
  requireAuth,
  requireRole(["TenantOwner", "Admin"]),
  (req, res, next) => updateUserRole(req, res).catch(next)
);

export default router;
