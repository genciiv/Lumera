import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

/**
 * GET /api/users/me
 * Kthen user-in e loguar (nga token)
 */
router.get("/users/me", requireAuth, async (req, res) => {
  // requireAuth vendos req.user
  res.json({ user: req.user });
});

export default router;
