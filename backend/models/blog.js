import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    featuredImage: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    socialShareImage: {
      url: { type: String },
      public_id: { type: String },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Buying Tips',
        'Selling Tips',
        'Market Updates',
        'First-Time Buyers',
        'Mortgage Advice',
        'Home Maintenance',
        'Neighborhood Guides',
        'Investment Properties',
        'Luxury Homes',
      ],
      default: 'Market Updates',
    },
    tags: {
      type: [String],
      default: [],
    },
    // ==========================================
    // ✅ NEW: KEY POINTS / HIGHLIGHTS
    // ==========================================
    points: [
      {
        title: {
          type: String,
          trim: true,
          maxlength: [200, 'Point title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          trim: true,
          maxlength: [500, 'Point description cannot exceed 500 characters'],
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    headers: [
      {
        title: {
          type: String,
          required: [true, 'Header title is required'],
          trim: true,
          maxlength: [200, 'Header title cannot exceed 200 characters'],
        },
        description: {
          type: String,
          default: '',
          maxlength: [10000, 'Header description cannot exceed 10000 characters'],
        },
        headerType: {
          type: String,
          enum: ['h2', 'h3', 'h4'],
          default: 'h2',
        },
        image: {
          url: { type: String },
          public_id: { type: String },
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    readTime: {
      type: Number,
      default: 1,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);