// import { NextResponse } from 'next/server';
// import connectDB from '@/backend/lib/db';
// import Property from '@/backend/models/property';
// import { withAuth } from '@/backend/middleware/auth';
// import { uploadMultipleImages, deleteImage } from '@/backend/lib/cloudinary';
// import ApiError from '@/backend/utils/apierror';

// const patchProperty = async (request, context, user) => {
//   try {
//     await connectDB();

//     if (user.role !== 'admin') {
//       throw new ApiError(403, 'Access denied. Only admin can update properties.');
//     }

//     const { id } = await context.params;
//     if (!id) throw new ApiError(400, 'Property ID is required');

//     const existingProperty = await Property.findById(id);
//     if (!existingProperty) throw new ApiError(404, 'Property not found');

//     const contentType = request.headers.get('content-type') || '';
//     let updateData = {};
//     let newImageFiles = [];
//     let imagesToRemove = [];

//     // ============================================
//     // 1. DATA EXTRACT
//     // ============================================
//     if (contentType.includes('multipart/form-data')) {
//       const formData = await request.formData();

//       const textFields = [
//         'title', 'description', 'price', 'priceType', 'currency',
//         'location', 'city', 'area', 'address', 'latitude', 'longitude',
//         'propertyType', 'bedrooms', 'bathrooms', 'kitchens',
//         'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
//         'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail'
//       ];

//       textFields.forEach(field => {
//         const val = formData.get(field);
//         if (val !== null && val !== undefined && val !== '') {
//           if (['price', 'bedrooms', 'bathrooms', 'kitchens', 'areaSize', 'floors', 'yearBuilt'].includes(field)) {
//             updateData[field] = Number(val);
//           } else if (field === 'isFeatured' || field === 'isPublished') {
//             updateData[field] = val === 'true' || val === true;
//           } else if (field === 'latitude' || field === 'longitude') {
//             updateData[field] = Number(val) || null;
//           } else {
//             updateData[field] = String(val).trim();
//           }
//         }
//       });

//       for (const field of ['features', 'amenities']) {
//         const raw = formData.get(field);
//         if (raw) {
//           try {
//             const parsed = JSON.parse(raw);
//             if (Array.isArray(parsed)) updateData[field] = parsed;
//           } catch (e) { }
//         }
//       }

//       const removeRaw = formData.get('removeImages');
//       if (removeRaw && typeof removeRaw === 'string' && removeRaw.trim() !== '' && removeRaw !== 'undefined') {
//         try {
//           const parsed = JSON.parse(removeRaw);
//           if (Array.isArray(parsed)) {
//             imagesToRemove = parsed.filter(x => x && typeof x === 'string' && x.trim() !== '');
//           } else if (typeof parsed === 'string' && parsed.trim()) {
//             imagesToRemove = [parsed.trim()];
//           }
//         } catch (e) {
//           const cleaned = removeRaw.replace(/[\[\]'"`]/g, '').trim();
//           if (cleaned.includes(',')) {
//             imagesToRemove = cleaned.split(',').map(s => s.trim()).filter(Boolean);
//           } else if (cleaned) {
//             imagesToRemove = [cleaned];
//           }
//         }
//       }

//       const allImages = formData.getAll('images');
//       newImageFiles = allImages.filter(file => {
//         if (file instanceof File && file.size > 0) return true;
//         if (file && typeof file === 'object' && file.name && file.size > 0 && file.type?.startsWith('image/')) return true;
//         return false;
//       });

//     } else {
//       const body = await request.json();
//       const allowedFields = [
//         'title', 'description', 'price', 'priceType', 'currency',
//         'location', 'city', 'area', 'address', 'latitude', 'longitude',
//         'propertyType', 'bedrooms', 'bathrooms', 'kitchens',
//         'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
//         'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail',
//         'features', 'amenities'
//       ];

//       allowedFields.forEach(field => {
//         if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
//           updateData[field] = body[field];
//         }
//       });

//       if (body.removeImages) {
//         if (Array.isArray(body.removeImages)) {
//           imagesToRemove = body.removeImages.filter(x => x && typeof x === 'string');
//         } else if (typeof body.removeImages === 'string') {
//           imagesToRemove = [body.removeImages];
//         }
//       }
//     }

//     // ============================================
//     // 2. IMAGE LOGIC (SAME POSITION REPLACE)
//     // ============================================
//     let currentImages = JSON.parse(JSON.stringify(existingProperty.images || []));
//     let imageModified = false;
//     let removedIndexes = [];

//     if (imagesToRemove.length > 0) {
//       const foundMatches = [];
      
//       for (const removeId of imagesToRemove) {
//         const matchIndex = currentImages.findIndex(img => {
//           const dbId = img.public_id || '';
//           return dbId === removeId || dbId.endsWith(removeId) || removeId.endsWith(dbId) || (img.url && img.url.includes(removeId));
//         });

//         if (matchIndex !== -1) {
//           foundMatches.push({ index: matchIndex, public_id: currentImages[matchIndex].public_id });
//         }
//       }

//       foundMatches.sort((a, b) => b.index - a.index);

//       for (const match of foundMatches) {
//         try {
//           await deleteImage(match.public_id);
//         } catch (err) { }
//         currentImages.splice(match.index, 1);
//         removedIndexes.push(match.index);
//         imageModified = true;
//       }

//       removedIndexes.sort((a, b) => a - b);
//     }

//     let uploadedImages = [];
    
//     if (newImageFiles.length > 0) {
//       if (currentImages.length + newImageFiles.length > 10) {
//         throw new ApiError(400, `Maximum 10 images allowed. Current: ${currentImages.length}, Adding: ${newImageFiles.length}`);
//       }

//       uploadedImages = await uploadMultipleImages(newImageFiles, 'properties', {
//         maxWidth: 1920,
//         maxHeight: 1080,
//         quality: 80,
//       });
//     }

//     if (uploadedImages.length > 0) {
//       uploadedImages.forEach((img, i) => {
//         if (i < removedIndexes.length) {
//           currentImages.splice(removedIndexes[i], 0, img);
//         } else {
//           currentImages.push(img);
//         }
//       });
//       imageModified = true;
//     }

//     if (imageModified) {
//       updateData.images = currentImages;
//       updateData.thumbnail = currentImages.length > 0 ? currentImages[0].url : '';
//     }

//     // ============================================
//     // 3. DATABASE UPDATE
//     // ============================================
//     if (Object.keys(updateData).length === 0) {
//       throw new ApiError(400, 'No valid fields provided to update');
//     }

//     updateData.updatedBy = user._id;

//     const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
//       new : true,
//       runValidators: true,
//     });

//     if (!updatedProperty) throw new ApiError(404, 'Property not found after update');

//     await updatedProperty.populate('addedBy', 'name email phone avatar');

//     // ============================================
//     // 4. RESPONSE
//     // ============================================
//     const obj = updatedProperty.toObject();
    
//     return NextResponse.json({
//       success: true,
//       message: 'Property updated successfully',
//       updatedFields: Object.keys(updateData),
//       data: {
//         _id: obj._id,
//         propertyCode: obj.propertyCode,
//         title: obj.title,
//         description: obj.description,
//         price: obj.price,
//         priceType: obj.priceType,
//         currency: obj.currency,
//         location: obj.location,
//         city: obj.city,
//         area: obj.area,
//         address: obj.address,
//         coordinates: { latitude: obj.latitude, longitude: obj.longitude },
//         propertyType: obj.propertyType,
//         bedrooms: obj.bedrooms,
//         bathrooms: obj.bathrooms,
//         kitchens: obj.kitchens,
//         areaSize: obj.areaSize,
//         areaUnit: obj.areaUnit,
//         floors: obj.floors,
//         yearBuilt: obj.yearBuilt,
//         features: obj.features,
//         amenities: obj.amenities,
//         images: obj.images,
//         thumbnail: obj.thumbnail,
//         status: obj.status,
//         isFeatured: obj.isFeatured,
//         isPublished: obj.isPublished,
//         contact: {
//           name: obj.contactName,
//           phone: obj.contactPhone,
//           email: obj.contactEmail,
//         },
//         addedBy: obj.addedBy,
//         createdAt: obj.createdAt,
//         updatedAt: obj.updatedAt,
//       },
//     }, { status: 200 });

//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     return NextResponse.json(
//       { success: false, message: error.message || 'Internal Server Error' },
//       { status: statusCode }
//     );
//   }
// };

// export const PATCH = withAuth(patchProperty);

















// import { NextResponse } from 'next/server';
// import connectDB from '@/backend/lib/db';
// import Property from '@/backend/models/property';
// import { withAdminAuth } from '@/backend/middleware/auth';
// import { uploadMultipleImages, deleteImage } from '@/backend/lib/cloudinary';
// import ApiError from '@/backend/utils/apierror';
// import { getSecurityHeaders, securityLog, sanitizeInput, validateFiles } from '@/backend/lib/security';

// // ==========================================
// // ✅ MONGODB OBJECTID VALIDATOR
// // ==========================================
// const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// // ==========================================
// // ✅ MAIN HANDLER
// // ==========================================
// const patchProperty = async (request, context, user) => {
//   const startTime = Date.now();
//   const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

//   try {
//     await connectDB();

//     // ❌ REMOVED: Manual admin check (withAdminAuth handles it now)

//     const { id } = await context.params;
    
//     // ==========================================
//     // 1. STRICT ID VALIDATION
//     // ==========================================
//     if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
//       securityLog('INVALID_PROPERTY_ID_PATCH', { requestId, providedId: id });
//       throw new ApiError(400, 'Invalid Property ID format');
//     }

//     // ==========================================
//     // 2. FETCH EXISTING PROPERTY (Only images needed initially)
//     // ==========================================
//     const existingProperty = await Property.findById(id).select('images').lean();
//     if (!existingProperty) throw new ApiError(404, 'Property not found');

//     const contentType = request.headers.get('content-type') || '';
//     let updateData = {};
//     let newImageFiles = [];
//     let imagesToRemove = [];

//     // ============================================
//     // 3. DATA EXTRACT & SANITIZE
//     // ============================================
//     if (contentType.includes('multipart/form-data')) {
//       const formData = await request.formData();

//       const textFields = [
//         'title', 'description', 'price', 'priceType', 'currency',
//         'location', 'city', 'area', 'address', 'latitude', 'longitude',
//         'propertyType', 'bedrooms', 'bathrooms', 'kitchens',
//         'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
//         'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail'
//       ];

//       textFields.forEach(field => {
//         const val = formData.get(field);
//         if (val !== null && val !== undefined && val !== '') {
//           if (['price', 'bedrooms', 'bathrooms', 'kitchens', 'areaSize', 'floors', 'yearBuilt'].includes(field)) {
//             updateData[field] = Number(val);
//           } else if (field === 'isFeatured' || field === 'isPublished') {
//             updateData[field] = val === 'true' || val === true;
//           } else if (field === 'latitude' || field === 'longitude') {
//             updateData[field] = Number(val) || null;
//           } else {
//             // ✅ SECURITY: Sanitize text inputs
//             updateData[field] = sanitizeInput(String(val).trim());
//           }
//         }
//       });

//       for (const field of ['features', 'amenities']) {
//         const raw = formData.get(field);
//         if (raw) {
//           try {
//             const parsed = JSON.parse(raw);
//             if (Array.isArray(parsed)) updateData[field] = sanitizeInput(parsed); // ✅ Sanitize Array
//           } catch (e) { }
//         }
//       }

//       const removeRaw = formData.get('removeImages');
//       if (removeRaw && typeof removeRaw === 'string' && removeRaw.trim() !== '' && removeRaw !== 'undefined') {
//         try {
//           const parsed = JSON.parse(removeRaw);
//           if (Array.isArray(parsed)) {
//             imagesToRemove = parsed.filter(x => x && typeof x === 'string' && x.trim() !== '');
//           } else if (typeof parsed === 'string' && parsed.trim()) {
//             imagesToRemove = [parsed.trim()];
//           }
//         } catch (e) {
//           const cleaned = removeRaw.replace(/[\[\]'"`]/g, '').trim();
//           if (cleaned.includes(',')) {
//             imagesToRemove = cleaned.split(',').map(s => s.trim()).filter(Boolean);
//           } else if (cleaned) {
//             imagesToRemove = [cleaned];
//           }
//         }
//       }

//       const allImages = formData.getAll('images');
//       newImageFiles = allImages.filter(file => {
//         if (file instanceof File && file.size > 0) return true;
//         if (file && typeof file === 'object' && file.name && file.size > 0 && file.type?.startsWith('image/')) return true;
//         return false;
//       });

//     } else {
//       const body = await request.json();
//       const allowedFields = [
//         'title', 'description', 'price', 'priceType', 'currency',
//         'location', 'city', 'area', 'address', 'latitude', 'longitude',
//         'propertyType', 'bedrooms', 'bathrooms', 'kitchens',
//         'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
//         'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail',
//         'features', 'amenities'
//       ];

//       allowedFields.forEach(field => {
//         if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
//           // ✅ SECURITY: Sanitize strings, leave numbers/booleans for Mongoose to validate
//           if (typeof body[field] === 'string') {
//             updateData[field] = sanitizeInput(body[field]);
//           } else if (Array.isArray(body[field])) {
//             updateData[field] = sanitizeInput(body[field]);
//           } else {
//             updateData[field] = body[field];
//           }
//         }
//       });

//       if (body.removeImages) {
//         if (Array.isArray(body.removeImages)) {
//           imagesToRemove = body.removeImages.filter(x => x && typeof x === 'string');
//         } else if (typeof body.removeImages === 'string') {
//           imagesToRemove = [body.removeImages];
//         }
//       }
//     }

//     // ============================================
//     // 4. NEW FILE VALIDATION (Before uploading)
//     // ============================================
//     if (newImageFiles.length > 0) {
//       const fileValidation = validateFiles(newImageFiles);
//       if (!fileValidation.valid) {
//         throw new ApiError(400, fileValidation.errors.join(' '));
//       }
//     }

//     // ============================================
//     // 5. IMAGE LOGIC (SAME POSITION REPLACE) - UNTOUCHED!
//     // ============================================
//     let currentImages = JSON.parse(JSON.stringify(existingProperty.images || []));
//     let imageModified = false;
//     let removedIndexes = [];

//     if (imagesToRemove.length > 0) {
//       const foundMatches = [];
      
//       for (const removeId of imagesToRemove) {
//         const matchIndex = currentImages.findIndex(img => {
//           const dbId = img.public_id || '';
//           return dbId === removeId || dbId.endsWith(removeId) || removeId.endsWith(dbId) || (img.url && img.url.includes(removeId));
//         });

//         if (matchIndex !== -1) {
//           foundMatches.push({ index: matchIndex, public_id: currentImages[matchIndex].public_id });
//         }
//       }

//       foundMatches.sort((a, b) => b.index - a.index);

//       for (const match of foundMatches) {
//         try {
//           await deleteImage(match.public_id);
//         } catch (err) { }
//         currentImages.splice(match.index, 1);
//         removedIndexes.push(match.index);
//         imageModified = true;
//       }

//       removedIndexes.sort((a, b) => a - b);
//     }

//     let uploadedImages = [];
    
//     if (newImageFiles.length > 0) {
//       if (currentImages.length + newImageFiles.length > 10) {
//         throw new ApiError(400, `Maximum 10 images allowed. Current: ${currentImages.length}, Adding: ${newImageFiles.length}`);
//       }

//       uploadedImages = await uploadMultipleImages(newImageFiles, 'properties', {
//         maxWidth: 1920,
//         maxHeight: 1080,
//         quality: 80,
//       });
//     }

//     if (uploadedImages.length > 0) {
//       uploadedImages.forEach((img, i) => {
//         if (i < removedIndexes.length) {
//           currentImages.splice(removedIndexes[i], 0, img);
//         } else {
//           currentImages.push(img);
//         }
//       });
//       imageModified = true;
//     }

//     if (imageModified) {
//       updateData.images = currentImages;
//       updateData.thumbnail = currentImages.length > 0 ? currentImages[0].url : '';
//     }

//     // ============================================
//     // 6. DATABASE UPDATE
//     // ============================================
//     if (Object.keys(updateData).length === 0) {
//       throw new ApiError(400, 'No valid fields provided to update');
//     }

//     updateData.updatedBy = user._id;

//     // Note: Cannot use .lean() here because runValidators and .populate() require Mongoose Document
//     const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
//       new : true,
//       runValidators: true,
//     });

//     if (!updatedProperty) throw new ApiError(404, 'Property not found after update');

//     await updatedProperty.populate('addedBy', 'name email phone avatar');

//     // ============================================
//     // 7. SECURITY AUDIT LOG
//     // ============================================
//     securityLog('PROPERTY_UPDATED', {
//       requestId,
//       adminId: user._id,
//       propertyId: id,
//       updatedFields: Object.keys(updateData),
//       imagesAdded: uploadedImages.length,
//       imagesRemoved: removedIndexes.length,
//       duration: Date.now() - startTime,
//     });

//     // ============================================
//     // 8. RESPONSE
//     // ============================================
//     const obj = updatedProperty.toObject();
    
//     return NextResponse.json({
//       success: true,
//       message: 'Property updated successfully',
//       updatedFields: Object.keys(updateData),
//       data: {
//         _id: obj._id,
//         propertyCode: obj.propertyCode,
//         title: obj.title,
//         description: obj.description,
//         price: obj.price,
//         priceType: obj.priceType,
//         currency: obj.currency,
//         location: obj.location,
//         city: obj.city,
//         area: obj.area,
//         address: obj.address,
//         coordinates: { latitude: obj.latitude, longitude: obj.longitude },
//         propertyType: obj.propertyType,
//         bedrooms: obj.bedrooms,
//         bathrooms: obj.bathrooms,
//         kitchens: obj.kitchens,
//         areaSize: obj.areaSize,
//         areaUnit: obj.areaUnit,
//         floors: obj.floors,
//         yearBuilt: obj.yearBuilt,
//         features: obj.features,
//         amenities: obj.amenities,
//         images: obj.images,
//         thumbnail: obj.thumbnail,
//         status: obj.status,
//         isFeatured: obj.isFeatured,
//         isPublished: obj.isPublished,
//         contact: {
//           name: obj.contactName,
//           phone: obj.contactPhone,
//           email: obj.contactEmail,
//         },
//         addedBy: obj.addedBy,
//         createdAt: obj.createdAt,
//         updatedAt: obj.updatedAt,
//       },
//     }, { 
//       status: 200,
//       headers: {
//         ...getSecurityHeaders(),
//         'Cache-Control': 'no-store', // Never cache dynamic updates
//         'X-Request-Id': requestId,
//         'X-Response-Time': `${Date.now() - startTime}ms`,
//       }
//     });

//   } catch (error) {
//     securityLog('PATCH_PROPERTY_ERROR', {
//       requestId,
//       userId: user?._id,
//       error: error.message,
//       duration: Date.now() - startTime,
//     });

//     const statusCode = error.statusCode || 500;
//     const message = (statusCode === 500 && process.env.NODE_ENV === 'production') 
//       ? 'Failed to update property' 
//       : error.message;
      
//     return NextResponse.json(
//       { success: false, message: message },
//       { 
//         status: statusCode,
//         headers: {
//           ...getSecurityHeaders(),
//           'Cache-Control': 'no-store',
//           'X-Request-Id': requestId,
//         }
//       }
//     );
//   }
// };

// // ==========================================
// // ✅ EXPORTS & METHOD BLOCKING
// // ==========================================
// export const PATCH = withAdminAuth(patchProperty, {
//   windowMs: 15 * 60 * 1000,
//   maxRequests: 30,
//   message: 'Too many update attempts. Please try again later.',
// });

// const methodNotAllowed = () => {
//   return NextResponse.json(
//     { success: false, message: 'Method not allowed on this endpoint' },
//     { status: 405, headers: { ...getSecurityHeaders(), 'Allow': 'PATCH' } }
//   );
// };

// export const GET = methodNotAllowed;
// export const POST = methodNotAllowed;
// export const PUT = methodNotAllowed;
// export const DELETE = methodNotAllowed;


// import { NextResponse } from 'next/server';
// import connectDB from '@/backend/lib/db';
// import Property from '@/backend/models/property';
// import { withAdminAuth } from '@/backend/middleware/auth';
// import { uploadMultipleImages, deleteImage } from '@/backend/lib/cloudinary';
// import ApiError from '@/backend/utils/apierror';
// import { 
//   sanitizeInput, 
//   validateFiles, 
//   getSecurityHeaders, 
//   validateRequestSize,
//   securityLog 
// } from '@/backend/lib/security';

// // ==========================================
// // ✅ CONSTANTS
// // ==========================================
// const ALLOWED_PROPERTY_TYPES = [
//   'house', 'apartment', 'villa', 'penthouse', 
//   'plot', 'commercial', 'office', 'shop', 
//   'warehouse', 'farmhouse', 'flat', 'studio'
// ];

// const ALLOWED_PRICE_TYPES = ['sale', 'rent'];
// const ALLOWED_CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'AED'];
// const ALLOWED_AREA_UNITS = ['sqft', 'sqm', 'marla', 'kanal', 'acre'];
// const ALLOWED_STATUSES = ['available', 'sold', 'pending', 'rented', 'unavailable'];

// const MAX_IMAGES = 10;
// const MIN_TITLE_LENGTH = 5;
// const MAX_TITLE_LENGTH = 150;
// const MIN_DESCRIPTION_LENGTH = 20;
// const MAX_DESCRIPTION_LENGTH = 5000;
// const MAX_PRICE = 999999999999;
// const MAX_COORDINATE = 180;
// const MAX_PROPERTY_CODE_LENGTH = 30;

// // ==========================================
// // ✅ OBJECTID VALIDATOR
// // ==========================================
// const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

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
//     if (!value) return null;
//     if (!ALLOWED_PRICE_TYPES.includes(value)) return `Price type must be one of: ${ALLOWED_PRICE_TYPES.join(', ')}`;
//     return null;
//   },

//   currency: (value) => {
//     if (!value) return null;
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

//   propertyCode: (value) => {
//     if (!value || typeof value !== 'string') return null;
//     const trimmed = value.trim();
//     if (trimmed.length === 0) return null;
//     if (trimmed.length > MAX_PROPERTY_CODE_LENGTH) return `Property code must not exceed ${MAX_PROPERTY_CODE_LENGTH} characters`;
//     if (!/^[A-Za-z0-9\-_]+$/.test(trimmed)) return 'Property code can only contain letters, numbers, hyphens, and underscores';
//     return null;
//   },

//   status: (value) => {
//     if (!value) return null;
//     if (!ALLOWED_STATUSES.includes(value.toLowerCase())) {
//       return `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`;
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
//     if (isNaN(num) || num < -MAX_COORDINATE || num > MAX_COORDINATE) return 'Invalid latitude value';
//     return null;
//   },

//   longitude: (value) => {
//     if (!value) return null;
//     const num = Number(value);
//     if (isNaN(num) || num < -MAX_COORDINATE || num > MAX_COORDINATE) return 'Invalid longitude value';
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
// // ✅ EXTRACT IMAGES FROM FORM DATA
// // ==========================================
// const extractImages = (formData) => {
//   let imageFiles = [];

//   imageFiles = formData.getAll('images').filter(
//     (file) => file instanceof File && file.size > 0
//   );

//   if (imageFiles.length === 0) {
//     imageFiles = formData.getAll('images').filter(
//       (file) => file instanceof Blob && file.size > 0
//     );
//   }

//   if (imageFiles.length === 0) {
//     for (const [key, value] of formData.entries()) {
//       if (key.toLowerCase().includes('image') && value instanceof Blob && value.size > 0) {
//         imageFiles.push(value);
//       }
//     }
//   }

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
// const patchProperty = async (request, context, user) => {
//   const startTime = Date.now();
//   const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

//   try {
//     // ==========================================
//     // STEP 1: REQUEST SIZE VALIDATION
//     // ==========================================
//     const sizeCheck = await validateRequestSize(request, 25);
//     if (!sizeCheck.valid) {
//       return NextResponse.json(
//         { success: false, message: sizeCheck.error },
//         { status: 413, headers: getSecurityHeaders() }
//       );
//     }

//     await connectDB();

//     const { id } = await context.params;

//     // ==========================================
//     // STEP 2: STRICT ID VALIDATION
//     // ==========================================
//     if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
//       securityLog('INVALID_PROPERTY_ID_PATCH', { requestId, providedId: id });
//       throw new ApiError(400, 'Invalid Property ID format');
//     }

//     // ==========================================
//     // STEP 3: FETCH EXISTING PROPERTY
//     // ==========================================
//     const existingProperty = await Property.findById(id).select('images propertyCode').lean();
//     if (!existingProperty) throw new ApiError(404, 'Property not found');

//     // ==========================================
//     // STEP 4: PARSE FORM DATA
//     // ==========================================
//     const contentType = request.headers.get('content-type') || '';
//     let updateData = {};
//     let newImageFiles = [];
//     let imagesToRemove = [];

//     if (contentType.includes('multipart/form-data')) {
//       let formData;
//       try {
//         formData = await request.formData();
//       } catch (error) {
//         securityLog('INVALID_FORM_DATA_PATCH', { requestId, propertyId: id, error: error.message });
//         throw new ApiError(400, 'Invalid form data');
//       }

//       // ==========================================
//       // STEP 5: EXTRACT & PARSE TEXT FIELDS
//       // ==========================================
//       const textFields = [
//         'title', 'description', 'price', 'priceType', 'currency',
//         'location', 'city', 'area', 'address', 'latitude', 'longitude',
//         'propertyType', 'propertyCode', 'bedrooms', 'bathrooms', 'kitchens',
//         'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
//         'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail'
//       ];

//       const rawValues = {};
//       textFields.forEach(field => {
//         rawValues[field] = formData.get(field);
//       });

//       // ==========================================
//       // STEP 6: VALIDATE PROVIDED FIELDS
//       // ==========================================
//       const errors = [];
//       const numericFields = ['price', 'bedrooms', 'bathrooms', 'kitchens', 'areaSize', 'floors', 'yearBuilt'];
//       const booleanFields = ['isFeatured', 'isPublished'];
//       const coordinateFields = ['latitude', 'longitude'];

//       textFields.forEach(field => {
//         const val = rawValues[field];
//         if (val === null || val === undefined || val === '') return;

//         if (numericFields.includes(field)) {
//           updateData[field] = Number(val);
//         } else if (booleanFields.includes(field)) {
//           updateData[field] = val === 'true' || val === true;
//         } else if (coordinateFields.includes(field)) {
//           updateData[field] = Number(val) || null;
//         } else {
//           updateData[field] = sanitizeInput(String(val).trim());
//         }

//         // Run validator
//         const error = validators[field]?.(val);
//         if (error) errors.push(error);
//       });

//       // ==========================================
//       // STEP 7: PARSE JSON FIELDS
//       // ==========================================
//       for (const field of ['features', 'amenities']) {
//         const raw = formData.get(field);
//         if (raw) {
//           try {
//             const parsed = JSON.parse(raw);
//             if (Array.isArray(parsed)) {
//               updateData[field] = sanitizeInput(
//                 parsed.map(f => String(f).trim()).filter(f => f.length > 0 && f.length <= 50).slice(0, 50)
//               );
//             }
//           } catch (e) {
//             errors.push(`Invalid ${field} format. Expected JSON array.`);
//           }
//         }
//       }

//       if (errors.length > 0) {
//         return NextResponse.json(
//           { success: false, message: 'Validation failed', errors },
//           { status: 400, headers: getSecurityHeaders() }
//         );
//       }

//       // ==========================================
//       // STEP 8: PROPERTY CODE UNIQUENESS CHECK
//       // ==========================================
//       if (updateData.propertyCode && updateData.propertyCode !== existingProperty.propertyCode) {
//         const codeExists = await Property.findOne({
//           propertyCode: updateData.propertyCode,
//           _id: { $ne: id },
//         }).lean();

//         if (codeExists) {
//           return NextResponse.json(
//             { success: false, message: `Property code "${updateData.propertyCode}" is already taken.` },
//             { status: 409, headers: getSecurityHeaders() }
//           );
//         }
//       }

//       // ==========================================
//       // STEP 9: PARSE REMOVE IMAGES
//       // ==========================================
//       const removeRaw = formData.get('removeImages');
//       if (removeRaw && typeof removeRaw === 'string' && removeRaw.trim() !== '' && removeRaw !== 'undefined') {
//         try {
//           const parsed = JSON.parse(removeRaw);
//           if (Array.isArray(parsed)) {
//             imagesToRemove = parsed.filter(x => x && typeof x === 'string' && x.trim() !== '');
//           } else if (typeof parsed === 'string' && parsed.trim()) {
//             imagesToRemove = [parsed.trim()];
//           }
//         } catch (e) {
//           const cleaned = removeRaw.replace(/[\[\]'"`]/g, '').trim();
//           if (cleaned.includes(',')) {
//             imagesToRemove = cleaned.split(',').map(s => s.trim()).filter(Boolean);
//           } else if (cleaned) {
//             imagesToRemove = [cleaned];
//           }
//         }
//       }

//       // ==========================================
//       // STEP 10: EXTRACT NEW IMAGE FILES
//       // ==========================================
//       newImageFiles = extractImages(formData);

//     } else {
//       // JSON body
//       const body = await request.json();
//       const allowedFields = [
//         'title', 'description', 'price', 'priceType', 'currency',
//         'location', 'city', 'area', 'address', 'latitude', 'longitude',
//         'propertyType', 'propertyCode', 'bedrooms', 'bathrooms', 'kitchens',
//         'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
//         'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail',
//         'features', 'amenities'
//       ];

//       const errors = [];

//       allowedFields.forEach(field => {
//         if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
//           if (typeof body[field] === 'string') {
//             updateData[field] = sanitizeInput(body[field]);
//           } else if (Array.isArray(body[field])) {
//             updateData[field] = sanitizeInput(body[field]);
//           } else {
//             updateData[field] = body[field];
//           }

//           const error = validators[field]?.(body[field]);
//           if (error) errors.push(error);
//         }
//       });

//       if (errors.length > 0) {
//         return NextResponse.json(
//           { success: false, message: 'Validation failed', errors },
//           { status: 400, headers: getSecurityHeaders() }
//         );
//       }

//       // Property code uniqueness
//       if (updateData.propertyCode && updateData.propertyCode !== existingProperty.propertyCode) {
//         const codeExists = await Property.findOne({
//           propertyCode: updateData.propertyCode,
//           _id: { $ne: id },
//         }).lean();

//         if (codeExists) {
//           return NextResponse.json(
//             { success: false, message: `Property code "${updateData.propertyCode}" is already taken.` },
//             { status: 409, headers: getSecurityHeaders() }
//           );
//         }
//       }

//       if (body.removeImages) {
//         if (Array.isArray(body.removeImages)) {
//           imagesToRemove = body.removeImages.filter(x => x && typeof x === 'string');
//         } else if (typeof body.removeImages === 'string') {
//           imagesToRemove = [body.removeImages];
//         }
//       }
//     }

//     // ==========================================
//     // STEP 11: VALIDATE NEW IMAGE FILES
//     // ==========================================
//     if (newImageFiles.length > 0) {
//       const fileValidation = validateFiles(newImageFiles);
//       if (!fileValidation.valid) {
//         return NextResponse.json(
//           { success: false, message: 'Image validation failed', errors: fileValidation.errors },
//           { status: 400, headers: getSecurityHeaders() }
//         );
//       }
//     }

//     // ==========================================
//     // STEP 12: IMAGE LOGIC
//     // ==========================================
//     let currentImages = JSON.parse(JSON.stringify(existingProperty.images || []));
//     let imageModified = false;
//     let removedIndexes = [];

//     // Remove existing images
//     if (imagesToRemove.length > 0) {
//       const foundMatches = [];

//       for (const removeId of imagesToRemove) {
//         const matchIndex = currentImages.findIndex(img => {
//           const dbId = img.public_id || '';
//           return dbId === removeId || dbId.endsWith(removeId) || removeId.endsWith(dbId) || (img.url && img.url.includes(removeId));
//         });

//         if (matchIndex !== -1) {
//           foundMatches.push({ index: matchIndex, public_id: currentImages[matchIndex].public_id });
//         }
//       }

//       foundMatches.sort((a, b) => b.index - a.index);

//       for (const match of foundMatches) {
//         try {
//           await deleteImage(match.public_id);
//         } catch (err) { /* Cloudinary delete failed — log but continue */ }
//         currentImages.splice(match.index, 1);
//         removedIndexes.push(match.index);
//         imageModified = true;
//       }

//       removedIndexes.sort((a, b) => a - b);
//     }

//     // Upload new images
//     let uploadedImages = [];
//     if (newImageFiles.length > 0) {
//       if (currentImages.length + newImageFiles.length > MAX_IMAGES) {
//         return NextResponse.json(
//           { success: false, message: `Maximum ${MAX_IMAGES} images allowed. Current: ${currentImages.length}, Adding: ${newImageFiles.length}` },
//           { status: 400, headers: getSecurityHeaders() }
//         );
//       }

//       try {
//         uploadedImages = await uploadMultipleImages(newImageFiles, 'properties', {
//           maxWidth: 1920,
//           maxHeight: 1080,
//           quality: 80,
//         });
//       } catch (error) {
//         securityLog('IMAGE_UPLOAD_FAILED_PATCH', { requestId, propertyId: id, error: error.message });
//         return NextResponse.json(
//           { success: false, message: 'Failed to upload images. Please try again.' },
//           { status: 500, headers: getSecurityHeaders() }
//         );
//       }
//     }

//     // Insert new images at removed positions (same-position replace)
//     if (uploadedImages.length > 0) {
//       uploadedImages.forEach((img, i) => {
//         if (i < removedIndexes.length) {
//           currentImages.splice(removedIndexes[i], 0, img);
//         } else {
//           currentImages.push(img);
//         }
//       });
//       imageModified = true;
//     }

//     if (imageModified) {
//       updateData.images = currentImages;
//       updateData.thumbnail = currentImages.length > 0 ? currentImages[0].url : '';
//     }

//     // ==========================================
//     // STEP 13: DATABASE UPDATE
//     // ==========================================
//     if (Object.keys(updateData).length === 0) {
//       throw new ApiError(400, 'No valid fields provided to update');
//     }

//     updateData.updatedBy = user._id;

//     const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedProperty) throw new ApiError(404, 'Property not found after update');

//     await updatedProperty.populate('addedBy', 'name email phone avatar');

//     // ==========================================
//     // STEP 14: SECURITY LOG
//     // ==========================================
//     securityLog('PROPERTY_UPDATED', {
//       requestId,
//       adminId: user._id,
//       propertyId: id,
//       updatedFields: Object.keys(updateData),
//       imagesAdded: uploadedImages.length,
//       imagesRemoved: removedIndexes.length,
//       duration: Date.now() - startTime,
//     });

//     // ==========================================
//     // STEP 15: RESPONSE
//     // ==========================================
//     const obj = updatedProperty.toObject();

//     return NextResponse.json({
//       success: true,
//       message: 'Property updated successfully',
//       updatedFields: Object.keys(updateData),
//       data: {
//         _id: obj._id,
//         propertyCode: obj.propertyCode,
//         title: obj.title,
//         description: obj.description,
//         price: obj.price,
//         priceType: obj.priceType,
//         currency: obj.currency,
//         location: obj.location,
//         city: obj.city,
//         area: obj.area,
//         address: obj.address,
//         coordinates: {
//           latitude: obj.latitude,
//           longitude: obj.longitude,
//         },
//         propertyType: obj.propertyType,
//         bedrooms: obj.bedrooms,
//         bathrooms: obj.bathrooms,
//         kitchens: obj.kitchens,
//         areaSize: obj.areaSize,
//         areaUnit: obj.areaUnit,
//         floors: obj.floors,
//         yearBuilt: obj.yearBuilt,
//         features: obj.features,
//         amenities: obj.amenities,
//         images: obj.images,
//         thumbnail: obj.thumbnail,
//         status: obj.status,
//         isFeatured: obj.isFeatured,
//         isPublished: obj.isPublished,
//         contact: {
//           name: obj.contactName,
//           phone: obj.contactPhone,
//           email: obj.contactEmail,
//         },
//         addedBy: {
//           _id: obj.addedBy?._id,
//           name: obj.addedBy?.name,
//           email: obj.addedBy?.email,
//           phone: obj.addedBy?.phone,
//           avatar: obj.addedBy?.avatar,
//         },
//         createdAt: obj.createdAt,
//         updatedAt: obj.updatedAt,
//       },
//     }, {
//       status: 200,
//       headers: {
//         ...getSecurityHeaders(),
//         'Cache-Control': 'no-store',
//         'X-Request-Id': requestId,
//         'X-Response-Time': `${Date.now() - startTime}ms`,
//       }
//     });

//   } catch (error) {
//     const duration = Date.now() - startTime;

//     securityLog('PATCH_PROPERTY_ERROR', {
//       requestId,
//       userId: user?._id,
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
//       duration,
//     });

//     const statusCode = error instanceof ApiError ? error.statusCode : 500;
//     const message = (statusCode === 500 && process.env.NODE_ENV === 'production')
//       ? 'Failed to update property'
//       : error.message;

//     return NextResponse.json(
//       { success: false, message },
//       {
//         status: statusCode,
//         headers: {
//           ...getSecurityHeaders(),
//           'Cache-Control': 'no-store',
//           'X-Request-Id': requestId,
//         }
//       }
//     );
//   }
// };

// // ==========================================
// // ✅ EXPORTS
// // ==========================================
// export const PATCH = withAdminAuth(patchProperty, {
//   windowMs: 15 * 60 * 1000,
//   maxRequests: 30,
//   message: 'Too many update attempts. Please try again later.',
// });

// const methodNotAllowed = () => {
//   return NextResponse.json(
//     { success: false, message: 'Method not allowed on this endpoint' },
//     { status: 405, headers: { ...getSecurityHeaders(), 'Allow': 'PATCH' } }
//   );
// };

// export const GET = methodNotAllowed;
// export const POST = methodNotAllowed;
// export const PUT = methodNotAllowed;
// export const DELETE = methodNotAllowed;















import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Property from '@/backend/models/property';
import { withAdminAuth } from '@/backend/middleware/auth';
import { uploadMultipleImages, deleteImage } from '@/backend/lib/cloudinary';
import ApiError from '@/backend/utils/apierror';
import { 
  sanitizeInput, 
  validateFiles, 
  getSecurityHeaders, 
  validateRequestSize,
  securityLog 
} from '@/backend/lib/security';

// ==========================================
// ✅ CONSTANTS
// ==========================================
const ALLOWED_PROPERTY_TYPES = [
  'house', 'apartment', 'villa', 'penthouse', 
  'plot', 'commercial', 'office', 'shop', 
  'warehouse', 'farmhouse', 'flat', 'studio'
];

const ALLOWED_PRICE_TYPES = ['sale', 'rent'];
const ALLOWED_CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP', 'AED'];
const ALLOWED_AREA_UNITS = ['sqft', 'sqm', 'marla', 'kanal', 'acre'];
const ALLOWED_STATUSES = ['available', 'sold', 'pending', 'rented', 'unavailable'];

const MAX_IMAGES = 10;
const MIN_TITLE_LENGTH = 5;
const MAX_TITLE_LENGTH = 150;
const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_PRICE = 999999999999;
const MAX_COORDINATE = 180;
const MAX_PROPERTY_CODE_LENGTH = 30;

// ==========================================
// ✅ OBJECTID VALIDATOR
// ==========================================
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

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
    if (!value || typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (trimmed.length === 0) return null;
    if (trimmed.length > MAX_PROPERTY_CODE_LENGTH) return `Property code must not exceed ${MAX_PROPERTY_CODE_LENGTH} characters`;
    if (!/^[A-Za-z0-9\-_]+$/.test(trimmed)) return 'Property code can only contain letters, numbers, hyphens, and underscores';
    return null;
  },

  status: (value) => {
    if (!value) return null;
    if (!ALLOWED_STATUSES.includes(value.toLowerCase())) {
      return `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`;
    }
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
const updatePropertyHandler = async (request, context, user) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    // ==========================================
    // STEP 1: REQUEST SIZE VALIDATION
    // ==========================================
    const sizeCheck = await validateRequestSize(request, 25);
    if (!sizeCheck.valid) {
      return NextResponse.json(
        { success: false, message: sizeCheck.error },
        { status: 413, headers: getSecurityHeaders() }
      );
    }

    await connectDB();

    const { id } = await context.params;

    // ==========================================
    // STEP 2: STRICT ID VALIDATION
    // ==========================================
    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
      securityLog('INVALID_PROPERTY_ID_UPDATE', { requestId, providedId: id });
      throw new ApiError(400, 'Invalid Property ID format');
    }

    // ==========================================
    // STEP 3: FETCH EXISTING PROPERTY
    // ==========================================
    const existingProperty = await Property.findById(id).select('images propertyCode').lean();
    if (!existingProperty) throw new ApiError(404, 'Property not found');

    // ==========================================
    // STEP 4: PARSE FORM DATA
    // ==========================================
    const contentType = request.headers.get('content-type') || '';
    let updateData = {};
    let newImageFiles = [];
    let imagesToRemove = [];

    if (contentType.includes('multipart/form-data')) {
      let formData;
      try {
        formData = await request.formData();
      } catch (error) {
        securityLog('INVALID_FORM_DATA_UPDATE', { requestId, propertyId: id, error: error.message });
        throw new ApiError(400, 'Invalid form data');
      }

      // ==========================================
      // STEP 5: EXTRACT & PARSE TEXT FIELDS
      // ==========================================
      const textFields = [
        'title', 'description', 'price', 'priceType', 'currency',
        'location', 'city', 'area', 'address', 'latitude', 'longitude',
        'propertyType', 'propertyCode', 'bedrooms', 'bathrooms', 'kitchens',
        'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
        'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail'
      ];

      const rawValues = {};
      textFields.forEach(field => {
        rawValues[field] = formData.get(field);
      });

      // ==========================================
      // STEP 6: VALIDATE PROVIDED FIELDS
      // ==========================================
      const errors = [];
      const numericFields = ['price', 'bedrooms', 'bathrooms', 'kitchens', 'areaSize', 'floors', 'yearBuilt'];
      const booleanFields = ['isFeatured', 'isPublished'];
      const coordinateFields = ['latitude', 'longitude'];

      textFields.forEach(field => {
        const val = rawValues[field];
        if (val === null || val === undefined || val === '') return;

        if (numericFields.includes(field)) {
          updateData[field] = Number(val);
        } else if (booleanFields.includes(field)) {
          updateData[field] = val === 'true' || val === true;
        } else if (coordinateFields.includes(field)) {
          updateData[field] = Number(val) || null;
        } else {
          updateData[field] = sanitizeInput(String(val).trim());
        }

        // Run validator
        const error = validators[field]?.(val);
        if (error) errors.push(error);
      });

      // ==========================================
      // STEP 7: PARSE JSON FIELDS
      // ==========================================
      for (const field of ['features', 'amenities']) {
        const raw = formData.get(field);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              updateData[field] = sanitizeInput(
                parsed.map(f => String(f).trim()).filter(f => f.length > 0 && f.length <= 50).slice(0, 50)
              );
            }
          } catch (e) {
            errors.push(`Invalid ${field} format. Expected JSON array.`);
          }
        }
      }

      if (errors.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Validation failed', errors },
          { status: 400, headers: getSecurityHeaders() }
        );
      }

      // ==========================================
      // STEP 8: PROPERTY CODE UNIQUENESS CHECK
      // ==========================================
      if (updateData.propertyCode && updateData.propertyCode !== existingProperty.propertyCode) {
        const codeExists = await Property.findOne({
          propertyCode: updateData.propertyCode,
          _id: { $ne: id },
        }).lean();

        if (codeExists) {
          return NextResponse.json(
            { success: false, message: `Property code "${updateData.propertyCode}" is already taken.` },
            { status: 409, headers: getSecurityHeaders() }
          );
        }
      }

      // ==========================================
      // STEP 9: PARSE REMOVE IMAGES
      // ==========================================
      const removeRaw = formData.get('removeImages');
      if (removeRaw && typeof removeRaw === 'string' && removeRaw.trim() !== '' && removeRaw !== 'undefined') {
        try {
          const parsed = JSON.parse(removeRaw);
          if (Array.isArray(parsed)) {
            imagesToRemove = parsed.filter(x => x && typeof x === 'string' && x.trim() !== '');
          } else if (typeof parsed === 'string' && parsed.trim()) {
            imagesToRemove = [parsed.trim()];
          }
        } catch (e) {
          const cleaned = removeRaw.replace(/[\[\]'"`]/g, '').trim();
          if (cleaned.includes(',')) {
            imagesToRemove = cleaned.split(',').map(s => s.trim()).filter(Boolean);
          } else if (cleaned) {
            imagesToRemove = [cleaned];
          }
        }
      }

      // ==========================================
      // STEP 10: EXTRACT NEW IMAGE FILES
      // ==========================================
      newImageFiles = extractImages(formData);

    } else {
      // JSON body
      const body = await request.json();
      const allowedFields = [
        'title', 'description', 'price', 'priceType', 'currency',
        'location', 'city', 'area', 'address', 'latitude', 'longitude',
        'propertyType', 'propertyCode', 'bedrooms', 'bathrooms', 'kitchens',
        'areaSize', 'areaUnit', 'floors', 'yearBuilt', 'status',
        'isFeatured', 'isPublished', 'contactName', 'contactPhone', 'contactEmail',
        'features', 'amenities'
      ];

      const errors = [];

      allowedFields.forEach(field => {
        if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
          if (typeof body[field] === 'string') {
            updateData[field] = sanitizeInput(body[field]);
          } else if (Array.isArray(body[field])) {
            updateData[field] = sanitizeInput(body[field]);
          } else {
            updateData[field] = body[field];
          }

          const error = validators[field]?.(body[field]);
          if (error) errors.push(error);
        }
      });

      if (errors.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Validation failed', errors },
          { status: 400, headers: getSecurityHeaders() }
        );
      }

      // Property code uniqueness
      if (updateData.propertyCode && updateData.propertyCode !== existingProperty.propertyCode) {
        const codeExists = await Property.findOne({
          propertyCode: updateData.propertyCode,
          _id: { $ne: id },
        }).lean();

        if (codeExists) {
          return NextResponse.json(
            { success: false, message: `Property code "${updateData.propertyCode}" is already taken.` },
            { status: 409, headers: getSecurityHeaders() }
          );
        }
      }

      if (body.removeImages) {
        if (Array.isArray(body.removeImages)) {
          imagesToRemove = body.removeImages.filter(x => x && typeof x === 'string');
        } else if (typeof body.removeImages === 'string') {
          imagesToRemove = [body.removeImages];
        }
      }
    }

    // ==========================================
    // STEP 11: VALIDATE NEW IMAGE FILES
    // ==========================================
    if (newImageFiles.length > 0) {
      const fileValidation = validateFiles(newImageFiles);
      if (!fileValidation.valid) {
        return NextResponse.json(
          { success: false, message: 'Image validation failed', errors: fileValidation.errors },
          { status: 400, headers: getSecurityHeaders() }
        );
      }
    }

    // ==========================================
    // STEP 12: IMAGE LOGIC
    // ==========================================
    let currentImages = JSON.parse(JSON.stringify(existingProperty.images || []));
    let imageModified = false;
    let removedIndexes = [];

    // Remove existing images
    if (imagesToRemove.length > 0) {
      const foundMatches = [];

      for (const removeId of imagesToRemove) {
        const matchIndex = currentImages.findIndex(img => {
          const dbId = img.public_id || '';
          return dbId === removeId || dbId.endsWith(removeId) || removeId.endsWith(dbId) || (img.url && img.url.includes(removeId));
        });

        if (matchIndex !== -1) {
          foundMatches.push({ index: matchIndex, public_id: currentImages[matchIndex].public_id });
        }
      }

      foundMatches.sort((a, b) => b.index - a.index);

      for (const match of foundMatches) {
        try {
          await deleteImage(match.public_id);
        } catch (err) { /* Cloudinary delete failed — log but continue */ }
        currentImages.splice(match.index, 1);
        removedIndexes.push(match.index);
        imageModified = true;
      }

      removedIndexes.sort((a, b) => a - b);
    }

    // Upload new images
    let uploadedImages = [];
    if (newImageFiles.length > 0) {
      if (currentImages.length + newImageFiles.length > MAX_IMAGES) {
        return NextResponse.json(
          { success: false, message: `Maximum ${MAX_IMAGES} images allowed. Current: ${currentImages.length}, Adding: ${newImageFiles.length}` },
          { status: 400, headers: getSecurityHeaders() }
        );
      }

      try {
        uploadedImages = await uploadMultipleImages(newImageFiles, 'properties', {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 80,
        });
      } catch (error) {
        securityLog('IMAGE_UPLOAD_FAILED_UPDATE', { requestId, propertyId: id, error: error.message });
        return NextResponse.json(
          { success: false, message: 'Failed to upload images. Please try again.' },
          { status: 500, headers: getSecurityHeaders() }
        );
      }
    }

    // Insert new images at removed positions (same-position replace)
    if (uploadedImages.length > 0) {
      uploadedImages.forEach((img, i) => {
        if (i < removedIndexes.length) {
          currentImages.splice(removedIndexes[i], 0, img);
        } else {
          currentImages.push(img);
        }
      });
      imageModified = true;
    }

    if (imageModified) {
      updateData.images = currentImages;
      updateData.thumbnail = currentImages.length > 0 ? currentImages[0].url : '';
    }

    // ==========================================
    // STEP 13: DATABASE UPDATE
    // ==========================================
    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'No valid fields provided to update');
    }

    updateData.updatedBy = user._id;

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) throw new ApiError(404, 'Property not found after update');

    await updatedProperty.populate('addedBy', 'name email phone avatar');

    // ==========================================
    // STEP 14: SECURITY LOG
    // ==========================================
    securityLog('PROPERTY_UPDATED', {
      requestId,
      adminId: user._id,
      propertyId: id,
      updatedFields: Object.keys(updateData),
      imagesAdded: uploadedImages.length,
      imagesRemoved: removedIndexes.length,
      duration: Date.now() - startTime,
    });

    // ==========================================
    // STEP 15: RESPONSE
    // ==========================================
    const obj = updatedProperty.toObject();

    return NextResponse.json({
      success: true,
      message: 'Property updated successfully',
      updatedFields: Object.keys(updateData),
      data: {
        _id: obj._id,
        propertyCode: obj.propertyCode,
        title: obj.title,
        description: obj.description,
        price: obj.price,
        priceType: obj.priceType,
        currency: obj.currency,
        location: obj.location,
        city: obj.city,
        area: obj.area,
        address: obj.address,
        coordinates: {
          latitude: obj.latitude,
          longitude: obj.longitude,
        },
        propertyType: obj.propertyType,
        bedrooms: obj.bedrooms,
        bathrooms: obj.bathrooms,
        kitchens: obj.kitchens,
        areaSize: obj.areaSize,
        areaUnit: obj.areaUnit,
        floors: obj.floors,
        yearBuilt: obj.yearBuilt,
        features: obj.features,
        amenities: obj.amenities,
        images: obj.images,
        thumbnail: obj.thumbnail,
        status: obj.status,
        isFeatured: obj.isFeatured,
        isPublished: obj.isPublished,
        contact: {
          name: obj.contactName,
          phone: obj.contactPhone,
          email: obj.contactEmail,
        },
        addedBy: {
          _id: obj.addedBy?._id,
          name: obj.addedBy?.name,
          email: obj.addedBy?.email,
          phone: obj.addedBy?.phone,
          avatar: obj.addedBy?.avatar,
        },
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      },
    }, {
      status: 200,
      headers: {
        ...getSecurityHeaders(),
        'Cache-Control': 'no-store',
        'X-Request-Id': requestId,
        'X-Response-Time': `${Date.now() - startTime}ms`,
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;

    securityLog('UPDATE_PROPERTY_ERROR', {
      requestId,
      userId: user?._id,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      duration,
    });

    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = (statusCode === 500 && process.env.NODE_ENV === 'production')
      ? 'Failed to update property'
      : error.message;

    return NextResponse.json(
      { success: false, message },
      {
        status: statusCode,
        headers: {
          ...getSecurityHeaders(),
          'Cache-Control': 'no-store',
          'X-Request-Id': requestId,
        }
      }
    );
  }
};

// ==========================================
// ✅ EXPORTS — PUT & PATCH both accepted
// ==========================================
const protectedHandler = withAdminAuth(updatePropertyHandler, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
  message: 'Too many update attempts. Please try again later.',
});

export const PUT = protectedHandler;
export const PATCH = protectedHandler;

const methodNotAllowed = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed on this endpoint' },
    { status: 405, headers: { ...getSecurityHeaders(), 'Allow': 'PUT, PATCH' } }
  );
};

export const GET = methodNotAllowed;
export const POST = methodNotAllowed;
export const DELETE = methodNotAllowed;