import Tenant from "../models/Tenant.js";
import { HttpError } from "../utils/httpError.js";

export async function getMyTenant(req, res) {
  const tenant = await Tenant.findById(req.user.tenantId).select(
    "_id name slug ownerUserId createdAt"
  );
  if (!tenant) throw new HttpError(404, "Tenant not found");
  res.json({ tenant });
}
