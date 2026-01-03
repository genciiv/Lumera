import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// unik brenda tenant-it
blogPostSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

export default mongoose.model("BlogPost", blogPostSchema);
