import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";

/* ============================
   TOKEN HELPERS
============================ */

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tenantId: user.tenantId?.toString(),
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tenantId: user.tenantId?.toString(),
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

function setRefreshCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res) {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth/refresh",
  });
}

/* ============================
   REGISTER
============================ */
export async function register(req, res) {
  try {
    const { workspaceName, email, password, fullName } = req.body;

    if (!workspaceName || !email || !password) {
      return res.status(400).json({
        message: "workspaceName, email and password are required",
      });
    }

    // 1️⃣ krijo tenant (owner përkohësisht)
    const tenant = await Tenant.create({
      name: workspaceName,
      slug: workspaceName.trim().toLowerCase().replace(/\s+/g, "-"),
      owner: new mongoose.Types.ObjectId(),
    });

    // 2️⃣ kontroll email në tenant
    const existing = await User.findOne({
      tenantId: tenant._id,
      email,
    });

    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 3️⃣ krijo user
    const user = await User.create({
      tenantId: tenant._id,
      email,
      passwordHash,
      fullName: fullName || "",
      role: "TenantOwner",
    });

    // 4️⃣ lidh tenant me owner
    tenant.owner = user._id;
    await tenant.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
      },
      tenant: {
        _id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ============================
   LOGIN
============================ */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    setRefreshCookie(res, refreshToken);

    return res.json({
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ============================
   REFRESH
============================ */
export async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    setRefreshCookie(res, newRefreshToken);

    return res.json({ accessToken });
  } catch (err) {
    console.error("REFRESH ERROR:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

/* ============================
   LOGOUT
============================ */
export async function logout(req, res) {
  clearRefreshCookie(res);
  return res.json({ ok: true });
}
