import { Router } from "express";
import { health, dbTest } from "../controllers/health.controller.js";

const router = Router();

router.get("/health", health);
router.get("/db-test", dbTest);

export default router;
