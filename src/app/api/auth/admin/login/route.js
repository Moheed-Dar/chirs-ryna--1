import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/user';
import { generateToken, verifyToken } from '@/backend/lib/auth';
import ApiError from '@/backend/utils/apierror';

// In-memory rate limiting
const loginAttempts = new Map();

export async function POST(request) {
  try {
    await connectDB();

    // ✅ CHECK IF ALREADY LOGGED IN
    const existingToken = request.cookies.get('token')?.value || 
                         request.headers.get('authorization')?.split(' ')[1];

    if (existingToken) {
      const decoded = verifyToken(existingToken);
      
      if (decoded) {
        // ✅ FIX: tokenVersion DB se lao (kyunki schema mein select: false hai)
        const existingUser = await User.findById(decoded.id).select('+tokenVersion');
        
        // ✅ FIX: Sirf TAB error do jab Token Version EXACTLY MATCH kare
        // Agar logout kiya tha toh DB version 1 hogi aur token version 0 hoga -> Match nahi hoga -> Aage badhega
        if (existingUser && existingUser.isActive && existingUser.tokenVersion === decoded.tokenVersion) {
          throw new ApiError(403, 'You are already logged in. Please logout first to login again.');
        }
      }
    }

    const body = await request.json();
    const { email, password } = body;

    // STRICT VALIDATION - Extra fields reject karega
    const allowedFields = ['email', 'password'];
    const bodyKeys = Object.keys(body);
    const extraFields = bodyKeys.filter(key => !allowedFields.includes(key));
    
    if (extraFields.length > 0) {
      throw new ApiError(400, `Invalid fields: ${extraFields.join(', ')}. Only email and password are allowed.`);
    }

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new ApiError(400, 'Invalid input data');
    }

    const sanitizedEmail = email.toLowerCase().trim();

    if (!sanitizedEmail.includes('@')) {
      throw new ApiError(400, 'Please enter a valid email address');
    }

    if (password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters');
    }

    // Rate Limiting
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const now = Date.now();
    let attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };

    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
      attempts.count = 0;
    }

    if (attempts.count >= 5) {
      throw new ApiError(429, 'Too many failed login attempts. Please try again after 15 minutes.');
    }

    attempts.count += 1;
    attempts.lastAttempt = now;
    loginAttempts.set(ip, attempts);

    // Find User (tokenVersion select zaroori hai)
    const user = await User.findOne({ email: sanitizedEmail }).select('+password +tokenVersion');

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Your account has been deactivated. Please contact admin.');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // LOGIN SUCCESS - Attempts Reset
    loginAttempts.delete(ip);

    // Generate NEW token with CURRENT tokenVersion
    const token = generateToken(user._id, user.tokenVersion);

    // Update Last Login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokenVersion;

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userObj,
        token,
      },
    });

    // Set NEW Cookie (Purani ko automatically overwrite kar dega)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode }
    );
  }
}