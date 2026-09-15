import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Subscriber from '@/backend/models/subscriber';
import ApiError from '@/backend/utils/apierror';
import {
  sanitizeInput,
  getSecurityHeaders,
  validateRequestSize,
  securityLog,
} from '@/backend/lib/security';
import { strictRateLimiter } from '@/backend/lib/rateLimiter';

// ==========================================
// ✅ CONSTANTS
// ==========================================
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// ✅ INPUT VALIDATORS
// ==========================================
const validators = {
  name: (value) => {
    if (!value || typeof value !== 'string') return 'Name is required';
    const trimmed = value.trim();
    if (trimmed.length < MIN_NAME_LENGTH) return `Name must be at least ${MIN_NAME_LENGTH} characters`;
    if (trimmed.length > MAX_NAME_LENGTH) return `Name must not exceed ${MAX_NAME_LENGTH} characters`;
    return null;
  },

  email: (value) => {
    if (!value || typeof value !== 'string') return 'Email is required';
    const trimmed = value.trim();
    if (trimmed.length > MAX_EMAIL_LENGTH) return 'Email must not exceed 200 characters';
    if (!EMAIL_REGEX.test(trimmed)) return 'Invalid email format';
    return null;
  },
};

// ==========================================
// ✅ GET CLIENT IP
// ==========================================
const getClientIp = (request) => {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
};

// ==========================================
// ✅ MAIN HANDLER — SUBSCRIBE
// ==========================================
const createSubscriberHandler = async (request) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    // STEP 1: Request size validation (max 10KB)
    const sizeCheck = await validateRequestSize(request, 10);
    if (!sizeCheck.valid) {
      return NextResponse.json(
        { success: false, message: sizeCheck.error },
        { status: 413, headers: getSecurityHeaders() }
      );
    }

    // STEP 2: Rate limit (public endpoint — strict)
    const rateCheck = strictRateLimiter(request);
    if (!rateCheck.allowed) {
      securityLog('SUBSCRIBE_RATE_LIMITED', { requestId, ip: getClientIp(request) });
      const response = NextResponse.json(
        { success: false, message: rateCheck.message },
        { status: 429, headers: getSecurityHeaders() }
      );
      response.headers.set('Retry-After', String(rateCheck.retryAfter));
      return response;
    }

    // STEP 3: Parse JSON body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      securityLog('SUBSCRIBE_INVALID_BODY', { requestId, error: error.message });
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // STEP 4: Extract & sanitize
    const name = sanitizeInput(String(body.name || '').trim());
    const email = sanitizeInput(String(body.email || '').trim().toLowerCase());

    // STEP 5: Validate
    const errors = [];
    const nameError = validators.name(name);
    if (nameError) errors.push(nameError);

    const emailError = validators.email(email);
    if (emailError) errors.push(emailError);

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    await connectDB();

    // STEP 6: Duplicate check — friendly response instead of error
    const existing = await Subscriber.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { success: true, message: 'You are already subscribed to our newsletter!' },
        { status: 200, headers: getSecurityHeaders() }
      );
    }

    // STEP 7: Create subscriber
    const subscriber = await Subscriber.create({ name, email });

    // STEP 8: Security log
    securityLog('SUBSCRIBER_CREATED', {
      requestId,
      subscriberId: subscriber._id,
      ip: getClientIp(request),
      duration: Date.now() - startTime,
    });

    // STEP 9: Response
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to our newsletter!',
        data: {
          _id: subscriber._id,
          name: subscriber.name,
          email: subscriber.email,
          createdAt: subscriber.createdAt,
        },
      },
      {
        status: 201,
        headers: {
          ...getSecurityHeaders(),
          'X-Request-Id': requestId,
          'X-Response-Time': `${Date.now() - startTime}ms`,
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    securityLog('SUBSCRIBE_ERROR', {
      requestId,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      duration,
    });

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (error instanceof ApiError) {
      statusCode = error.statusCode;
      message = error.message;
    } else if ((error.name === 'MongoError' || error.name === 'MongoServerError') && error.code === 11000) {
      statusCode = 409;
      message = 'This email is already subscribed';
    } else if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors).map((e) => e.message).join(', ') || 'Validation failed';
    }

    return NextResponse.json(
      {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
          error: { name: error.name, message: error.message },
        }),
      },
      {
        status: statusCode,
        headers: { ...getSecurityHeaders(), 'X-Request-Id': requestId },
      }
    );
  }
};

// ==========================================
// ✅ EXPORTS — POST public, baaki blocked
// ==========================================
export const POST = createSubscriberHandler;

const methodNotAllowed = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed on this endpoint' },
    { status: 405, headers: { ...getSecurityHeaders(), 'Allow': 'POST' } }
  );
};

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const PATCH = methodNotAllowed;