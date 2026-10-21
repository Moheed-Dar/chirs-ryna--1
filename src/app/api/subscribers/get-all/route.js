import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Subscriber from '@/backend/models/subscriber';
import { withAdminAuth } from '@/backend/middleware/auth';
import ApiError from '@/backend/utils/apierror';
import {
  sanitizeInput,
  getSecurityHeaders,
  securityLog,
} from '@/backend/lib/security';

// ==========================================
// ✅ CONSTANTS
// ==========================================
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

// ==========================================
// ✅ MAIN HANDLER — GET ALL SUBSCRIBERS
// ==========================================
const getAllSubscribersHandler = async (request, context, user) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    // ==========================================
    // STEP 1: PARSE QUERY PARAMS
    // ==========================================
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit')) || DEFAULT_LIMIT));
    const search = sanitizeInput(searchParams.get('search') || '').trim();
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // ==========================================
    // STEP 2: BUILD FILTER
    // ==========================================
    const filter = {};

    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    // ==========================================
    // STEP 3: FETCH DATA (parallel queries)
    // ==========================================
    const skip = (page - 1) * limit;

    const [subscribers, totalCount] = await Promise.all([
      Subscriber.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Subscriber.countDocuments(filter),
    ]);

    // ==========================================
    // STEP 4: BUILD RESPONSE
    // ==========================================
    const totalPages = Math.ceil(totalCount / limit);

    securityLog('SUBSCRIBERS_LISTED', {
      requestId,
      adminId: user._id,
      page,
      limit,
      totalCount,
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Subscribers fetched successfully',
        data: {
          subscribers,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      },
      {
        status: 200,
        headers: {
          ...getSecurityHeaders(),
          'Cache-Control': 'no-store',
          'X-Request-Id': requestId,
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  } catch (error) {
    securityLog('SUBSCRIBERS_LIST_ERROR', {
      requestId,
      adminId: user?._id,
      error: error.message,
      duration: Date.now() - startTime,
    });

    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Failed to fetch subscribers'
      : error.message;

    return NextResponse.json(
      { success: false, message },
      {
        status: statusCode,
        headers: { ...getSecurityHeaders(), 'Cache-Control': 'no-store', 'X-Request-Id': requestId },
      }
    );
  }
};

// ==========================================
// ✅ EXPORTS
// ==========================================
const protectedHandler = withAdminAuth(getAllSubscribersHandler, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  message: 'Too many requests. Please try again later.',
});

export const GET = protectedHandler;

const methodNotAllowed = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed on this endpoint' },
    { status: 405, headers: { ...getSecurityHeaders(), 'Allow': 'GET' } }
  );
};

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;