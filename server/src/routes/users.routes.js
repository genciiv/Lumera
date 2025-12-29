import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { me, updateMe } from "../controllers/users.controller.js";

const router = Router();

router.get("/users/me", requireAuth, me);
router.patch("/users/me", requireAuth, updateMe);

export default router;
