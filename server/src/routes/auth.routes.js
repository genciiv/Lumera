// server/src/routes/auth.routes.js
import { Router } from "express";
import {
  login,
  register,
  refresh,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);
router.post("/auth/logout", logout);

export default router;
