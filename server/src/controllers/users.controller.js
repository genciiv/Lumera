import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

export async function getMe(req, res) {
  const user = await User.findOne({
    _id: req.user.userId,
    tenantId: req.user.tenantId,
  }).select("_id email role tenantId fullName avatarUrl createdAt updatedAt");

  if (!user) throw new HttpError(404, "User not found");
  res.json({ user });
}

export async function updateMe(req, res) {
  const { fullName, avatarUrl } = req.body || {};

  const updates = {};
  if (typeof fullName === "string") updates.fullName = fullName.trim();
  if (typeof avatarUrl === "string") updates.avatarUrl = avatarUrl.trim();

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId, tenantId: req.user.tenantId },
    updates,
    { new: true, runValidators: true }
  ).select("_id email role tenantId fullName avatarUrl createdAt updatedAt");

  if (!user) throw new HttpError(404, "User not found");
  res.json({ user });
}
