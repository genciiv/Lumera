import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: false,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["PlatformOwner", "TenantOwner", "Admin", "Staff"],
      default: "TenantOwner",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
