import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";

function mustHaveSecrets() {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("Missing JWT secrets in .env");
  }
}

function signAccessToken(user) {
  mustHaveSecrets();
  return jwt.sign(
    { userId: user._id, role: user.role, tenantId: user.tenantId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

function signRefreshToken(user) {
  mustHaveSecrets();
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // prod -> true (https)
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function normalizeEmail(email) {
  return String(email || "")
    .toLowerCase()
    .trim();
}

function slugify(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // hiq simbolet
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// krijo slug unik (nëse ekziston, shton -2 -3 ...)
async function uniqueTenantSlug(base) {
  let slug = slugify(base);
  if (!slug) slug = "workspace";

  let candidate = slug;
  let i = 2;

  while (await Tenant.findOne({ slug: candidate })) {
    candidate = `${slug}-${i}`;
    i++;
  }
  return candidate;
}

export async function register(req, res) {
  try {
    const { email, password, workspaceName, fullName } = req.body || {};

    if (!email || !password || !workspaceName) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const emailNorm = normalizeEmail(email);

    // Email global unik (siç e ke tani)
    const exists = await User.findOne({ email: emailNorm });
    if (exists) return res.status(409).json({ message: "Email already used" });

    // ✅ slug unik
    const slug = await uniqueTenantSlug(workspaceName);

    // krijo tenant + owner
    const tenant = await Tenant.create({
      name: String(workspaceName).trim(),
      slug,
    });

    const hash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      email: emailNorm,
      passwordHash: hash,
      fullName: fullName ? String(fullName) : "",
      role: "TenantOwner",
      tenantId: tenant._id,
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    return res.json({
      accessToken,
      tenant: { id: tenant._id, slug: tenant.slug, name: tenant.name },
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (e) {
    // ✅ Duplicate key
    if (e?.code === 11000) {
      const field = Object.keys(e.keyPattern || e.keyValue || {})[0] || "field";
      return res.status(409).json({ message: `Duplicate ${field}` });
    }

    // ✅ Mesazh i qartë për secrets
    if (String(e?.message || "").includes("Missing JWT secrets")) {
      return res
        .status(500)
        .json({ message: "Server missing JWT secrets (.env)" });
    }

    console.error("REGISTER ERROR:", e);
    return res.status(500).json({ message: "Register failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const emailNorm = normalizeEmail(email);

    const user = await User.findOne({ email: emailNorm });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    return res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
  } catch (e) {
    if (String(e?.message || "").includes("Missing JWT secrets")) {
      return res
        .status(500)
        .json({ message: "Server missing JWT secrets (.env)" });
    }
    console.error("LOGIN ERROR:", e);
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function refresh(req, res) {
  try {
    mustHaveSecrets();

    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "Invalid refresh" });

    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (e) {
    console.error("REFRESH ERROR:", e);
    return res.status(401).json({ message: "Invalid refresh" });
  }
}

export async function logout(req, res) {
  res.clearCookie("refreshToken", { path: "/" });
  return res.json({ ok: true });
}

export async function acceptInvite(req, res) {
  return res.status(501).json({ message: "Not implemented yet" });
}
