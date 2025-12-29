import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/register", (req, res, next) =>
  register(req, res).catch(next)
);
router.post("/auth/login", (req, res, next) => login(req, res).catch(next));
router.post("/auth/refresh", (req, res, next) => refresh(req, res).catch(next));
router.post("/auth/logout", (req, res, next) => logout(req, res).catch(next));

export default router;
