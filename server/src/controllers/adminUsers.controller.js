import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

const VALID_ROLES = ["TenantOwner", "Admin", "Staff"];

export async function listTenantUsers(req, res) {
  const users = await User.find({ tenantId: req.user.tenantId })
    .select("_id email role fullName avatarUrl createdAt")
    .sort({ createdAt: -1 });

  res.json({ users });
}

export async function updateUserRole(req, res) {
  const { userId } = req.params;
  const { role } = req.body || {};

  if (!VALID_ROLES.includes(role)) throw new HttpError(400, "Invalid role");

  // ✅ Mos lejo të ulësh veten nëse je TenantOwner (opsionale, por e sigurt)
  if (
    req.user.userId === userId &&
    req.user.role === "TenantOwner" &&
    role !== "TenantOwner"
  ) {
    throw new HttpError(400, "You cannot change your own owner role");
  }

  // ✅ Mos lejo që dikush tjetër të bëhet TenantOwner (vetëm owner)
  if (role === "TenantOwner" && req.user.role !== "TenantOwner") {
    throw new HttpError(403, "Only TenantOwner can assign TenantOwner");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, tenantId: req.user.tenantId }, // ✅ tenant scoped
    { role },
    { new: true, runValidators: true }
  ).select("_id email role fullName avatarUrl createdAt");

  if (!user) throw new HttpError(404, "User not found");

  res.json({ user });
}
