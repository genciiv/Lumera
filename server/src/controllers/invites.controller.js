import crypto from "crypto";
import bcrypt from "bcryptjs";
import Invite from "../models/Invite.js";
import User from "../models/User.js";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// GET /api/invites  (Owner/Admin)
export async function listInvites(req, res) {
  const invites = await Invite.find({ tenantId: req.user.tenantId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ invites });
}

// POST /api/invites  (Owner/Admin) -> krijo invite + kthe link
export async function createInvite(req, res) {
  const { email, role } = req.body || {};
  if (!email) return res.status(400).json({ message: "email is required" });

  const normalizedEmail = String(email).trim().toLowerCase();
  const safeRole = role === "Admin" ? "Admin" : "User";

  // mos lejo të ftojë dikë që ekziston
  const existingUser = await User.findOne({
    tenantId: req.user.tenantId,
    email: normalizedEmail,
  });
  if (existingUser)
    return res
      .status(400)
      .json({ message: "User already exists in this workspace" });

  // krijo token plain + hash
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  // anullo invite të vjetër aktive (opsionale)
  await Invite.deleteMany({
    tenantId: req.user.tenantId,
    email: normalizedEmail,
    acceptedAt: null,
  });

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  const invite = await Invite.create({
    tenantId: req.user.tenantId,
    email: normalizedEmail,
    role: safeRole,
    tokenHash,
    expiresAt,
    createdBy: req.user._id,
  });

  // link që e hap useri
  const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  const inviteLink = `${origin}/accept-invite?token=${token}`;

  res.status(201).json({ invite, inviteLink });
}

// POST /api/invites/accept  (public) -> token + password + fullName
export async function acceptInvite(req, res) {
  const { token, password, fullName } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({ message: "token and password are required" });
  }

  const tokenHash = hashToken(token);

  const invite = await Invite.findOne({ tokenHash, acceptedAt: null });
  if (!invite) return res.status(400).json({ message: "Invalid invite" });

  if (invite.expiresAt.getTime() < Date.now()) {
    return res.status(400).json({ message: "Invite expired" });
  }

  // krijo user
  const passwordHash = await bcrypt.hash(password, 10);

  const created = await User.create({
    tenantId: invite.tenantId,
    email: invite.email,
    passwordHash,
    fullName: fullName || "",
    role: invite.role,
  });

  invite.acceptedAt = new Date();
  await invite.save();

  // login do bëhet normalisht nga /login
  res.json({ ok: true, userId: created._id });
}
