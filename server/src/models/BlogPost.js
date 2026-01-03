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
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    content: { type: String, required: true },

    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// slug unik brenda tenant-it (admin)
blogPostSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

// slug unik për public vetëm për postimet published (opsionale)
// blogPostSchema.index({ slug: 1, published: 1 });

export default mongoose.model("BlogPost", blogPostSchema);
