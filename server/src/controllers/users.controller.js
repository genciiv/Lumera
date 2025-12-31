// server/src/controllers/users.controller.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// GET /api/users/me
export async function me(req, res) {
  try {
    const userId = req.user?.sub || req.user?._id;
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
    const userId = req.user?.sub || req.user?._id;
    const { fullName, avatarUrl } = req.body || {};

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { fullName: fullName || "", avatarUrl: avatarUrl || "" } },
      { new: true }
    ).select("-passwordHash");

    return res.json({ user });
  } catch (err) {
    console.error("UPDATE ME ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// GET /api/users  (Owner/Admin only) - list users in same tenant
export async function listUsers(req, res) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const users = await User.find({ tenantId })
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    return res.json({ users });
  } catch (err) {
    console.error("LIST USERS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// POST /api/users  (Owner/Admin only) - create user in same tenant
export async function createUser(req, res) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const { email, password, fullName, role } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const safeRole =
      role === "Admin"
        ? "Admin"
        : role === "TenantOwner"
        ? "TenantOwner"
        : "User";

    // Owner-only: mos lejo krijimin e TenantOwner nga admin/user
    if (safeRole === "TenantOwner" && req.user.role !== "TenantOwner") {
      return res
        .status(403)
        .json({ message: "Only TenantOwner can create another TenantOwner" });
    }

    const existing = await User.findOne({ tenantId, email: normalizedEmail });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await User.create({
      tenantId,
      email: normalizedEmail,
      passwordHash,
      fullName: fullName || "",
      role: safeRole,
    });

    const user = await User.findById(created._id).select("-passwordHash");
    return res.status(201).json({ user });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error("CREATE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/users/:id  (Owner/Admin only) - delete user in same tenant
export async function deleteUser(req, res) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return res.status(401).json({ message: "Unauthorized" });

    const targetId = req.params.id;
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    // vetëm brenda tenant-it
    if (String(target.tenantId) !== String(tenantId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // mos lejo fshirjen e TenantOwner nga Admin/User
    if (target.role === "TenantOwner" && req.user.role !== "TenantOwner") {
      return res
        .status(403)
        .json({ message: "Only TenantOwner can delete TenantOwner" });
    }

    // mos lejo user të fshij veten pa dashje
    const myId = req.user?.sub || req.user?._id;
    if (String(target._id) === String(myId)) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await User.deleteOne({ _id: targetId });
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
