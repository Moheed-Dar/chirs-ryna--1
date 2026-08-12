// import { NextResponse } from 'next/server';
// import connectDB from '@/backend/lib/db';
// import Property from '@/backend/models/property';
// import { withAuth } from '@/backend/middleware/auth';
// import { uploadMultipleImages } from '@/backend/lib/cloudinary';
// import ApiError from '@/backend/utils/apierror';

// // ✅ UNIQUE PROPERTY CODE GENERATOR
// const generatePropertyCode = async () => {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let code;
//   let isUnique = false;

//   while (!isUnique) {
//     code = 'PROP-';
//     for (let i = 0; i < 6; i++) {
//       code += chars.charAt(Math.floor(Math.random() * chars.length));
//     }

//     const exists = await Property.findOne({ propertyCode: code });
//     if (!exists) {
//       isUnique = true;
//     }
//   }

//   return code;
// };

// const createProperty = async (request, context, user) => {
//   try {
//     await connectDB();

//     // ✅ SECURITY: Sirf Admin hi property create kar sakta hai
//     if (user.role !== 'admin') {
//       throw new ApiError(403, 'Access denied. Only admin can create properties.');
//     }

//     const formData = await request.formData();

//     // Extract Text Fields
//     const title = formData.get('title');
//     const description = formData.get('description');
//     const price = formData.get('price');
//     const priceType = formData.get('priceType') || 'sale';
//     const currency = formData.get('currency') || 'PKR';
//     const location = formData.get('location');
//     const city = formData.get('city');
//     const area = formData.get('area') || '';
//     const address = formData.get('address') || '';
//     const latitude = formData.get('latitude') || null;
//     const longitude = formData.get('longitude') || null;
//     const propertyType = formData.get('propertyType');
//     const bedrooms = formData.get('bedrooms') || 0;
//     const bathrooms = formData.get('bathrooms') || 0;
//     const kitchens = formData.get('kitchens') || 0;
//     const areaSize = formData.get('areaSize') || 0;
//     const areaUnit = formData.get('areaUnit') || 'sqft';
//     const floors = formData.get('floors') || 0;
//     const yearBuilt = formData.get('yearBuilt') || null;
//     const isFeatured = formData.get('isFeatured') === 'true';
//     const isPublished = formData.get('isPublished') !== 'false';
//     const contactName = formData.get('contactName') || user.name;
//     const contactPhone = formData.get('contactPhone') || user.phone || '';
//     const contactEmail = formData.get('contactEmail') || user.email;

//     // Features & Amenities
//     const featuresRaw = formData.get('features');
//     const amenitiesRaw = formData.get('amenities');

//     let propertyFeatures = [];
//     let propertyAmenities = [];

//     if (featuresRaw) {
//       try {
//         const parsed = JSON.parse(featuresRaw);
//         propertyFeatures = Array.isArray(parsed) ? parsed : [];
//       } catch (e) { propertyFeatures = []; }
//     }

//     if (amenitiesRaw) {
//       try {
//         const parsed = JSON.parse(amenitiesRaw);
//         propertyAmenities = Array.isArray(parsed) ? parsed : [];
//       } catch (e) { propertyAmenities = []; }
//     }

//     // Validations
//     if (!title || !description || !price || !location || !city || !propertyType) {
//       throw new ApiError(400, 'Title, description, price, location, city and property type are required');
//     }

//     if (Number(price) <= 0) {
//       throw new ApiError(400, 'Price must be greater than 0');
//     }

//     // ==========================================
//     // ✅ BULLETPROOF IMAGE DETECTION LOGIC
//     // ==========================================
//     let imageFiles = [];

//     // Method 1: Standard 'images' key + File instance
//     imageFiles = formData.getAll('images').filter(
//       (file) => file instanceof File && file.size > 0
//     );

//     // Method 2: Standard 'images' key + Blob instance (Next.js quirk fix)
//     if (imageFiles.length === 0) {
//       imageFiles = formData.getAll('images').filter(
//         (file) => file instanceof Blob && file.size > 0
//       );
//     }

//     // Method 3: Agar frontend 'image', 'photos' ya 'images[0]' jaisa key bhej raha ho
//     if (imageFiles.length === 0) {
//       for (const [key, value] of formData.entries()) {
//         if (key.toLowerCase().includes('image') && value instanceof Blob && value.size > 0) {
//           imageFiles.push(value);
//         }
//       }
//     }

//     // Method 4: LAST RESORT - Form data mein jo bhi File/Blob hai, usko utha lo
//     if (imageFiles.length === 0) {
//       for (const [key, value] of formData.entries()) {
//         if (value instanceof Blob && value.size > 0) {
//           console.log(`Found blob at key "${key}"`);
//           imageFiles.push(value);
//         }
//       }
//     }

//     // Final Check
//     if (imageFiles.length === 0) {
//       throw new ApiError(400, 'At least one property image is required. Make sure you are sending images.');
//     }

//     if (imageFiles.length > 10) {
//       throw new ApiError(400, 'Maximum 10 images are allowed');
//     }

//     // Upload to Cloudinary
//     let uploadedImages = [];
//     try {
//       uploadedImages = await uploadMultipleImages(imageFiles, 'properties', {
//         maxWidth: 1920,
//         maxHeight: 1080,
//         quality: 80,
//       });
//     } catch (error) {
//       console.error('Cloudinary Upload Error:', error);
//       throw new ApiError(500, 'Failed to upload images. Please try again.');
//     }

//     const thumbnail = uploadedImages.length > 0 ? uploadedImages[0].url : '';

//     // ==========================================
//     // ✅ PROPERTY CREATE KARO WITH RETRY LOGIC
//     // ==========================================
//     const newProperty = {
//       title: title.trim(),
//       description: description.trim(),
//       price: Number(price),
//       priceType: priceType,
//       currency: currency,
//       location: location.trim(),
//       city: city.trim(),
//       area: area.trim(),
//       address: address.trim(),
//       latitude: latitude ? Number(latitude) : null,
//       longitude: longitude ? Number(longitude) : null,
//       propertyType: propertyType,
//       bedrooms: Number(bedrooms),
//       bathrooms: Number(bathrooms),
//       kitchens: Number(kitchens),
//       areaSize: Number(areaSize),
//       areaUnit: areaUnit,
//       floors: Number(floors),
//       yearBuilt: yearBuilt ? Number(yearBuilt) : null,
//       features: propertyFeatures,
//       amenities: propertyAmenities,
//       images: uploadedImages,
//       thumbnail: thumbnail,
//       isFeatured: isFeatured,
//       isPublished: isPublished,
//       contactName: contactName.trim(),
//       contactPhone: contactPhone.trim(),
//       contactEmail: contactEmail.trim(),
//       addedBy: user._id,
//     };

//     let property;
//     let attempts = 0;
//     const maxAttempts = 3;

//     while (attempts < maxAttempts) {
//       try {
//         newProperty.propertyCode = await generatePropertyCode();
//         property = await Property.create(newProperty);
//         break;
//       } catch (error) {
//         if (error.code === 11000 && error.keyPattern && error.keyPattern.propertyCode) {
//           attempts++;
//           if (attempts >= maxAttempts) {
//             throw new ApiError(500, 'Failed to generate unique property code. Please try again.');
//           }
//         } else {
//           throw error;
//         }
//       }
//     }

//     await property.populate('addedBy', 'name email phone avatar');

//     // ==========================================
//     // ✅ ORDERED RESPONSE
//     // ==========================================
//     const propertyObject = property.toObject();
    
//     const { 
//       _id, 
//       propertyCode,
//       title: propTitle, 
//       description: propDesc, 
//       price: propPrice, 
//       priceType: propPriceType, 
//       currency: propCurrency, 
//       location: propLocation, 
//       city: propCity, 
//       area: propArea, 
//       address: propAddress, 
//       latitude: propLat, 
//       longitude: propLng, 
//       propertyType: propType, 
//       bedrooms: propBedrooms, 
//       bathrooms: propBathrooms, 
//       kitchens: propKitchens, 
//       areaSize: propAreaSize, 
//       areaUnit: propAreaUnit, 
//       floors: propFloors, 
//       yearBuilt: propYearBuilt, 
//       features: propFeatures, 
//       amenities: propAmenities, 
//       images: propImages, 
//       thumbnail: propThumbnail, 
//       isFeatured: propFeatured, 
//       isPublished: propPublished, 
//       contactName: propContactName, 
//       contactPhone: propContactPhone, 
//       contactEmail: propContactEmail, 
//       addedBy: propAddedBy, 
//       createdAt, 
//       updatedAt,
//       __v,
//       ...rest 
//     } = propertyObject;

//     const orderedProperty = {
//       _id,                                    
//       propertyCode,                           
//       title: propTitle,
//       description: propDesc,
//       price: propPrice,
//       priceType: propPriceType,
//       currency: propCurrency,
//       location: propLocation,
//       city: propCity,
//       area: propArea,
//       address: propAddress,
//       coordinates: {
//         latitude: propLat,
//         longitude: propLng
//       },
//       propertyType: propType,
//       bedrooms: propBedrooms,
//       bathrooms: propBathrooms,
//       kitchens: propKitchens,
//       areaSize: propAreaSize,
//       areaUnit: propAreaUnit,
//       floors: propFloors,
//       yearBuilt: propYearBuilt,
//       features: propFeatures,
//       amenities: propAmenities,
//       images: propImages,
//       thumbnail: propThumbnail,
//       isFeatured: propFeatured,
//       isPublished: propPublished,
//       contact: {
//         name: propContactName,
//         phone: propContactPhone,
//         email: propContactEmail
//       },
//       addedBy: propAddedBy,
//       createdAt,
//       updatedAt,
//       ...rest
//     };

//     delete orderedProperty.__v;

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Property created successfully',
//         data: orderedProperty,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Create Property Error:', error);
//     const statusCode = error.statusCode || 500;
//     const message = error.message || 'Internal Server Error';
//     return NextResponse.json(
//       {
//         success: false,
//         message: message,
//       },
//       { status: statusCode }
//     );
//   }
// };

// export const POST = withAuth(createProperty);


























// import { NextResponse } from 'next/server';
// import connectDB from '@/backend/lib/db';
// import Property from '@/backend/models/property';
// import { withAdminAuth } from '@/backend/middleware/auth';
// import { uploadMultipleImages } from '@/backend/lib/cloudinary';
// import ApiError from '@/backend/utils/apierror';
// import { 
//   sanitizeInput, 
//   validateFiles, 
//   getSecurityHeaders, 
//   validateRequestSize,
//   securityLog 
// } from '@/backend/lib/security';
// import { strictRateLimiter, uploadRateLimiter } from '@/backend/lib/rateLimiter';

// // ==========================================
// // ✅ CONSTANTS - Easy to modify
// // ==========================================
// const PROPERTY_CODE_PREFIX = 'PROP';
// const PROPERTY_CODE_LENGTH = 6;
// const MAX_CODE_GENERATION_ATTEMPTS = 3;

// const ALLOWED_PROPERTY_TYPES = [
//   'house', 'apartment', 'villa', 'penthouse', 
//   'plot', 'commercial', 'office', 'shop', 
//   'warehouse', 'farmhouse', 'flat', 'studio'
// ];

// const ALLOWED_PRICE_TYPES = ['sale', 'rent'];
// const ALLOWED_CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'AED'];
// const ALLOWED_AREA_UNITS = ['sqft', 'sqm', 'marla', 'kanal', 'acre'];

// const MAX_IMAGES = 10;
// const MIN_TITLE_LENGTH = 5;
// const MAX_TITLE_LENGTH = 150;
// const MIN_DESCRIPTION_LENGTH = 20;
// const MAX_DESCRIPTION_LENGTH = 5000;
// const MAX_PRICE = 999999999999;
// const MAX_COORDINATE = 180;

// // ==========================================
// // ✅ UNIQUE PROPERTY CODE GENERATOR
// // ==========================================
// const generatePropertyCode = async () => {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let attempts = 0;

//   while (attempts < MAX_CODE_GENERATION_ATTEMPTS) {
//     let code = PROPERTY_CODE_PREFIX + '-';
//     for (let i = 0; i < PROPERTY_CODE_LENGTH; i++) {
//       code += chars.charAt(Math.floor(Math.random() * chars.length));
//     }

//     const exists = await Property.findOne({ propertyCode: code }).lean();
//     if (!exists) {
//       return code;
//     }
//     attempts++;
//   }

//   // Fallback: Timestamp based
//   const timestamp = Date.now().toString(36).toUpperCase();
//   return `${PROPERTY_CODE_PREFIX}-${timestamp.slice(-6)}`;
// };

// // ==========================================
// // ✅ INPUT VALIDATORS
// // ==========================================
// const validators = {
//   title: (value) => {
//     if (!value || typeof value !== 'string') return 'Title is required';
//     const trimmed = value.trim();
//     if (trimmed.length < MIN_TITLE_LENGTH) return `Title must be at least ${MIN_TITLE_LENGTH} characters`;
//     if (trimmed.length > MAX_TITLE_LENGTH) return `Title must not exceed ${MAX_TITLE_LENGTH} characters`;
//     return null;
//   },

//   description: (value) => {
//     if (!value || typeof value !== 'string') return 'Description is required';
//     const trimmed = value.trim();
//     if (trimmed.length < MIN_DESCRIPTION_LENGTH) return `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`;
//     if (trimmed.length > MAX_DESCRIPTION_LENGTH) return `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`;
//     return null;
//   },

//   price: (value) => {
//     if (!value) return 'Price is required';
//     const num = Number(value);
//     if (isNaN(num) || num <= 0) return 'Price must be a positive number';
//     if (num > MAX_PRICE) return 'Price exceeds maximum limit';
//     return null;
//   },

//   priceType: (value) => {
//     if (!value) return null; // Optional, has default
//     if (!ALLOWED_PRICE_TYPES.includes(value)) return `Price type must be one of: ${ALLOWED_PRICE_TYPES.join(', ')}`;
//     return null;
//   },

//   currency: (value) => {
//     if (!value) return null; // Optional, has default
//     if (!ALLOWED_CURRENCIES.includes(value)) return `Currency must be one of: ${ALLOWED_CURRENCIES.join(', ')}`;
//     return null;
//   },

//   location: (value) => {
//     if (!value || typeof value !== 'string') return 'Location is required';
//     if (value.trim().length < 2) return 'Location is too short';
//     if (value.trim().length > 200) return 'Location is too long';
//     return null;
//   },

//   city: (value) => {
//     if (!value || typeof value !== 'string') return 'City is required';
//     if (value.trim().length < 2) return 'City is too short';
//     if (value.trim().length > 100) return 'City is too long';
//     return null;
//   },

//   propertyType: (value) => {
//     if (!value || typeof value !== 'string') return 'Property type is required';
//     if (!ALLOWED_PROPERTY_TYPES.includes(value.toLowerCase())) {
//       return `Property type must be one of: ${ALLOWED_PROPERTY_TYPES.join(', ')}`;
//     }
//     return null;
//   },

//   bedrooms: (value) => {
//     if (!value && value !== 0) return null;
//     const num = Number(value);
//     if (isNaN(num) || num < 0 || !Number.isInteger(num)) return 'Bedrooms must be a non-negative integer';
//     if (num > 50) return 'Bedrooms value seems unrealistic';
//     return null;
//   },

//   bathrooms: (value) => {
//     if (!value && value !== 0) return null;
//     const num = Number(value);
//     if (isNaN(num) || num < 0 || !Number.isInteger(num)) return 'Bathrooms must be a non-negative integer';
//     if (num > 50) return 'Bathrooms value seems unrealistic';
//     return null;
//   },

//   kitchens: (value) => {
//     if (!value && value !== 0) return null;
//     const num = Number(value);
//     if (isNaN(num) || num < 0 || !Number.isInteger(num)) return 'Kitchens must be a non-negative integer';
//     if (num > 20) return 'Kitchens value seems unrealistic';
//     return null;
//   },

//   areaSize: (value) => {
//     if (!value && value !== 0) return null;
//     const num = Number(value);
//     if (isNaN(num) || num < 0) return 'Area size must be a non-negative number';
//     if (num > 1000000) return 'Area size seems unrealistic';
//     return null;
//   },

//   areaUnit: (value) => {
//     if (!value) return null;
//     if (!ALLOWED_AREA_UNITS.includes(value)) return `Area unit must be one of: ${ALLOWED_AREA_UNITS.join(', ')}`;
//     return null;
//   },

//   floors: (value) => {
//     if (!value && value !== 0) return null;
//     const num = Number(value);
//     if (isNaN(num) || num < 0 || !Number.isInteger(num)) return 'Floors must be a non-negative integer';
//     if (num > 200) return 'Floors value seems unrealistic';
//     return null;
//   },

//   yearBuilt: (value) => {
//     if (!value) return null;
//     const num = Number(value);
//     const currentYear = new Date().getFullYear();
//     if (isNaN(num) || num < 1800 || num > currentYear + 2) {
//       return `Year built must be between 1800 and ${currentYear + 2}`;
//     }
//     return null;
//   },

//   latitude: (value) => {
//     if (!value) return null;
//     const num = Number(value);
//     if (isNaN(num) || num < -MAX_COORDINATE || num > MAX_COORDINATE) {
//       return 'Invalid latitude value';
//     }
//     return null;
//   },

//   longitude: (value) => {
//     if (!value) return null;
//     const num = Number(value);
//     if (isNaN(num) || num < -MAX_COORDINATE || num > MAX_COORDINATE) {
//       return 'Invalid longitude value';
//     }
//     return null;
//   },

//   email: (value) => {
//     if (!value) return null;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(value)) return 'Invalid email format';
//     return null;
//   },

//   phone: (value) => {
//     if (!value) return null;
//     const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
//     if (!phoneRegex.test(value)) return 'Invalid phone number format';
//     return null;
//   },
// };

// // ==========================================
// // ✅ PARSE AND VALIDATE FORM DATA
// // ==========================================
// const parseAndValidateFormData = (formData, user) => {
//   const errors = [];
//   const data = {};

//   // Extract all fields
//   const fields = [
//     'title', 'description', 'price', 'priceType', 'currency',
//     'location', 'city', 'area', 'address', 'latitude', 'longitude',
//     'propertyType', 'bedrooms', 'bathrooms', 'kitchens',
//     'areaSize', 'areaUnit', 'floors', 'yearBuilt',
//     'isFeatured', 'isPublished',
//     'contactName', 'contactPhone', 'contactEmail',
//     'features', 'amenities'
//   ];

//   fields.forEach(field => {
//     data[field] = formData.get(field);
//   });

//   // Set defaults
//   data.priceType = data.priceType || 'sale';
//   data.currency = data.currency || 'PKR';
//   data.areaUnit = data.areaUnit || 'sqft';
//   data.bedrooms = data.bedrooms || 0;
//   data.bathrooms = data.bathrooms || 0;
//   data.kitchens = data.kitchens || 0;
//   data.areaSize = data.areaSize || 0;
//   data.floors = data.floors || 0;
//   data.isFeatured = data.isFeatured === 'true';
//   data.isPublished = data.isPublished !== 'false';
//   data.contactName = data.contactName || user.name;
//   data.contactPhone = data.contactPhone || user.phone || '';
//   data.contactEmail = data.contactEmail || user.email;

//   // ==========================================
//   // ✅ VALIDATE REQUIRED FIELDS
//   // ==========================================
//   const requiredFields = ['title', 'description', 'price', 'location', 'city', 'propertyType'];
  
//   requiredFields.forEach(field => {
//     const error = validators[field]?.(data[field]);
//     if (error) errors.push(error);
//   });

//   // ==========================================
//   // ✅ VALIDATE OPTIONAL FIELDS (if provided)
//   // ==========================================
//   const optionalFields = [
//     'priceType', 'currency', 'bedrooms', 'bathrooms', 'kitchens',
//     'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'latitude', 'longitude',
//     'contactEmail', 'contactPhone'
//   ];

//   optionalFields.forEach(field => {
//     if (data[field] !== null && data[field] !== undefined && data[field] !== '') {
//       const error = validators[field]?.(data[field]);
//       if (error) errors.push(error);
//     }
//   });

//   // ==========================================
//   // ✅ PARSE JSON FIELDS
//   // ==========================================
//   let features = [];
//   let amenities = [];

//   if (data.features) {
//     try {
//       const parsed = JSON.parse(data.features);
//       if (Array.isArray(parsed)) {
//         features = parsed.map(f => String(f).trim()).filter(f => f.length > 0 && f.length <= 50);
//       }
//     } catch (e) {
//       errors.push('Invalid features format. Expected JSON array.');
//     }
//   }

//   if (data.amenities) {
//     try {
//       const parsed = JSON.parse(data.amenities);
//       if (Array.isArray(parsed)) {
//         amenities = parsed.map(a => String(a).trim()).filter(a => a.length > 0 && a.length <= 50);
//       }
//     } catch (e) {
//       errors.push('Invalid amenities format. Expected JSON array.');
//     }
//   }

//   // Limit array sizes
//   if (features.length > 50) {
//     errors.push('Maximum 50 features allowed');
//     features = features.slice(0, 50);
//   }

//   if (amenities.length > 50) {
//     errors.push('Maximum 50 amenities allowed');
//     amenities = amenities.slice(0, 50);
//   }

//   return {
//     valid: errors.length === 0,
//     errors,
//     data: {
//       ...data,
//       features,
//       amenities,
//     }
//   };
// };

// // ==========================================
// // ✅ EXTRACT IMAGES FROM FORM DATA
// // ==========================================
// const extractImages = (formData) => {
//   let imageFiles = [];

//   // Method 1: Standard 'images' key with File
//   imageFiles = formData.getAll('images').filter(
//     (file) => file instanceof File && file.size > 0
//   );

//   // Method 2: Blob fallback
//   if (imageFiles.length === 0) {
//     imageFiles = formData.getAll('images').filter(
//       (file) => file instanceof Blob && file.size > 0
//     );
//   }

//   // Method 3: Search for image-like keys
//   if (imageFiles.length === 0) {
//     for (const [key, value] of formData.entries()) {
//       if (key.toLowerCase().includes('image') && value instanceof Blob && value.size > 0) {
//         imageFiles.push(value);
//       }
//     }
//   }

//   // Method 4: Last resort - any blob
//   if (imageFiles.length === 0) {
//     for (const [key, value] of formData.entries()) {
//       if (value instanceof Blob && value.size > 0) {
//         imageFiles.push(value);
//       }
//     }
//   }

//   return imageFiles;
// };

// // ==========================================
// // ✅ MAIN HANDLER
// // ==========================================
// const createProperty = async (request, context, user) => {
//   const startTime = Date.now();
//   const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

//   try {
//     // ==========================================
//     // ✅ STEP 1: REQUEST SIZE VALIDATION
//     // ==========================================
//     const sizeCheck = await validateRequestSize(request, 25);
//     if (!sizeCheck.valid) {
//       return NextResponse.json(
//         { success: false, message: sizeCheck.error },
//         { status: 413, headers: getSecurityHeaders() }
//       );
//     }

//     await connectDB();

//     // ==========================================
//     // ✅ STEP 2: PARSE FORM DATA
//     // ==========================================
//     let formData;
//     try {
//       formData = await request.formData();
//     } catch (error) {
//       securityLog('INVALID_FORM_DATA', {
//         requestId,
//         userId: user._id,
//         error: error.message,
//       });
//       return NextResponse.json(
//         { success: false, message: 'Invalid form data' },
//         { status: 400, headers: getSecurityHeaders() }
//       );
//     }

//     // ==========================================
//     // ✅ STEP 3: RATE LIMIT FOR UPLOADS
//     // ==========================================
//     const uploadRateCheck = uploadRateLimiter(request);
//     if (!uploadRateCheck.allowed) {
//       securityLog('UPLOAD_RATE_LIMITED', {
//         requestId,
//         userId: user._id,
//       });
//       const response = NextResponse.json(
//         { success: false, message: uploadRateCheck.message },
//         { status: 429, headers: getSecurityHeaders() }
//       );
//       response.headers.set('Retry-After', String(uploadRateCheck.retryAfter));
//       return response;
//     }

//     // ==========================================
//     // ✅ STEP 4: VALIDATE TEXT INPUTS
//     // ==========================================
//     const validation = parseAndValidateFormData(formData, user);
    
//     if (!validation.valid) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Validation failed',
//           errors: validation.errors 
//         },
//         { status: 400, headers: getSecurityHeaders() }
//       );
//     }

//     const data = validation.data;

//     // ==========================================
//     // ✅ STEP 5: EXTRACT AND VALIDATE IMAGES
//     // ==========================================
//     const imageFiles = extractImages(formData);
//     const fileValidation = validateFiles(imageFiles);

//     if (!fileValidation.valid) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Image validation failed',
//           errors: fileValidation.errors 
//         },
//         { status: 400, headers: getSecurityHeaders() }
//       );
//     }

//     // ==========================================
//     // ✅ STEP 6: SANITIZE ALL INPUTS
//     // ==========================================
//     const sanitizedData = {
//       title: sanitizeInput(data.title),
//       description: sanitizeInput(data.description),
//       price: Number(sanitizeInput(data.price)),
//       priceType: sanitizeInput(data.priceType),
//       currency: sanitizeInput(data.currency),
//       location: sanitizeInput(data.location),
//       city: sanitizeInput(data.city),
//       area: sanitizeInput(data.area || ''),
//       address: sanitizeInput(data.address || ''),
//       latitude: data.latitude ? Number(data.latitude) : null,
//       longitude: data.longitude ? Number(data.longitude) : null,
//       propertyType: sanitizeInput(data.propertyType).toLowerCase(),
//       bedrooms: Number(data.bedrooms),
//       bathrooms: Number(data.bathrooms),
//       kitchens: Number(data.kitchens),
//       areaSize: Number(data.areaSize),
//       areaUnit: sanitizeInput(data.areaUnit),
//       floors: Number(data.floors),
//       yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : null,
//       features: sanitizeInput(data.features),
//       amenities: sanitizeInput(data.amenities),
//       isFeatured: data.isFeatured,
//       isPublished: data.isPublished,
//       contactName: sanitizeInput(data.contactName),
//       contactPhone: sanitizeInput(data.contactPhone),
//       contactEmail: sanitizeInput(data.contactEmail),
//       addedBy: user._id,
//     };

//     // ==========================================
//     // ✅ STEP 7: UPLOAD IMAGES TO CLOUDINARY
//     // ==========================================
//     let uploadedImages = [];
//     try {
//       uploadedImages = await uploadMultipleImages(imageFiles, 'properties', {
//         maxWidth: 1920,
//         maxHeight: 1080,
//         quality: 80,
//       });
//     } catch (error) {
//       console.error('Cloudinary Upload Error:', error);
//       securityLog('IMAGE_UPLOAD_FAILED', {
//         requestId,
//         userId: user._id,
//         error: error.message,
//       });
//       return NextResponse.json(
//         { success: false, message: 'Failed to upload images. Please try again.' },
//         { status: 500, headers: getSecurityHeaders() }
//       );
//     }

//     const thumbnail = uploadedImages.length > 0 ? uploadedImages[0].url : '';

//     // ==========================================
//     // ✅ STEP 8: CREATE PROPERTY WITH RETRY
//     // ==========================================
//     const newProperty = {
//       ...sanitizedData,
//       images: uploadedImages,
//       thumbnail,
//     };

//     let property;
//     let codeAttempts = 0;

//     while (codeAttempts < MAX_CODE_GENERATION_ATTEMPTS) {
//       try {
//         newProperty.propertyCode = await generatePropertyCode();
//         property = await Property.create(newProperty);
//         break;
//       } catch (error) {
//         if (error.code === 11000 && error.keyPattern?.propertyCode) {
//           codeAttempts++;
//           if (codeAttempts >= MAX_CODE_GENERATION_ATTEMPTS) {
//             throw new ApiError(500, 'Failed to generate unique property code');
//           }
//         } else {
//           throw error;
//         }
//       }
//     }

//     await property.populate('addedBy', 'name email phone avatar');

//     // ==========================================
//     // ✅ STEP 9: SECURITY LOG (SUCCESS)
//     // ==========================================
//     securityLog('PROPERTY_CREATED', {
//       requestId,
//       userId: user._id,
//       propertyId: property._id,
//       propertyCode: property.propertyCode,
//       imageCount: uploadedImages.length,
//       duration: Date.now() - startTime,
//     });

//     // ==========================================
//     // ✅ STEP 10: BUILD SAFE RESPONSE
//     // ==========================================
//     const propertyObject = property.toObject();

//     const response = {
//       success: true,
//       message: 'Property created successfully',
//       data: {
//         _id: propertyObject._id,
//         propertyCode: propertyObject.propertyCode,
//         title: propertyObject.title,
//         description: propertyObject.description,
//         price: propertyObject.price,
//         priceType: propertyObject.priceType,
//         currency: propertyObject.currency,
//         location: propertyObject.location,
//         city: propertyObject.city,
//         area: propertyObject.area,
//         address: propertyObject.address,
//         coordinates: {
//           latitude: propertyObject.latitude,
//           longitude: propertyObject.longitude,
//         },
//         propertyType: propertyObject.propertyType,
//         bedrooms: propertyObject.bedrooms,
//         bathrooms: propertyObject.bathrooms,
//         kitchens: propertyObject.kitchens,
//         areaSize: propertyObject.areaSize,
//         areaUnit: propertyObject.areaUnit,
//         floors: propertyObject.floors,
//         yearBuilt: propertyObject.yearBuilt,
//         features: propertyObject.features,
//         amenities: propertyObject.amenities,
//         images: propertyObject.images,
//         thumbnail: propertyObject.thumbnail,
//         isFeatured: propertyObject.isFeatured,
//         isPublished: propertyObject.isPublished,
//         contact: {
//           name: propertyObject.contactName,
//           phone: propertyObject.contactPhone,
//           email: propertyObject.contactEmail,
//         },
//         addedBy: {
//           _id: propertyObject.addedBy?._id,
//           name: propertyObject.addedBy?.name,
//           email: propertyObject.addedBy?.email,
//           phone: propertyObject.addedBy?.phone,
//           avatar: propertyObject.addedBy?.avatar,
//         },
//         createdAt: propertyObject.createdAt,
//         updatedAt: propertyObject.updatedAt,
//       },
//     };

//     return NextResponse.json(response, { 
//       status: 201,
//       headers: {
//         ...getSecurityHeaders(),
//         'X-Request-Id': requestId,
//         'X-Response-Time': `${Date.now() - startTime}ms`,
//       }
//     });

//   } catch (error) {
//     const duration = Date.now() - startTime;
    
//     // Security log for errors
//     securityLog('PROPERTY_CREATE_ERROR', {
//       requestId,
//       userId: user._id,
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
//       duration,
//     });

//     // Determine status code
//     let statusCode = 500;
//     let message = 'Internal Server Error';

//     if (error instanceof ApiError) {
//       statusCode = error.statusCode;
//       message = error.message;
//     } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
//       if (error.code === 11000) {
//         statusCode = 409;
//         message = 'Duplicate entry detected';
//       }
//     } else if (error.name === 'ValidationError') {
//       statusCode = 400;
//       message = 'Data validation failed';
//     }

//     // Production mein detailed error mat dikhao
//     const errorResponse = {
//       success: false,
//       message,
//       ...(process.env.NODE_ENV === 'development' && {
//         error: {
//           name: error.name,
//           message: error.message,
//           stack: error.stack,
//         }
//       }),
//     };

//     return NextResponse.json(errorResponse, { 
//       status: statusCode,
//       headers: {
//         ...getSecurityHeaders(),
//         'X-Request-Id': requestId,
//       }
//     });
//   }
// };

// // ==========================================
// // ✅ EXPORT WITH ADMIN AUTH + RATE LIMITING
// // ==========================================
// export const POST = withAdminAuth(createProperty, {
//   windowMs: 15 * 60 * 1000,    // 15 minutes
//   maxRequests: 20,              // 20 properties per 15 minutes
//   message: 'Property creation limit reached. Please try again after 15 minutes.',
// });

// // ==========================================
// // ✅ BLOCK OTHER METHODS
// // ==========================================
// export const GET = () => {
//   return NextResponse.json(
//     { success: false, message: 'Method not allowed' },
//     { status: 405, headers: getSecurityHeaders() }
//   );
// };

// export const PUT = () => {
//   return NextResponse.json(
//     { success: false, message: 'Method not allowed' },
//     { status: 405, headers: getSecurityHeaders() }
//   );
// };

// export const DELETE = () => {
//   return NextResponse.json(
//     { success: false, message: 'Method not allowed' },
//     { status: 405, headers: getSecurityHeaders() }
//   );
// };

// export const PATCH = () => {
//   return NextResponse.json(
//     { success: false, message: 'Method not allowed' },
//     { status: 405, headers: getSecurityHeaders() }
//   );
// };








import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Property from '@/backend/models/property';
import { withAdminAuth } from '@/backend/middleware/auth';
import { uploadMultipleImages } from '@/backend/lib/cloudinary';
import ApiError from '@/backend/utils/apierror';
import { 
  sanitizeInput, 
  validateFiles, 
  getSecurityHeaders, 
  validateRequestSize,
  securityLog 
} from '@/backend/lib/security';
import { strictRateLimiter, uploadRateLimiter } from '@/backend/lib/rateLimiter';

// ==========================================
// ✅ CONSTANTS
// ==========================================
const PROPERTY_CODE_PREFIX = 'PROP';
const PROPERTY_CODE_LENGTH = 6;
const MAX_CODE_GENERATION_ATTEMPTS = 3;

const ALLOWED_PROPERTY_TYPES = [
  'house', 'apartment', 'villa', 'penthouse', 
  'plot', 'commercial', 'office', 'shop', 
  'warehouse', 'farmhouse', 'flat', 'studio'
];

const ALLOWED_PRICE_TYPES = ['sale', 'rent'];
const ALLOWED_CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'AED'];
const ALLOWED_AREA_UNITS = ['sqft', 'sqm', 'marla', 'kanal', 'acre'];

const MAX_IMAGES = 10;
const MIN_TITLE_LENGTH = 5;
const MAX_TITLE_LENGTH = 150;
const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_PRICE = 999999999999;
const MAX_COORDINATE = 180;
const MAX_PROPERTY_CODE_LENGTH = 30;

// ==========================================
// ✅ UNIQUE PROPERTY CODE GENERATOR (fallback when not provided)
// ==========================================
const generatePropertyCode = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let attempts = 0;

  while (attempts < MAX_CODE_GENERATION_ATTEMPTS) {
    let code = PROPERTY_CODE_PREFIX + '-';
    for (let i = 0; i < PROPERTY_CODE_LENGTH; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const exists = await Property.findOne({ propertyCode: code }).lean();
    if (!exists) return code;
    attempts++;
  }

  const timestamp = Date.now().toString(36).toUpperCase();
  return `${PROPERTY_CODE_PREFIX}-${timestamp.slice(-6)}`;
};

// ==========================================
// ✅ INPUT VALIDATORS
// ==========================================
const validators = {
  title: (value) => {
    if (!value || typeof value !== 'string') return 'Title is required';
    const trimmed = value.trim();
    if (trimmed.length < MIN_TITLE_LENGTH) return `Title must be at least ${MIN_TITLE_LENGTH} characters`;
    if (trimmed.length > MAX_TITLE_LENGTH) return `Title must not exceed ${MAX_TITLE_LENGTH} characters`;
    return null;
  },

  description: (value) => {
    if (!value || typeof value !== 'string') return 'Description is required';
    const trimmed = value.trim();
    if (trimmed.length < MIN_DESCRIPTION_LENGTH) return `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`;
    if (trimmed.length > MAX_DESCRIPTION_LENGTH) return `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`;
    return null;
  },

  price: (value) => {
    if (!value) return 'Price is required';
    const num = Number(value);
    if (isNaN(num) || num <= 0) return 'Price must be a positive number';
    if (num > MAX_PRICE) return 'Price exceeds maximum limit';
    return null;
  },

  priceType: (value) => {
    if (!value) return null;
    if (!ALLOWED_PRICE_TYPES.includes(value)) return `Price type must be one of: ${ALLOWED_PRICE_TYPES.join(', ')}`;
    return null;
  },

  currency: (value) => {
    if (!value) return null;
    if (!ALLOWED_CURRENCIES.includes(value)) return `Currency must be one of: ${ALLOWED_CURRENCIES.join(', ')}`;
    return null;
  },

  location: (value) => {
    if (!value || typeof value !== 'string') return 'Location is required';
    if (value.trim().length < 2) return 'Location is too short';
    if (value.trim().length > 200) return 'Location is too long';
    return null;
  },

  city: (value) => {
    if (!value || typeof value !== 'string') return 'City is required';
    if (value.trim().length < 2) return 'City is too short';
    if (value.trim().length > 100) return 'City is too long';
    return null;
  },

  propertyType: (value) => {
    if (!value || typeof value !== 'string') return 'Property type is required';
    if (!ALLOWED_PROPERTY_TYPES.includes(value.toLowerCase())) {
      return `Property type must be one of: ${ALLOWED_PROPERTY_TYPES.join(', ')}`;
    }
    return null;
  },

  propertyCode: (value) => {
    if (!value || typeof value !== 'string') return null; // Optional — will be auto-generated
    const trimmed = value.trim();
    if (trimmed.length === 0) return null; // Empty = auto-generate
    if (trimmed.length > MAX_PROPERTY_CODE_LENGTH) return `Property code must not exceed ${MAX_PROPERTY_CODE_LENGTH} characters`;
    // Only allow alphanumeric, hyphens, underscores
    if (!/^[A-Za-z0-9\-_]+$/.test(trimmed)) return 'Property code can only contain letters, numbers, hyphens, and underscores';
    return null;
  },

  bedrooms: (value) => {
    if (!value && value !== 0) return null;
    const num = Number(value);
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) return 'Bedrooms must be a non-negative integer';
    if (num > 50) return 'Bedrooms value seems unrealistic';
    return null;
  },

  bathrooms: (value) => {
    if (!value && value !== 0) return null;
    const num = Number(value);
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) return 'Bathrooms must be a non-negative integer';
    if (num > 50) return 'Bathrooms value seems unrealistic';
    return null;
  },

  kitchens: (value) => {
    if (!value && value !== 0) return null;
    const num = Number(value);
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) return 'Kitchens must be a non-negative integer';
    if (num > 20) return 'Kitchens value seems unrealistic';
    return null;
  },

  areaSize: (value) => {
    if (!value && value !== 0) return null;
    const num = Number(value);
    if (isNaN(num) || num < 0) return 'Area size must be a non-negative number';
    if (num > 1000000) return 'Area size seems unrealistic';
    return null;
  },

  areaUnit: (value) => {
    if (!value) return null;
    if (!ALLOWED_AREA_UNITS.includes(value)) return `Area unit must be one of: ${ALLOWED_AREA_UNITS.join(', ')}`;
    return null;
  },

  floors: (value) => {
    if (!value && value !== 0) return null;
    const num = Number(value);
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) return 'Floors must be a non-negative integer';
    if (num > 200) return 'Floors value seems unrealistic';
    return null;
  },

  yearBuilt: (value) => {
    if (!value) return null;
    const num = Number(value);
    const currentYear = new Date().getFullYear();
    if (isNaN(num) || num < 1800 || num > currentYear + 2) {
      return `Year built must be between 1800 and ${currentYear + 2}`;
    }
    return null;
  },

  latitude: (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num < -MAX_COORDINATE || num > MAX_COORDINATE) return 'Invalid latitude value';
    return null;
  },

  longitude: (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num < -MAX_COORDINATE || num > MAX_COORDINATE) return 'Invalid longitude value';
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
    if (!phoneRegex.test(value)) return 'Invalid phone number format';
    return null;
  },
};

// ==========================================
// ✅ PARSE AND VALIDATE FORM DATA
// ==========================================
const parseAndValidateFormData = (formData, user) => {
  const errors = [];
  const data = {};

  const fields = [
    'title', 'description', 'price', 'priceType', 'currency',
    'location', 'city', 'area', 'address', 'latitude', 'longitude',
    'propertyType', 'propertyCode', 'bedrooms', 'bathrooms', 'kitchens',
    'areaSize', 'areaUnit', 'floors', 'yearBuilt',
    'isFeatured', 'isPublished',
    'contactName', 'contactPhone', 'contactEmail',
    'features', 'amenities'
  ];

  fields.forEach(field => {
    data[field] = formData.get(field);
  });

  // Set defaults
  data.priceType = data.priceType || 'sale';
  data.currency = data.currency || 'PKR';
  data.areaUnit = data.areaUnit || 'sqft';
  data.bedrooms = data.bedrooms || 0;
  data.bathrooms = data.bathrooms || 0;
  data.kitchens = data.kitchens || 0;
  data.areaSize = data.areaSize || 0;
  data.floors = data.floors || 0;
  data.isFeatured = data.isFeatured === 'true';
  data.isPublished = data.isPublished !== 'false';
  data.contactName = data.contactName || user.name;
  data.contactPhone = data.contactPhone || user.phone || '';
  data.contactEmail = data.contactEmail || user.email;

  // ✅ VALIDATE REQUIRED FIELDS
  const requiredFields = ['title', 'description', 'price', 'location', 'city', 'propertyType'];
  
  requiredFields.forEach(field => {
    const error = validators[field]?.(data[field]);
    if (error) errors.push(error);
  });

  // ✅ VALIDATE OPTIONAL FIELDS (if provided)
  const optionalFields = [
    'priceType', 'currency', 'propertyCode', 'bedrooms', 'bathrooms', 'kitchens',
    'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'latitude', 'longitude',
    'contactEmail', 'contactPhone'
  ];

  optionalFields.forEach(field => {
    if (data[field] !== null && data[field] !== undefined && data[field] !== '') {
      const error = validators[field]?.(data[field]);
      if (error) errors.push(error);
    }
  });

  // ✅ PARSE JSON FIELDS
  let features = [];
  let amenities = [];

  if (data.features) {
    try {
      const parsed = JSON.parse(data.features);
      if (Array.isArray(parsed)) {
        features = parsed.map(f => String(f).trim()).filter(f => f.length > 0 && f.length <= 50);
      }
    } catch (e) {
      errors.push('Invalid features format. Expected JSON array.');
    }
  }

  if (data.amenities) {
    try {
      const parsed = JSON.parse(data.amenities);
      if (Array.isArray(parsed)) {
        amenities = parsed.map(a => String(a).trim()).filter(a => a.length > 0 && a.length <= 50);
      }
    } catch (e) {
      errors.push('Invalid amenities format. Expected JSON array.');
    }
  }

  if (features.length > 50) {
    errors.push('Maximum 50 features allowed');
    features = features.slice(0, 50);
  }

  if (amenities.length > 50) {
    errors.push('Maximum 50 amenities allowed');
    amenities = amenities.slice(0, 50);
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      ...data,
      features,
      amenities,
    }
  };
};

// ==========================================
// ✅ EXTRACT IMAGES FROM FORM DATA
// ==========================================
const extractImages = (formData) => {
  let imageFiles = [];

  imageFiles = formData.getAll('images').filter(
    (file) => file instanceof File && file.size > 0
  );

  if (imageFiles.length === 0) {
    imageFiles = formData.getAll('images').filter(
      (file) => file instanceof Blob && file.size > 0
    );
  }

  if (imageFiles.length === 0) {
    for (const [key, value] of formData.entries()) {
      if (key.toLowerCase().includes('image') && value instanceof Blob && value.size > 0) {
        imageFiles.push(value);
      }
    }
  }

  if (imageFiles.length === 0) {
    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob && value.size > 0) {
        imageFiles.push(value);
      }
    }
  }

  return imageFiles;
};

// ==========================================
// ✅ MAIN HANDLER
// ==========================================
const createProperty = async (request, context, user) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    // STEP 1: Request size validation
    const sizeCheck = await validateRequestSize(request, 25);
    if (!sizeCheck.valid) {
      return NextResponse.json(
        { success: false, message: sizeCheck.error },
        { status: 413, headers: getSecurityHeaders() }
      );
    }

    await connectDB();

    // STEP 2: Parse form data
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      securityLog('INVALID_FORM_DATA', { requestId, userId: user._id, error: error.message });
      return NextResponse.json(
        { success: false, message: 'Invalid form data' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // STEP 3: Rate limit
    const uploadRateCheck = uploadRateLimiter(request);
    if (!uploadRateCheck.allowed) {
      securityLog('UPLOAD_RATE_LIMITED', { requestId, userId: user._id });
      const response = NextResponse.json(
        { success: false, message: uploadRateCheck.message },
        { status: 429, headers: getSecurityHeaders() }
      );
      response.headers.set('Retry-After', String(uploadRateCheck.retryAfter));
      return response;
    }

    // STEP 4: Validate text inputs
    const validation = parseAndValidateFormData(formData, user);
    
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validation.errors },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const data = validation.data;

    // STEP 5: Extract and validate images
    const imageFiles = extractImages(formData);
    const fileValidation = validateFiles(imageFiles);

    if (!fileValidation.valid) {
      return NextResponse.json(
        { success: false, message: 'Image validation failed', errors: fileValidation.errors },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // STEP 6: Sanitize all inputs
    const sanitizedData = {
      title: sanitizeInput(data.title),
      description: sanitizeInput(data.description),
      price: Number(sanitizeInput(data.price)),
      priceType: sanitizeInput(data.priceType),
      currency: sanitizeInput(data.currency),
      location: sanitizeInput(data.location),
      city: sanitizeInput(data.city),
      area: sanitizeInput(data.area || ''),
      address: sanitizeInput(data.address || ''),
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      propertyType: sanitizeInput(data.propertyType).toLowerCase(),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      kitchens: Number(data.kitchens),
      areaSize: Number(data.areaSize),
      areaUnit: sanitizeInput(data.areaUnit),
      floors: Number(data.floors),
      yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : null,
      features: sanitizeInput(data.features),
      amenities: sanitizeInput(data.amenities),
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
      contactName: sanitizeInput(data.contactName),
      contactPhone: sanitizeInput(data.contactPhone),
      contactEmail: sanitizeInput(data.contactEmail),
      addedBy: user._id,
    };

    // STEP 7: Upload images to Cloudinary
    let uploadedImages = [];
    try {
      uploadedImages = await uploadMultipleImages(imageFiles, 'properties', {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 80,
      });
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      securityLog('IMAGE_UPLOAD_FAILED', { requestId, userId: user._id, error: error.message });
      return NextResponse.json(
        { success: false, message: 'Failed to upload images. Please try again.' },
        { status: 500, headers: getSecurityHeaders() }
      );
    }

    const thumbnail = uploadedImages.length > 0 ? uploadedImages[0].url : '';

    // STEP 8: ✅ PROPERTY CODE — use user-provided or auto-generate
    let finalPropertyCode = '';
    const userProvidedCode = data.propertyCode?.toString().trim() || '';

    if (userProvidedCode) {
      // Check if user-provided code is unique
      const codeExists = await Property.findOne({ propertyCode: userProvidedCode }).lean();
      if (codeExists) {
        return NextResponse.json(
          { success: false, message: `Property code "${userProvidedCode}" is already taken. Please use a different code.` },
          { status: 409, headers: getSecurityHeaders() }
        );
      }
      finalPropertyCode = userProvidedCode;
    } else {
      // Auto-generate
      finalPropertyCode = await generatePropertyCode();
    }

    // STEP 9: Create property
    const newProperty = {
      ...sanitizedData,
      propertyCode: finalPropertyCode,
      images: uploadedImages,
      thumbnail,
    };

    let property;
    try {
      property = await Property.create(newProperty);
    } catch (error) {
      // Race condition — code was taken between check and create
      if (error.code === 11000 && error.keyPattern?.propertyCode) {
        // If it was user-provided, tell them. If auto-generated, retry once.
        if (userProvidedCode) {
          return NextResponse.json(
            { success: false, message: `Property code "${userProvidedCode}" is already taken. Please use a different code.` },
            { status: 409, headers: getSecurityHeaders() }
          );
        }
        // Retry with new auto-generated code
        newProperty.propertyCode = await generatePropertyCode();
        property = await Property.create(newProperty);
      } else {
        throw error;
      }
    }

    await property.populate('addedBy', 'name email phone avatar');

    // STEP 10: Security log
    securityLog('PROPERTY_CREATED', {
      requestId,
      userId: user._id,
      propertyId: property._id,
      propertyCode: property.propertyCode,
      codeSource: userProvidedCode ? 'manual' : 'auto',
      imageCount: uploadedImages.length,
      duration: Date.now() - startTime,
    });

    // STEP 11: Build response
    const propertyObject = property.toObject();

    const response = {
      success: true,
      message: 'Property created successfully',
      data: {
        _id: propertyObject._id,
        propertyCode: propertyObject.propertyCode,
        title: propertyObject.title,
        description: propertyObject.description,
        price: propertyObject.price,
        priceType: propertyObject.priceType,
        currency: propertyObject.currency,
        location: propertyObject.location,
        city: propertyObject.city,
        area: propertyObject.area,
        address: propertyObject.address,
        coordinates: {
          latitude: propertyObject.latitude,
          longitude: propertyObject.longitude,
        },
        propertyType: propertyObject.propertyType,
        bedrooms: propertyObject.bedrooms,
        bathrooms: propertyObject.bathrooms,
        kitchens: propertyObject.kitchens,
        areaSize: propertyObject.areaSize,
        areaUnit: propertyObject.areaUnit,
        floors: propertyObject.floors,
        yearBuilt: propertyObject.yearBuilt,
        features: propertyObject.features,
        amenities: propertyObject.amenities,
        images: propertyObject.images,
        thumbnail: propertyObject.thumbnail,
        isFeatured: propertyObject.isFeatured,
        isPublished: propertyObject.isPublished,
        contact: {
          name: propertyObject.contactName,
          phone: propertyObject.contactPhone,
          email: propertyObject.contactEmail,
        },
        addedBy: {
          _id: propertyObject.addedBy?._id,
          name: propertyObject.addedBy?.name,
          email: propertyObject.addedBy?.email,
          phone: propertyObject.addedBy?.phone,
          avatar: propertyObject.addedBy?.avatar,
        },
        createdAt: propertyObject.createdAt,
        updatedAt: propertyObject.updatedAt,
      },
    };

    return NextResponse.json(response, { 
      status: 201,
      headers: {
        ...getSecurityHeaders(),
        'X-Request-Id': requestId,
        'X-Response-Time': `${Date.now() - startTime}ms`,
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    
    securityLog('PROPERTY_CREATE_ERROR', {
      requestId,
      userId: user._id,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      duration,
    });

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (error instanceof ApiError) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      if (error.code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry detected';
      }
    } else if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Data validation failed';
    }

    const errorResponse = {
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        error: { name: error.name, message: error.message, stack: error.stack }
      }),
    };

    return NextResponse.json(errorResponse, { 
      status: statusCode,
      headers: { ...getSecurityHeaders(), 'X-Request-Id': requestId }
    });
  }
};

// ==========================================
// ✅ EXPORT WITH ADMIN AUTH + RATE LIMITING
// ==========================================
export const POST = withAdminAuth(createProperty, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: 'Property creation limit reached. Please try again after 15 minutes.',
});

export const GET = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405, headers: getSecurityHeaders() }
  );
};

export const PUT = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405, headers: getSecurityHeaders() }
  );
};

export const DELETE = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405, headers: getSecurityHeaders() }
  );
};

export const PATCH = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405, headers: getSecurityHeaders() }
  );
};