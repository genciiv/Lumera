import jwt from "jsonwebtoken";
import { HttpError } from "../utils/HttpError.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing or invalid Authorization header"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // { userId, role, workspaceId, iat, exp }
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired access token"));
  }
}
