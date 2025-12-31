// server/src/controllers/users.controller.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

function isOwnerOrAdmin(req) {
  const role = req.user?.role;
  return role === "TenantOwner" || role === "Admin";
}

// GET /api/users/me
export async function me(req, res) {
  try {
    const userId = req.user?.id || req.user?.sub; // varet si e ke requireAuth
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// PATCH /api/users/me
export async function updateMe(req, res) {
  try {
    const userId = req.user?.id || req.user?.sub;
    const { fullName, avatarUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { fullName: fullName ?? "", avatarUrl: avatarUrl ?? "" } },
      { new: true }
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("UPDATE ME ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// GET /api/users  (Owner/Admin)
export async function getUsers(req, res) {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const users = await User.find({ tenantId })
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    return res.json({ users });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// POST /api/users  (Owner/Admin) - krijon user brenda tenant-it
export async function createUser(req, res) {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const { email, password, fullName, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const allowedRoles = ["TenantOwner", "Admin", "User"];
    const finalRole = allowedRoles.includes(role) ? role : "User";

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await User.create({
      tenantId,
      email: email.toLowerCase().trim(),
      passwordHash,
      fullName: fullName || "",
      role: finalRole,
    });

    const user = await User.findById(created._id).select("-passwordHash");
    return res.status(201).json({ user });
  } catch (err) {
    // Duplicate key (tenantId+email unique)
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error("CREATE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// PATCH /api/users/:id  (Owner/Admin)
export async function updateUser(req, res) {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { fullName, avatarUrl, role } = req.body;

    const allowedRoles = ["TenantOwner", "Admin", "User"];
    const update = {};
    if (fullName !== undefined) update.fullName = fullName;
    if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;
    if (role !== undefined && allowedRoles.includes(role)) update.role = role;

    const user = await User.findOneAndUpdate(
      { _id: id, tenantId }, // ✅ tenant scoped
      { $set: update },
      { new: true }
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/users/:id  (Owner/Admin)
export async function deleteUser(req, res) {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    // Mos lejo të fshijë veten (opsionale)
    const meId = req.user?.id || req.user?.sub;
    if (String(meId) === String(id)) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const deleted = await User.findOneAndDelete({ _id: id, tenantId });
    if (!deleted) return res.status(404).json({ message: "User not found" });

    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
