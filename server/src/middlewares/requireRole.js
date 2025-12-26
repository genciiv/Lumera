import { HttpError } from "../utils/httpError.js";

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) return next(new HttpError(401, "Unauthorized"));

    if (!allowedRoles.includes(role)) {
      return next(new HttpError(403, "Forbidden"));
    }

    next();
  };
}
