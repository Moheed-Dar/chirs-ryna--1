// import { NextResponse } from 'next/server';
// import connectDB from '@/backend/lib/db';
// import Property from '@/backend/models/property';
// import { withAuth } from '@/backend/middleware/auth';
// import { deleteImage } from '@/backend/lib/cloudinary';
// import ApiError from '@/backend/utils/apierror';

// const deleteProperty = async (request, context, user) => {
//   try {
//     await connectDB();

//     // ✅ SECURITY: Sirf Admin delete kar sakta hai
//     if (user.role !== 'admin') {
//       throw new ApiError(403, 'Access denied. Only admin can delete properties.');
//     }

//     const { id } = await context.params;

//     if (!id) {
//       throw new ApiError(400, 'Property ID is required');
//     }

//     // Property dhundo
//     const property = await Property.findById(id);

//     if (!property) {
//       throw new ApiError(404, 'Property not found');
//     }

//     // ✅ DEBUG: Images structure dekho
//     console.log('=== PROPERTY IMAGES ===');
//     console.log('Images:', JSON.stringify(property.images, null, 2));

//     // ✅ Cloudinary se Images Delete Karo
//     let deletedCount = 0;

//     if (property.images && property.images.length > 0) {
//       console.log(`Total images: ${property.images.length}`);

//       for (const img of property.images) {
//         try {
//           // ✅ FIX: public_id use karo (underscore ke saath) - YEH FIX HAI!
//           const publicId = img.public_id;  // ← YAHAN public_id hai, publicId nahi!

//           console.log(`Deleting image - public_id: ${publicId}`);

//           if (publicId) {
//             const result = await deleteImage(publicId);
//             console.log(`Result:`, result);

//             if (result && result.result === 'ok') {
//               deletedCount++;
//               console.log(`✅ Deleted: ${publicId}`);
//             } else {
//               console.log(`⚠️ Failed: ${publicId} - ${result?.result}`);
//             }
//           } else {
//             console.log(`⚠️ No public_id found for image:`, img);
//           }
//         } catch (error) {
//           console.error(`Error deleting image:`, error.message);
//         }
//       }
//     }

//     // ✅ Database se Property Delete Karo
//     await Property.findByIdAndDelete(id);

//     console.log(`✅ Property deleted: ${id} | Images deleted: ${deletedCount}/${property.images?.length || 0}`);

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Property and images deleted successfully',
//         deletedId: id,
//         deletedImagesCount: deletedCount,
//         totalImages: property.images?.length || 0,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Delete Property Error:', error);
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

// export const DELETE = withAuth(deleteProperty);


















import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Property from '@/backend/models/property';
import { withAdminAuth } from '@/backend/middleware/auth';
import { deleteImage } from '@/backend/lib/cloudinary';
import ApiError from '@/backend/utils/apierror';
import { getSecurityHeaders, securityLog } from '@/backend/lib/security';

// ==========================================
// ✅ MONGODB OBJECTID VALIDATOR
// ==========================================
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// ==========================================
// ✅ MAIN HANDLER
// ==========================================
const deleteProperty = async (request, context, user) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    const { id } = await context.params;

    // ==========================================
    // 1. STRICT ID VALIDATION
    // ==========================================
    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
      securityLog('INVALID_PROPERTY_ID_DELETE', {
        requestId,
        userId: user._id,
        providedId: id,
      });
      throw new ApiError(400, 'Invalid Property ID format');
    }

    // ==========================================
    // 2. FETCH PROPERTY (To get images & verify existence)
    // ==========================================
    const property = await Property.findById(id).select('images').lean();

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    // ==========================================
    // 3. CLOUDINARY IMAGE CLEANUP (Parallel & Safe)
    // ==========================================
    let deletedCount = 0;
    let failedCount = 0;

    if (property.images && property.images.length > 0) {
      // ✅ Promise.allSettled: Agar 1 image fail bhi ho, baqi delete hon gi
      const deletePromises = property.images.map(img => {
        // ✅ FIX: Safely extract public_id
        const publicId = img?.public_id || img?.publicId;
        
        if (publicId) {
          return deleteImage(publicId)
            .then(res => {
              if (res?.result === 'ok' || res?.result === 'not found') return true;
              return false;
            })
            .catch(() => false); // Swallow individual errors
        }
        return Promise.resolve(false);
      });

      const results = await Promise.allSettled(deletePromises);
      
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value === true) {
          deletedCount++;
        } else {
          failedCount++;
        }
      });

      // ✅ Log Cloudinary failures for manual review (Non-blocking)
      if (failedCount > 0) {
        securityLog('CLOUDINARY_DELETE_PARTIAL_FAIL', {
          requestId,
          propertyId: id,
          failedCount,
          totalImages: property.images.length,
        });
      }
    }

    // ==========================================
    // 4. DATABASE DELETION
    // ==========================================
    await Property.findByIdAndDelete(id);

    // ==========================================
    // 5. SECURITY AUDIT LOG
    // ==========================================
    securityLog('PROPERTY_DELETED', {
      requestId,
      adminId: user._id,
      propertyId: id,
      imagesDeleted: deletedCount,
      imagesFailed: failedCount,
      duration: Date.now() - startTime,
    });

    // ==========================================
    // 6. RESPONSE
    // ==========================================
    return NextResponse.json(
      {
        success: true,
        message: 'Property deleted successfully',
        data: {
          deletedId: id,
          cloudinaryReport: {
            deleted: deletedCount,
            failed: failedCount,
            total: property.images?.length || 0,
          }
        }
      },
      { 
        status: 200,
        headers: {
          ...getSecurityHeaders(),
          'X-Request-Id': requestId,
          'X-Response-Time': `${Date.now() - startTime}ms`,
        }
      }
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    
    securityLog('DELETE_PROPERTY_ERROR', {
      requestId,
      userId: user?._id,
      error: error.message,
      duration,
    });

    const statusCode = error.statusCode || 500;
    const message = (statusCode === 500 && process.env.NODE_ENV === 'production') 
      ? 'Failed to delete property' 
      : error.message;
      
    return NextResponse.json(
      {
        success: false,
        message: message,
      },
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
// ✅ EXPORT DELETE (withAdminAuth automatically checks admin role)
// ==========================================
export const DELETE = withAdminAuth(deleteProperty, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50,           // 50 deletes per 15 mins is plenty
  message: 'Too many delete attempts. Please try again later.',
});

// ==========================================
// ✅ BLOCK OTHER METHODS (Security)
// ==========================================
const methodNotAllowed = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed on this endpoint' },
    { status: 405, headers: { ...getSecurityHeaders(), 'Allow': 'DELETE' } }
  );
};

export const GET = methodNotAllowed;
export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;