import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

export async function me(req, res) {
  const user = await User.findById(req.user.userId).select(
    "_id email role createdAt"
  );
  if (!user) throw new HttpError(404, "User not found");

  res.json({ user });
}
