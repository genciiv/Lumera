// server/src/controllers/users.controller.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function me(req, res) {
  return res.json({ user: req.user });
}

export async function updateMe(req, res) {
  const { fullName, avatarUrl } = req.body || {};
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName: fullName ?? req.user.fullName,
        avatarUrl: avatarUrl ?? req.user.avatarUrl,
      },
    },
    { new: true }
  ).select("-passwordHash");

  return res.json({ user });
}

export async function listUsers(req, res) {
  const users = await User.find({ tenantId: req.user.tenantId })
    .select("-passwordHash")
    .sort({ createdAt: -1 });

  return res.json({ users });
}

export async function createUser(req, res) {
  try {
    // vetëm Owner/Admin
    if (!["TenantOwner", "Admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { email, password, fullName, role } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const created = await User.create({
      tenantId: req.user.tenantId,
      email: normalizedEmail,
      passwordHash,
      fullName: fullName || "",
      role: role || "User",
    });

    const safe = await User.findById(created._id).select("-passwordHash");
    return res.status(201).json({ user: safe });
  } catch (err) {
    if (err?.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email already in use in this workspace" });
    }
    console.error("CREATE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
