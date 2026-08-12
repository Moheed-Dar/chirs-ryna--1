import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    propertyCode: {
      type: String,
      required: [true, 'Property code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    priceType: {
      type: String,
      enum: ['sale', 'rent'],
      default: 'sale',
    },
    currency: {
      type: String,
      default: 'PKR',
      enum: ['PKR', 'USD', 'EUR', 'GBP', 'AED'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    propertyType: {
      type: String,
      enum: [
        'house', 'apartment', 'flat', 'plot', 'commercial',
        'office', 'shop', 'warehouse', 'villa', 'penthouse',
        'farmhouse', 'other',
      ],
      required: [true, 'Property type is required'],
    },
    bedrooms: {
      type: Number,
      min: 0,
    },
    bathrooms: {
      type: Number,
      min: 0,
    },
    kitchens: {
      type: Number,
      min: 0,
    },
    areaSize: {
      type: Number,
      min: 0,
    },
    areaUnit: {
      type: String,
      enum: ['sqft', 'sqm', 'marla', 'kanal', 'acre', 'yards'],
      default: 'sqft',
    },
    floors: {
      type: Number,
      min: 0,
    },
    yearBuilt: {
      type: Number,
    },
    features: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
          width: Number,
          height: Number,
          format: String,
        },
      ],
      default: [],
      validate: [
        (val) => val.length <= 10,
        'Maximum 10 images allowed',
      ],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented', 'pending', 'draft'],
      default: 'available',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    leadsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
propertySchema.index({ 
  title: 'text', 
  description: 'text', 
  location: 'text', 
  city: 'text' 
});
propertySchema.index({ city: 1, propertyType: 1, priceType: 1 });
propertySchema.index({ status: 1, isPublished: 1 });
propertySchema.index({ addedBy: 1 });
// propertySchema.index({ propertyCode: 1 }, { unique: true });

// ✅ YE LINE ZAROORI HAI - ISKE BINA YE ERROR AYEGA
export default mongoose.models.Property || mongoose.model('Property', propertySchema);