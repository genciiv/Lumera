import express from "express";
import { getMyTenant } from "../controllers/tenant.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, getMyTenant);

export default router;
