import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";
import {
  listInvites,
  createInvite,
  acceptInvite,
} from "../controllers/invites.controller.js";

const router = Router();

// Owner/Admin
router.get(
  "/invites",
  requireAuth,
  requireRole("TenantOwner", "Admin"),
  listInvites
);
router.post(
  "/invites",
  requireAuth,
  requireRole("TenantOwner", "Admin"),
  createInvite
);

// Public accept
router.post("/invites/accept", acceptInvite);

export default router;
