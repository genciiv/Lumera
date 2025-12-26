import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import { HttpError } from "../utils/httpError.js";
import { slugify } from "../utils/slugify.js";

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

const isProd = process.env.NODE_ENV === "production";

// ✅ Dev-friendly cookie (localhost)
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd, // prod => true (https), dev => false
  sameSite: isProd ? "none" : "lax",
  path: "/", // ✅ keep simple in dev
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function generateUniqueSlug(name) {
  const base = slugify(name) || "workspace";
  let candidate = base;
  let i = 1;

  while (await Tenant.findOne({ slug: candidate })) {
    i += 1;
    candidate = `${base}-${i}`;
  }

  return candidate;
}

export async function register(req, res) {
  const { email, password, workspaceName } = req.body || {};

  if (!email || !password)
    throw new HttpError(400, "Email and password are required");
  if (password.length < 8)
    throw new HttpError(400, "Password must be at least 8 characters");

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new HttpError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(password, 12);

  const name = (workspaceName || "My Workspace").trim();
  const slug = await generateUniqueSlug(name);

  // ✅ Krijojmë user fillimisht me tenantId placeholder, pastaj e lidhim me tenant-in real
  const placeholderTenantId = new mongoose.Types.ObjectId();

  const user = await User.create({
    tenantId: placeholderTenantId, // do zëvendësohet pas krijimit të tenant
    email: normalizedEmail,
    passwordHash,
    role: "TenantOwner",
    fullName: "",
    avatarUrl: "",
  });

  const tenant = await Tenant.create({
    name,
    slug,
    ownerUserId: user._id,
  });

  user.tenantId = tenant._id;
  await user.save();

  const payload = {
    userId: user._id.toString(),
    role: user.role,
    tenantId: tenant._id.toString(),
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.status(201).json({ accessToken });
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password)
    throw new HttpError(400, "Email and password are required");

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) throw new HttpError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  const payload = {
    userId: user._id.toString(),
    role: user.role,
    tenantId: user.tenantId.toString(),
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.json({ accessToken });
}

export async function refresh(req, res) {
  const token = req.cookies?.refreshToken;
  if (!token) throw new HttpError(401, "Missing refresh token");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new HttpError(401, "Invalid refresh token");
  }

  const accessToken = signAccessToken({
    userId: payload.userId,
    role: payload.role,
    tenantId: payload.tenantId,
  });

  res.json({ accessToken });
}

export async function logout(req, res) {
  res.clearCookie("refreshToken", { ...refreshCookieOptions, maxAge: 0 });
  res.json({ ok: true });
}
