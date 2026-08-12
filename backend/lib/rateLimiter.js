// ==========================================
// ✅ IN-MEMORY RATE LIMITER (Production ke liye Redis use karo)
// ==========================================

const rateLimitStore = new Map();

// Cleanup har 5 minute mein
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.resetTime > 0) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const rateLimiter = ({
  windowMs = 60 * 1000,        // 1 minute window
  maxRequests = 5,             // Max 5 requests per window
  message = 'Too many requests, please try again later',
} = {}) => {
  return (request) => {
    // IP Address nikalo (Proxy ke peeche bhi kaam kare)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    
    // User ID bhi add karo agar logged in hai
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const key = `ratelimit:${ip}:${userId}:${request.url}`;

    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now - record.resetTime > windowMs) {
      // New window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
    }

    if (record.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
        message,
      };
    }

    record.count++;
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime,
    };
  };
};

// ==========================================
// ✅ STRICT RATE LIMITER (For sensitive operations)
// ==========================================
export const strictRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  maxRequests: 10,             // Only 10 requests
  message: 'Too many property creation attempts. Please try again after 15 minutes.',
});

// ==========================================
// ✅ FILE UPLOAD RATE LIMITER
// ==========================================
export const uploadRateLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000,   // 1 hour
  maxRequests: 20,             // 20 uploads per hour
  message: 'Upload limit reached. Please try again after 1 hour.',
});

