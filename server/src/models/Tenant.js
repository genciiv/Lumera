// server/src/models/Tenant.js
import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

tenantSchema.index({ slug: 1 }, { unique: true });

export default mongoose.model("Tenant", tenantSchema);
