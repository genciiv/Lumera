import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.js";
import User from "../models/User.js";

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    throw new HttpError(400, "Email and password are required");
  if (password.length < 8)
    throw new HttpError(400, "Password must be at least 8 characters");

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new HttpError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    role: "TenantOwner",
  });

  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.status(201).json({ accessToken, refreshToken });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    throw new HttpError(400, "Email and password are required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new HttpError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.json({ accessToken, refreshToken });
}
