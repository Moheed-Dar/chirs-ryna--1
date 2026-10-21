import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
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
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// INDEXES - Name, Email par
// ============================================

// Individual indexes - exact match, prefix search, sorting ke liye
subscriberSchema.index({ name: 1 });

// Unique index - duplicate emails prevent karega + fast lookup
subscriberSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);