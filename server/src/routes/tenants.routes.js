import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getMyTenant } from "../controllers/tenants.controller.js";

const router = Router();

router.get("/tenants/me", requireAuth, (req, res, next) =>
  getMyTenant(req, res).catch(next)
);

export default router;
