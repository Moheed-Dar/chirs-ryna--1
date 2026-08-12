// import { NextResponse } from 'next/server';
// import { verifyToken } from '@/backend/lib/auth';
// import connectDB from '@/backend/lib/db';
// import User from '@/backend/models/user';

// // ==========================================
// // ✅ BASIC AUTHENTICATION
// // ==========================================
// export const authenticate = async (request) => {
//   try {
//     await connectDB();
    
//     let token = request.cookies.get('token')?.value;

//     if (!token) {
//       const authHeader = request.headers.get('authorization');
//       if (authHeader && authHeader.startsWith('Bearer ')) {
//         token = authHeader.split(' ')[1];
//       }
//     }
    
//     if (!token) {
//       return { success: false, error: { statusCode: 401, message: 'Please login to access this resource' } };
//     }

//     const decoded = verifyToken(token);

//     if (!decoded) {
//       return { success: false, error: { statusCode: 401, message: 'Invalid or expired token' } };
//     }

//     const user = await User.findById(decoded.id).select('+tokenVersion');

//     if (!user) {
//       return { success: false, error: { statusCode: 401, message: 'User no longer exists' } };
//     }

//     if (!user.isActive) {
//       return { success: false, error: { statusCode: 401, message: 'Your account has been deactivated' } };
//     }

//     // ✅ FIX: Agar DB mein field nahi bani hai toh 0 consider karo
//     const dbVersion = user.tokenVersion ?? 0;
//     const tokenVersion = decoded.tokenVersion ?? 0;

//     if (dbVersion !== tokenVersion) {
//       return { success: false, error: { statusCode: 401, message: 'Session expired. Please login again.' } };
//     }

//     return { success: true, user };
//   } catch (error) {
//     console.error('Auth Error:', error.message);
//     return { success: false, error: { statusCode: 401, message: 'Authentication failed' } };
//   }
// };

// // ==========================================
// // ✅ FOR NORMAL AUTHENTICATED USERS
// // ==========================================
// export const withAuth = (handler) => {
//   return async (request, context) => {
//     const auth = await authenticate(request);
//     if (!auth.success) {
//       return NextResponse.json(
//         { success: false, message: auth.error.message }, 
//         { status: auth.error.statusCode }
//       );
//     }
//     return handler(request, context, auth.user);
//   };
// };

// // ==========================================
// // ✅ NEW: FOR ADMIN ONLY - AUTOMATIC CHECK
// // ==========================================
// export const withAdminAuth = (handler) => {
//   return async (request, context) => {
//     const auth = await authenticate(request);
    
//     // Step 1: Token Verify
//     if (!auth.success) {
//       return NextResponse.json(
//         { success: false, message: auth.error.message }, 
//         { status: auth.error.statusCode }
//       );
//     }

//     // Step 2: Admin Check
//     if (auth.user.role !== 'admin') {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'Access denied. Only admin can access this resource.' 
//         }, 
//         { status: 403 }
//       );
//     }

//     // Step 3: Handler Call
//     return handler(request, context, auth.user);
//   };
// };

// // ==========================================
// // ✅ OPTIONAL: ROLE-BASED AUTH (FLEXIBLE)
// // ==========================================
// export const withRoleAuth = (allowedRoles) => {
//   return (handler) => {
//     return async (request, context) => {
//       const auth = await authenticate(request);
      
//       if (!auth.success) {
//         return NextResponse.json(
//           { success: false, message: auth.error.message }, 
//           { status: auth.error.statusCode }
//         );
//       }

//       if (!allowedRoles.includes(auth.user.role)) {
//         return NextResponse.json(
//           { 
//             success: false, 
//             message: `Access denied. Only ${allowedRoles.join(', ')} can access this resource.` 
//           }, 
//           { status: 403 }
//         );
//       }

//       return handler(request, context, auth.user);
//     };
//   };
// };






















import { NextResponse } from 'next/server';
import { verifyToken } from '@/backend/lib/auth';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/user';

// ==========================================
// ✅ BASIC AUTHENTICATION
// ==========================================
export const authenticate = async (request) => {
  try {
    await connectDB();
    
    let token = request.cookies.get('token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    
    if (!token) {
      return { success: false, error: { statusCode: 401, message: 'Please login to access this resource' } };
    }

    // Token format validate karo
    if (typeof token !== 'string' || token.length < 10) {
      return { success: false, error: { statusCode: 401, message: 'Invalid token format' } };
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return { success: false, error: { statusCode: 401, message: 'Invalid or expired token' } };
    }

    // decoded.id validate karo (MongoDB ObjectId injection se bachne ke liye)
    if (!decoded.id || typeof decoded.id !== 'string' || decoded.id.length !== 24) {
      return { success: false, error: { statusCode: 401, message: 'Invalid token payload' } };
    }

    const user = await User.findById(decoded.id).select('+tokenVersion').lean();

    if (!user) {
      return { success: false, error: { statusCode: 401, message: 'User no longer exists' } };
    }

    if (!user.isActive) {
      return { success: false, error: { statusCode: 401, message: 'Your account has been deactivated' } };
    }

    const dbVersion = user.tokenVersion ?? 0;
    const tokenVersion = decoded.tokenVersion ?? 0;

    if (dbVersion !== tokenVersion) {
      return { success: false, error: { statusCode: 401, message: 'Session expired. Please login again.' } };
    }

    // ✅ Sensitive data remove karo (security)
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    };

    return { success: true, user: safeUser };
  } catch (error) {
    console.error('Auth Error:', error.message);
    return { success: false, error: { statusCode: 401, message: 'Authentication failed' } };
  }
};

// ==========================================
// ✅ FOR NORMAL AUTHENTICATED USERS
// ==========================================
export const withAuth = (handler) => {
  return async (request, context) => {
    const auth = await authenticate(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.error.message }, 
        { status: auth.error.statusCode }
      );
    }
    return handler(request, context, auth.user);
  };
};

// ==========================================
// ✅ FOR ADMIN ONLY WITH RATE LIMITING
// ==========================================
export const withAdminAuth = (handler, rateLimitOptions = {}) => {
  return async (request, context) => {
    // Step 1: Rate Limit Check (Before DB call - Save resources)
    if (rateLimitOptions.enabled !== false) {
      const { rateLimiter } = await import('@/backend/lib/rateLimiter');
      const limiter = rateLimiter(rateLimitOptions);
      const rateCheck = limiter(request);
      
      if (!rateCheck.allowed) {
        const response = NextResponse.json(
          { 
            success: false, 
            message: rateCheck.message || 'Too many requests' 
          }, 
          { status: 429 }
        );
        
        // Rate limit headers add karo
        response.headers.set('Retry-After', String(rateCheck.retryAfter || 60));
        response.headers.set('X-RateLimit-Remaining', '0');
        response.headers.set('X-RateLimit-Reset', String(Math.ceil(rateCheck.resetTime / 1000)));
        
        return response;
      }
      
      // Rate limit headers add karo (successful request pe bhi)
      const originalHandler = handler;
      handler = async (req, ctx, user) => {
        const response = await originalHandler(req, ctx, user);
        if (response && response.headers) {
          response.headers.set('X-RateLimit-Remaining', String(rateCheck.remaining));
          response.headers.set('X-RateLimit-Reset', String(Math.ceil(rateCheck.resetTime / 1000)));
        }
        return response;
      };
    }

    // Step 2: Token Verify
    const auth = await authenticate(request);
    
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.error.message }, 
        { status: auth.error.statusCode }
      );
    }

    // Step 3: Admin Check
    if (auth.user.role !== 'admin') {
      // Security log - Unauthorized admin access attempt
      try {
        const { securityLog } = await import('@/backend/lib/security');
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
        securityLog('UNAUTHORIZED_ADMIN_ACCESS', {
          userId: auth.user._id,
          userRole: auth.user.role,
          ip,
          path: request.url,
          method: request.method,
        });
      } catch (e) {}
      
      return NextResponse.json(
        { success: false, message: 'Access denied' }, 
        { status: 403 }
      );
    }

    // Step 4: Handler Call
    return handler(request, context, auth.user);
  };
};