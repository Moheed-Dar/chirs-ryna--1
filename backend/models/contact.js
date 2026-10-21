import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// INDEXES - Name, Email, Phone par
// ============================================

// Individual indexes - exact match, prefix search, sorting ke liye
contactSchema.index({ name: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ phone: 1 });

// Compound index - sabse zyada use hone wali query ke liye
// isRead filter + createdAt sort → ye combination bahut fast hoga
contactSchema.index({ isRead: 1, createdAt: -1 });

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);