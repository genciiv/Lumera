import jwt from "jsonwebtoken";

export function signAccessToken({ userId, role, workspaceId }) {
  if (!process.env.JWT_ACCESS_SECRET)
    throw new Error("Missing JWT_ACCESS_SECRET");
  return jwt.sign(
    { userId, role, workspaceId },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

export function signRefreshToken({ userId, role, workspaceId }) {
  if (!process.env.JWT_REFRESH_SECRET)
    throw new Error("Missing JWT_REFRESH_SECRET");
  return jwt.sign(
    { userId, role, workspaceId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
}
