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
// ✅ MAIN HANDLER — DELETE SUBSCRIBER
// ==========================================
const deleteSubscriberHandler = async (request, context, user) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    const { id } = await context.params;

    // ==========================================
    // STEP 1: VALIDATE ID
    // ==========================================
    if (!id || !isValidObjectId(id)) {
      securityLog('INVALID_SUBSCRIBER_ID_DELETE', { requestId, providedId: id });
      throw new ApiError(400, 'Invalid subscriber ID format');
    }

    // ==========================================
    // STEP 2: DELETE SUBSCRIBER
    // ==========================================
    const subscriber = await Subscriber.findByIdAndDelete(id);
    if (!subscriber) throw new ApiError(404, 'Subscriber not found');

    // ==========================================
    // STEP 3: SECURITY LOG + RESPONSE
    // ==========================================
    securityLog('SUBSCRIBER_DELETED', {
      requestId,
      adminId: user._id,
      subscriberId: id,
      email: subscriber.email,
      duration: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Subscriber "${subscriber.email}" deleted successfully`,
        data: {
          _id: subscriber._id,
          name: subscriber.name,
          email: subscriber.email,
        },
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
    securityLog('SUBSCRIBER_DELETE_ERROR', {
      requestId,
      adminId: user?._id,
      error: error.message,
      duration: Date.now() - startTime,
    });

    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Failed to delete subscriber'
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
const protectedHandler = withAdminAuth(deleteSubscriberHandler, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
  message: 'Too many delete attempts. Please try again later.',
});

export const DELETE = protectedHandler;

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