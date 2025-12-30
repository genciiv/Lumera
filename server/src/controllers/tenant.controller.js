import Tenant from "../models/Tenant.js";

export async function getMyTenant(req, res) {
  try {
    // ✅ merre tenantId nga requireAuth (mbaje edhe fallback)
    const tenantId =
      req.user?.tenantId || req.user?.tenant || req.user?.tenant_id;

    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.json({ tenant });
  } catch (err) {
    console.error("GET TENANT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
