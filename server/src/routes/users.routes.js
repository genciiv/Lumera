import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getMe, updateMe } from "../controllers/users.controller.js";

const router = Router();

router.get("/users/me", requireAuth, (req, res, next) =>
  getMe(req, res).catch(next)
);
router.patch("/users/me", requireAuth, (req, res, next) =>
  updateMe(req, res).catch(next)
);

export default router;
