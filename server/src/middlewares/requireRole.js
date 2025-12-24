import { HttpError } from "../utils/httpError.js";

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user?.role) return next(new HttpError(401, "Unauthorized"));

    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpError(403, "Forbidden"));
    }

    return next();
  };
}
