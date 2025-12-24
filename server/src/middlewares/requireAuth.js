import jwt from "jsonwebtoken";
import { HttpError } from "../utils/httpError.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new HttpError(401, "Missing or invalid Authorization header"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // { userId, role }
    return next();
  } catch (err) {
    return next(new HttpError(401, "Invalid or expired access token"));
  }
}
