import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { HttpError } from "../utils/HttpError.js";

/**
 * GET /api/users/me
 */
export async function me(req, res) {
  const user = await User.findById(req.user.userId).select(
    "_id email role fullName avatarUrl tenantId createdAt"
  );

  if (!user) throw new HttpError(401, "Unauthorized");
  res.json({ user });
}

/**
 * GET /api/users
 * (Owner/Admin) list users in same tenant
 */
export async function listUsers(req, res) {
  const users = await User.find({ tenantId: req.user.tenantId })
    .select("_id email role fullName avatarUrl createdAt")
    .sort({ createdAt: -1 });

  res.json({ users });
}

/**
 * POST /api/users
 * (Owner/Admin) create user inside same tenant
 * body: { email, password, role?, fullName? }
 */
export async function createUser(req, res) {
  const { email, password, role = "Member", fullName = "" } = req.body || {};

  if (!email || !password)
    throw new HttpError(400, "Email and password are required");

  const cleanEmail = String(email).toLowerCase().trim();

  // ✅ unik brenda tenant-it
  const exists = await User.findOne({
    tenantId: req.user.tenantId,
    email: cleanEmail,
  });

  if (exists) throw new HttpError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(String(password), 10);

  const user = await User.create({
    tenantId: req.user.tenantId,
    email: cleanEmail,
    passwordHash, // ✅ kjo është kryesore
    role,
    fullName,
  });

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      tenantId: user.tenantId,
      createdAt: user.createdAt,
    },
  });
}

/**
 * PATCH /api/users/:id
 * (Owner/Admin) update user (same tenant)
 */
export async function updateUser(req, res) {
  const { id } = req.params;
  const { role, fullName, avatarUrl } = req.body || {};

  const user = await User.findOne({ _id: id, tenantId: req.user.tenantId });
  if (!user) throw new HttpError(404, "User not found");

  if (typeof role === "string") user.role = role;
  if (typeof fullName === "string") user.fullName = fullName;
  if (typeof avatarUrl === "string") user.avatarUrl = avatarUrl;

  await user.save();

  res.json({
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

/**
 * DELETE /api/users/:id
 * (Owner/Admin) delete user (same tenant)
 */
export async function deleteUser(req, res) {
  const { id } = req.params;

  // mos e lejo të fshijë veten
  if (id === String(req.user.userId))
    throw new HttpError(400, "You can't delete yourself");

  const user = await User.findOneAndDelete({
    _id: id,
    tenantId: req.user.tenantId,
  });
  if (!user) throw new HttpError(404, "User not found");

  res.json({ ok: true });
}
