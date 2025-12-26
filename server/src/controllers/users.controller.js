import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

export async function getMe(req, res) {
  const user = await User.findById(req.user.userId).select(
    "_id email role fullName avatarUrl createdAt updatedAt"
  );

  if (!user) throw new HttpError(404, "User not found");
  res.json({ user });
}

export async function updateMe(req, res) {
  const { fullName, avatarUrl } = req.body || {};

  // Lejo vetëm këto fusha për tani
  const updates = {};
  if (typeof fullName === "string") updates.fullName = fullName.trim();
  if (typeof avatarUrl === "string") updates.avatarUrl = avatarUrl.trim();

  const user = await User.findByIdAndUpdate(req.user.userId, updates, {
    new: true,
    runValidators: true,
  }).select("_id email role fullName avatarUrl createdAt updatedAt");

  if (!user) throw new HttpError(404, "User not found");
  res.json({ user });
}
