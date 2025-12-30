// server/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    role: {
      type: String,
      enum: ["TenantOwner", "Admin", "User"],
      default: "User",
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Email unik vetëm brenda tenant-it
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
