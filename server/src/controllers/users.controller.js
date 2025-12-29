import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import { HttpError } from "../utils/HttpError.js";

export async function me(req, res) {
  const userId = req.user?.userId;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const user = await User.findById(userId).lean();
  if (!user) throw new HttpError(404, "User not found");

  const workspace = await Workspace.findById(user.workspaceId).lean();

  res.json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName || "",
      avatarUrl: user.avatarUrl || "",
      workspace: workspace
        ? { id: workspace._id, name: workspace.name, slug: workspace.slug }
        : null,
    },
  });
}
