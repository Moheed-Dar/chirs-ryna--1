// ==========================================
// ✅ SECURITY UTILITIES - Production Level
// ==========================================

// Dangerous patterns
const DANGEROUS_PATTERNS = [
  /\$\{.*\}/g,
  /\$\(/g,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /eval\s*\(/g,
  /Function\s*\(/g,
  /document\./g,
  /window\./g,
  /localStorage/g,
  /sessionStorage/g,
  /__proto__/g,
  /constructor/g,
  /\[object/g,
];

// ==========================================
// ✅ INPUT SANITIZATION
// ==========================================
export const sanitizeInput = (input) => {
  if (input === null || input === undefined) return input;

  if (typeof input === 'string') {
    let sanitized = input;
    DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim()
      .replace(/\0/g, '');

    return sanitized;
  }

  if (Array.isArray(input)) return input.map(item => sanitizeInput(item));
  
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const safeKey = String(key).replace(/__proto__|constructor|prototype/gi, '');
        sanitized[safeKey] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }

  return input;
};

// ==========================================
// ✅ FILE VALIDATION (Already Fixed Earlier)
// ==========================================
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB

export const validateFile = (file, index = 0) => {
  const errors = [];

  if (!(file instanceof Blob)) {
    errors.push(`File ${index + 1}: Invalid file format`);
    return { valid: false, errors };
  }

  if (file.size === 0) {
    errors.push(`File ${index + 1}: Empty file`);
    return { valid: false, errors };
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File ${index + 1}: Size exceeds 5MB limit`);
    return { valid: false, errors };
  }

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    errors.push(`File ${index + 1}: Invalid file type. Allowed: JPG, PNG, WebP, GIF`);
    return { valid: false, errors };
  }

  if (file.name) {
    const fileName = file.name.toLowerCase();
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      errors.push(`File ${index + 1}: No file extension found`);
      return { valid: false, errors };
    }

    const ext = fileName.substring(lastDotIndex);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`File ${index + 1}: Invalid extension "${ext}"`);
      return { valid: false, errors };
    }
  }

  return { valid: true, errors: [] };
};

export const validateFiles = (files) => {
  if (!files || files.length === 0) {
    return { valid: true, errors: [] }; // Images optional
  }

  if (files.length > 10) {
    return { valid: false, errors: ['Maximum 10 images allowed'] };
  }

  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
  if (totalSize > MAX_TOTAL_SIZE) {
    return { valid: false, errors: ['Total file size exceeds 25MB limit'] };
  }

  const allErrors = [];
  for (let i = 0; i < files.length; i++) {
    const result = validateFile(files[i], i);
    if (!result.valid) allErrors.push(...result.errors);
  }

  return allErrors.length > 0 
    ? { valid: false, errors: allErrors } 
    : { valid: true, errors: [] };
};

// ==========================================
// ✅ SECURITY HEADERS
// ==========================================
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
});

// ==========================================
// ✅ REQUEST SIZE VALIDATION
// ==========================================
export const validateRequestSize = async (request, maxSizeMB = 25) => {
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const sizeBytes = parseInt(contentLength, 10);
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (sizeBytes > maxBytes) {
      return { 
        valid: false, 
        error: `Request size exceeds ${maxSizeMB}MB limit` 
      };
    }
  }
  return { valid: true };
};

// ==========================================
// ✅ SECURITY LOG
// ==========================================
export const securityLog = (event, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...details,
  };
  console.log('🔒 Security Log:', logEntry);
};

// Make sure all are exported
export { validateFile };