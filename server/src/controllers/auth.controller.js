import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";
import Workspace from "../models/Workspace.js";

import { HttpError } from "../utils/HttpError.js";
import { signAccessToken, signRefreshToken } from "../utils/tokens.js";

import Tenant from "../models/Tenant.js";

const isProd = process.env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd, // prod: true (https)
  sameSite: isProd ? "none" : "lax",
  path: "/api/auth/refresh",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ---- helpers ----
function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function makeUniqueSlug(name) {
  const base = slugify(name) || "workspace";
  let slug = base;
  let i = 1;

  while (await Workspace.findOne({ slug })) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

// ---- controllers ----
export async function register(req, res) {
  const { email, password, workspaceName } = req.body || {};

  const em = String(email || "")
    .toLowerCase()
    .trim();
  const pw = String(password || "").trim();
  const wn = String(workspaceName || "").trim();

  if (!wn) throw new HttpError(400, "Workspace name is required");
  if (!em || !pw) throw new HttpError(400, "Email and password are required");

  const exists = await User.findOne({ email: em });
  if (exists) throw new HttpError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(pw, 10);

  // 1) create workspace first
  const slug = await makeUniqueSlug(wn);

  // ownerUserId is required by schema; we set a temporary ObjectId then replace it
  const tempOwnerId = new mongoose.Types.ObjectId();

  const workspace = await Workspace.create({
    name: wn,
    slug,
    ownerUserId: tempOwnerId,
  });

  const tenant = await Tenant.create({
    name: workspaceName,
    owner: user._id,
  });

  user.tenant = tenant._id;
  await user.save();

  // 2) create user as TenantOwner
  const user = await User.create({
    workspaceId: workspace._id,
    email: em,
    passwordHash,
    role: "TenantOwner",
  });

  // 3) update workspace ownerUserId with real user id
  workspace.ownerUserId = user._id;
  await workspace.save();

  const accessToken = signAccessToken({
    userId: user._id,
    role: user.role,
    workspaceId: workspace._id,
  });

  const refreshToken = signRefreshToken({
    userId: user._id,
    role: user.role,
    workspaceId: workspace._id,
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.status(201).json({ accessToken });
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  const em = String(email || "")
    .toLowerCase()
    .trim();
  const pw = String(password || "").trim();

  if (!em || !pw) throw new HttpError(400, "Email and password are required");

  const user = await User.findOne({ email: em });
  if (!user) throw new HttpError(401, "Invalid credentials");

  const ok = await bcrypt.compare(pw, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  const accessToken = signAccessToken({
    userId: user._id,
    role: user.role,
    workspaceId: user.workspaceId,
  });

  const refreshToken = signRefreshToken({
    userId: user._id,
    role: user.role,
    workspaceId: user.workspaceId,
  });

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
    workspaceId: payload.workspaceId,
  });

  res.json({ accessToken });
}

export async function logout(req, res) {
  res.clearCookie("refreshToken", { ...refreshCookieOptions, maxAge: 0 });
  res.json({ ok: true });
}
