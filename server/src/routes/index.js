import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import tenantsRoutes from "./tenants.routes.js";

const router = Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(usersRoutes);
router.use(tenantsRoutes);

export default router;
