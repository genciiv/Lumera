import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { me } from "../controllers/me.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

// Public
router.post("/auth/register", (req, res, next) =>
  register(req, res).catch(next)
);
router.post("/auth/login", (req, res, next) => login(req, res).catch(next));
router.post("/auth/refresh", (req, res, next) => refresh(req, res).catch(next));
router.post("/auth/logout", (req, res, next) => logout(req, res).catch(next));

// Protected
router.get("/auth/me", requireAuth, (req, res, next) =>
  me(req, res).catch(next)
);

// Test route: only PlatformOwner or TenantOwner
router.get(
  "/auth/admin-only",
  requireAuth,
  requireRole("PlatformOwner", "TenantOwner"),
  (req, res) =>
    res.json({ ok: true, message: "You have access", role: req.user.role })
);

export default router;
