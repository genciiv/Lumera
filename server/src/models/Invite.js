import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ["Admin", "User"], default: "User" },

    tokenHash: { type: String, required: true }, // ruajmë hash (jo tokenin plain)
    expiresAt: { type: Date, required: true },

    acceptedAt: { type: Date, default: null },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// një invite aktiv për tenant+email
inviteSchema.index({ tenantId: 1, email: 1, acceptedAt: 1 });

export default mongoose.model("Invite", inviteSchema);
