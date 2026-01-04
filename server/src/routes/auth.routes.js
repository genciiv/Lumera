import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  acceptInvite,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);
router.post("/auth/logout", logout);

// opsionale
router.post("/auth/accept-invite", acceptInvite);

export default router;
