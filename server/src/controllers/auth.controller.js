// server/src/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tenantId: user.tenantId.toString(),
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
      tenantId: user.tenantId.toString(),
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

function setRefreshCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProd, // localhost => false
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

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { workspaceName, email, password, fullName } = req.body;

    if (!workspaceName || !email || !password) {
      return res
        .status(400)
        .json({ message: "workspaceName, email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const slug = workspaceName.trim().toLowerCase().replace(/\s+/g, "-");

    // ✅ Zgjidh ciklin Tenant.owner (required) & User.tenantId (required)
    const tenantId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    // kontrollo që slug të mos jetë zënë
    const slugExists = await Tenant.findOne({ slug }).lean();
    if (slugExists) {
      return res.status(400).json({ message: "Workspace already exists" });
    }

    // password hash
    const passwordHash = await bcrypt.hash(password, 10);

    // krijo tenant + user me ID-të e paracaktuara
    const tenant = await Tenant.create({
      _id: tenantId,
      name: workspaceName.trim(),
      slug,
      owner: userId,
    });

    const user = await User.create({
      _id: userId,
      tenantId: tenantId,
      email: normalizedEmail,
      passwordHash,
      fullName: fullName || "",
      role: "TenantOwner",
    });

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
        owner: tenant.owner,
      },
    });
  } catch (err) {
    // duplicate key (index unique)
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // ⚠️ Nëse email mund të ekzistojë në tenants të ndryshëm, kjo është “ambigue”.
    // Për momentin marrim të parin (më vonë mund ta bëjmë login me workspace/tenant slug).
    const user = await User.findOne({ email: normalizedEmail });
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
        fullName: user.fullName || "",
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// POST /api/auth/refresh
export async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    setRefreshCookie(res, newRefreshToken);

    return res.json({ accessToken });
  } catch (err) {
    console.error("REFRESH ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// POST /api/auth/logout
export async function logout(req, res) {
  clearRefreshCookie(res);
  return res.json({ ok: true });
}
