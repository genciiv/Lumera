import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },

    content: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// slug unik brenda tenant-it
blogPostSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

export default mongoose.model("BlogPost", blogPostSchema);
