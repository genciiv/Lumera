import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Tenant from "../src/models/Tenant.js";

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ connected");

  const users = await User.find({ tenantId: { $exists: false } });
  console.log("users without tenantId:", users.length);

  for (const u of users) {
    const tenant = await Tenant.create({
      name: "Legacy Workspace",
      slug: `legacy-${u._id.toString().slice(-6)}`,
      ownerUserId: u._id,
    });
    u.tenantId = tenant._id;
    await u.save();
    console.log("fixed user", u.email, "tenant", tenant.slug);
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
