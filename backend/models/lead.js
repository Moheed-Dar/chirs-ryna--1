// backend/models/lead.js

import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    // Lead Contact Info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Lead Details
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    // Lead Type (Property Inquiry ya Guide Download)
    leadType: {
      type: String,
      enum: ["property_inquiry", "guide_download"],
      default: "property_inquiry",
    },

    // Guide Type (Konsa guide download kiya)
    guideType: {
      type: String,
      enum: ["buyer", "seller", null],
      default: null,
    },

    // Property Reference
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    title: {
      type: String,
      trim: true,
    },

    // Lead Source
    source: {
      type: String,
      enum: ["website", "facebook", "whatsapp", "referral", "other"],
      default: "website",
    },

    // Lead Status
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "negotiation",
        "converted",
        "lost",
      ],
      default: "new",
    },

    // Priority
    priority: {
      type: String,
      enum: ["low", "medium", "high", "hot"],
      default: "medium",
    },

    // Notes (for admin)
    notes: {
      type: String,
      trim: true,
    },

    // Follow Up
    followUpDate: {
      type: Date,
    },
    followUpNotes: {
      type: String,
      trim: true,
    },

    // Assigned To
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },

    // IP Address
    ipAddress: {
      type: String,
    },

    // User Agent
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// ============================================
// ✅ OPTIMIZED COMPOUND INDEXES
// ============================================

// Primary sort index (default query - no filter)
leadSchema.index({ createdAt: -1 });

// Compound indexes: Filter + Sort (MongoDB uses ONE index per query)
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ source: 1, createdAt: -1 });
leadSchema.index({ leadType: 1, createdAt: -1 });
leadSchema.index({ guideType: 1, createdAt: -1 });
leadSchema.index({ property: 1, createdAt: -1 });
leadSchema.index({ isRead: 1, createdAt: -1 });

// Text index for fast search (name, email, phone, title)
leadSchema.index(
  {
    name: "text",
    email: "text",
    phone: "text",
    title: "text",
  },
  {
    weights: {
      name: 10,
      email: 5,
      phone: 5,
      title: 3,
    },
    name: "lead_search_index",
  }
);

// Email lookup index
leadSchema.index({ email: 1 });

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);