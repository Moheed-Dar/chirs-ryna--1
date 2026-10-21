import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Blog from '@/backend/models/blog';
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
// ✅ GET BLOG BY ID
// ==========================================
export const GET = async (request, context) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    const { id } = await context.params;

    // STEP 1: STRICT ID VALIDATION
    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
      securityLog('INVALID_BLOG_ID_FETCH', { requestId, providedId: id });
      throw new ApiError(400, 'Invalid Blog ID format');
    }

    // STEP 2: FETCH BLOG FROM DATABASE
    // Author ki details (name, email, avatar) bhi populate kar rahe hain
    const blog = await Blog.findById(id).populate('author', 'name email avatar').lean();

    // STEP 3: HANDLE NOT FOUND
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    // STEP 4: BUILD RESPONSE
    const response = {
      success: true,
      data: blog,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        ...getSecurityHeaders(),
        'X-Request-Id': requestId,
        'X-Response-Time': `${Date.now() - startTime}ms`,
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    
    securityLog('BLOG_FETCH_BY_ID_ERROR', {
      requestId,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      duration,
    });

    // Agar error ApiError ka instance hai toh uska status code lo, warna 500
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = (statusCode === 500 && process.env.NODE_ENV === 'production')
      ? 'Failed to fetch blog'
      : error.message;

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