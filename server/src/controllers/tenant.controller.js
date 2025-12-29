import Tenant from "../models/Tenant.js";

export async function getMyTenant(req, res) {
  const tenant = await Tenant.findById(req.user.tenant);

  if (!tenant) {
    return res.status(404).json({ message: "Tenant not found" });
  }

  res.json({ tenant });
}
