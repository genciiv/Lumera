import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { getMyTenant } from "../controllers/tenant.controller.js";

const router = Router();

// GET /api/tenants/me
router.get("/me", requireAuth, getMyTenant);

export default router;
