import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET all users (tenant scoped)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ tenantId: req.user.tenantId }).select(
      "-password"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// CREATE user
export const createUser = async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const exists = await User.findOne({
      email,
      tenantId: req.user.tenantId,
    });

    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      role,
      fullName,
      tenantId: req.user.tenantId,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );

    res.json(user);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

// GET /api/users/me
export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    return res.json({ user });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// PATCH /api/users/me
export async function updateMe(req, res) {
  try {
    const { fullName, avatarUrl } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, avatarUrl },
      { new: true }
    ).select("-passwordHash");

    return res.json({ user: updated });
  } catch (err) {
    console.error("UPDATE ME ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
