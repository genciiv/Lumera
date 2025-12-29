import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["TenantOwner", "Admin", "Member"],
      default: "Member",
    },

    fullName: {
      type: String,
      default: "",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ✅ KJO ESHTË PJESA E RËNDËSISHME
 * Email është unik vetëm brenda tenant-it
 */
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
