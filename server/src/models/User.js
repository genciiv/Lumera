import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },

    fullName: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },

    role: {
      type: String,
      enum: ["TenantOwner", "Admin", "Member"],
      default: "Member",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
