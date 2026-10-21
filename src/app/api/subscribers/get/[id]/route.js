import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Subscriber from '@/backend/models/subscriber';
import { withAdminAuth } from '@/backend/middleware/auth';
import ApiError from '@/backend/utils/apierror';
import {
  getSecurityHeaders,
  securityLog,
} from '@/backend/lib/security';

// ==========================================
// ✅ OBJECTID VALIDATOR
// ==========================================
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// ==========================================
// ✅ MAIN HANDLER — GET SINGLE SUBSCRIBER
// ==========================================
const getSubscriberHandler = async (request, context, user) => {
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    // ==========================================
    // STEP 1: GET ID FROM QUERY PARAM
    // ==========================================
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || !isValidObjectId(id)) {
      throw new ApiError(400, 'Valid subscriber ID is required (?id=xxx)');
    }

    // ==========================================
    // STEP 2: FETCH SUBSCRIBER
    // ==========================================
    const subscriber = await Subscriber.findById(id).lean();
    if (!subscriber) throw new ApiError(404, 'Subscriber not found');

    // ==========================================
    // STEP 3: SECURITY LOG + RESPONSE
    // ==========================================
    securityLog('SUBSCRIBER_VIEWED', {
      requestId,
      adminId: user._id,
      subscriberId: id,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Subscriber fetched successfully',
        data: subscriber,
      },
      {
        status: 200,
        headers: {
          ...getSecurityHeaders(),
          'Cache-Control': 'no-store',
          'X-Request-Id': requestId,
        },
      }
    );
  } catch (error) {
    securityLog('SUBSCRIBER_GET_ERROR', {
      requestId,
      adminId: user?._id,
      error: error.message,
    });

    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Failed to fetch subscriber'
      : error.message;

    return NextResponse.json(
      { success: false, message },
      { status: statusCode, headers: { ...getSecurityHeaders(), 'X-Request-Id': requestId } }
    );
  }
};

// ==========================================
// ✅ EXPORTS
// ==========================================
const protectedHandler = withAdminAuth(getSubscriberHandler, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
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