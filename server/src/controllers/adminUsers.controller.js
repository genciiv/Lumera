import bcrypt from "bcrypt";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

const VALID_ROLES = ["TenantOwner", "Admin", "Staff"];

export async function listTenantUsers(req, res) {
  const users = await User.find({ tenantId: req.user.tenantId })
    .select("_id email role fullName avatarUrl createdAt")
    .sort({ createdAt: -1 });

  res.json({ users });
}

export async function createTenantUser(req, res) {
  const { email, password, role, fullName } = req.body || {};

  if (!email || !password)
    throw new HttpError(400, "Email and password are required");
  if (password.length < 8)
    throw new HttpError(400, "Password must be at least 8 characters");

  const normalizedEmail = email.toLowerCase().trim();
  const safeRole = role || "Staff";

  if (!VALID_ROLES.includes(safeRole)) throw new HttpError(400, "Invalid role");

  // vetëm TenantOwner mund të krijojë TenantOwner
  if (safeRole === "TenantOwner" && req.user.role !== "TenantOwner") {
    throw new HttpError(403, "Only TenantOwner can create TenantOwner");
  }

  // email unique global
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new HttpError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    tenantId: req.user.tenantId,
    email: normalizedEmail,
    passwordHash,
    role: safeRole,
    fullName: typeof fullName === "string" ? fullName.trim() : "",
    avatarUrl: "",
  });

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
  });
}

export async function updateUserRole(req, res) {
  const { userId } = req.params;
  const { role } = req.body || {};

  if (!VALID_ROLES.includes(role)) throw new HttpError(400, "Invalid role");

  if (
    req.user.userId === userId &&
    req.user.role === "TenantOwner" &&
    role !== "TenantOwner"
  ) {
    throw new HttpError(400, "You cannot change your own owner role");
  }

  if (role === "TenantOwner" && req.user.role !== "TenantOwner") {
    throw new HttpError(403, "Only TenantOwner can assign TenantOwner");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, tenantId: req.user.tenantId },
    { role },
    { new: true, runValidators: true }
  ).select("_id email role fullName avatarUrl createdAt");

  if (!user) throw new HttpError(404, "User not found");

  res.json({ user });
}
