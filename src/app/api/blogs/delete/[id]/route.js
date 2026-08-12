import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Blog from '@/backend/models/blog';
import { withAdminAuth } from '@/backend/middleware/auth';
import { deleteImage } from '@/backend/lib/cloudinary';
import ApiError from '@/backend/utils/apierror';
import { 
  getSecurityHeaders, 
  securityLog 
} from '@/backend/lib/security';

// ==========================================
// ✅ OBJECTID VALIDATOR
// ==========================================
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// ==========================================
// ✅ MAIN HANDLER
// ==========================================
const deleteBlogHandler = async (request, context, user) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    const { id } = await context.params;

    // ==========================================
    // STEP 1: STRICT ID VALIDATION
    // ==========================================
    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
      securityLog('INVALID_BLOG_ID_DELETE', { requestId, providedId: id });
      throw new ApiError(400, 'Invalid Blog ID format');
    }

    // ==========================================
    // STEP 2: FETCH EXISTING BLOG (TO GET IMAGE IDs)
    // ==========================================
    // .lean() use nahi kiya taa ke hum schema methods use kar sakein agar zaroorat pade
    const blog = await Blog.findById(id).select('featuredImage socialShareImage title');
    
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    // ==========================================
    // STEP 3: DELETE IMAGES FROM CLOUDINARY
    // ==========================================
    const imageFields = ['featuredImage', 'socialShareImage'];
    const deletionPromises = [];

    for (const field of imageFields) {
      if (blog[field]?.public_id) {
        // Array of promises to delete images concurrently
        deletionPromises.push(
          deleteImage(blog[field].public_id).catch(err => {
            console.error(`Failed to delete ${field} from Cloudinary:`, err);
            // Log error but don't reject the promise to allow DB deletion to proceed
          })
        );
      }
    }

    // Wait for all image deletions to complete (or fail gracefully)
    await Promise.all(deletionPromises);

    // ==========================================
    // STEP 4: DELETE BLOG FROM DATABASE
    // ==========================================
    await Blog.findByIdAndDelete(id);

    // ==========================================
    // STEP 5: SECURITY LOG
    // ==========================================
    securityLog('BLOG_DELETED', {
      requestId,
      adminId: user._id,
      blogId: id,
      title: blog.title,
      duration: Date.now() - startTime,
    });

    // ==========================================
    // STEP 6: RESPONSE
    // ==========================================
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
      data: {
        id: id,
        title: blog.title,
      }
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

    securityLog('DELETE_BLOG_ERROR', {
      requestId,
      userId: user?._id,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      duration,
    });

    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = (statusCode === 500 && process.env.NODE_ENV === 'production')
      ? 'Failed to delete blog'
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
// ✅ EXPORTS
// ==========================================
const protectedHandler = withAdminAuth(deleteBlogHandler, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: 'Too many delete attempts. Please try again later.',
});

export const DELETE = protectedHandler;

// Handle other methods
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