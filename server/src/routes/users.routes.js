// server/src/routes/users.routes.js
import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import {
  me,
  updateMe,
  listUsers,
  createUser,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/users/me", requireAuth, me);
router.patch("/users/me", requireAuth, updateMe);

// ✅ për faqen Users
router.get("/users", requireAuth, listUsers);
router.post("/users", requireAuth, createUser);

export default router;
