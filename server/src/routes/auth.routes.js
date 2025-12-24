import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/register", (req, res, next) =>
  register(req, res).catch(next)
);
router.post("/auth/login", (req, res, next) => login(req, res).catch(next));

export default router;
