import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Blog from '@/backend/models/blog';
import { withAdminAuth } from '@/backend/middleware/auth';
import { uploadMultipleImages, deleteImage } from '@/backend/lib/cloudinary';
import ApiError from '@/backend/utils/apierror';
import { 
  sanitizeInput, 
  validateFiles, 
  getSecurityHeaders, 
  validateRequestSize,
  securityLog 
} from '@/backend/lib/security';

// ==========================================
// ✅ CONSTANTS
// ==========================================
const ALLOWED_CATEGORIES = [
  'Buying Tips', 'Selling Tips', 'Market Updates', 'First-Time Buyers',
  'Mortgage Advice', 'Home Maintenance', 'Neighborhood Guides',
  'Investment Properties', 'Luxury Homes'
];

const ALLOWED_STATUSES = ['draft', 'published', 'archived'];

const MAX_TITLE_LENGTH = 150;
const MIN_TITLE_LENGTH = 5;
const MAX_CONTENT_LENGTH = 50000;
const MIN_CONTENT_LENGTH = 100;

// ==========================================
// ✅ OBJECTID VALIDATOR
// ==========================================
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// ==========================================
// ✅ HELPER FUNCTIONS
// ==========================================
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const calculateReadTime = (content) => {
  const plainText = content.replace(/<[^>]*>/g, ' ');
  const words = plainText.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes < 1 ? 1 : minutes;
};

// ==========================================
// ✅ INPUT VALIDATORS
// ==========================================
const validators = {
  title: (value) => {
    if (!value || typeof value !== 'string') return 'Title is required';
    const trimmed = value.trim();
    if (trimmed.length < MIN_TITLE_LENGTH) return `Title must be at least ${MIN_TITLE_LENGTH} characters`;
    if (trimmed.length > MAX_TITLE_LENGTH) return `Title must not exceed ${MAX_TITLE_LENGTH} characters`;
    return null;
  },
  content: (value) => {
    if (!value || typeof value !== 'string') return 'Content is required';
    if (value.length < MIN_CONTENT_LENGTH) return `Content must be at least ${MIN_CONTENT_LENGTH} characters`;
    if (value.length > MAX_CONTENT_LENGTH) return 'Content is too long';
    return null;
  },
  category: (value) => {
    if (!value) return null;
    if (!ALLOWED_CATEGORIES.includes(value)) return `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`;
    return null;
  },
  status: (value) => {
    if (!value) return null;
    if (!ALLOWED_STATUSES.includes(value)) return `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`;
    return null;
  },
  slug: (value) => {
    if (!value) return null;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return 'Slug must be lowercase letters, numbers, and hyphens only';
    return null;
  }
};

// ==========================================
// ✅ EXTRACT IMAGES FROM FORM DATA
// ==========================================
const extractImageFields = (formData) => {
  const images = {};
  const keys = ['featuredImage', 'socialShareImage'];
  
  for (const key of keys) {
    const file = formData.get(key);
    if (file instanceof File && file.size > 0) {
      images[key] = file;
    }
  }
  return images;
};

// ==========================================
// ✅ MAIN HANDLER
// ==========================================
const updateBlogHandler = async (request, context, user) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    // STEP 1: REQUEST SIZE VALIDATION
    const sizeCheck = await validateRequestSize(request, 15);
    if (!sizeCheck.valid) {
      return NextResponse.json(
        { success: false, message: sizeCheck.error },
        { status: 413, headers: getSecurityHeaders() }
      );
    }

    await connectDB();

    const { id } = await context.params;

    // STEP 2: STRICT ID VALIDATION
    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
      securityLog('INVALID_BLOG_ID_UPDATE', { requestId, providedId: id });
      throw new ApiError(400, 'Invalid Blog ID format');
    }

    // STEP 3: FETCH EXISTING BLOG
    const existingBlog = await Blog.findById(id).select('featuredImage socialShareImage slug publishedAt status content points headers');
    if (!existingBlog) throw new ApiError(404, 'Blog not found');

    // STEP 4: PARSE FORM DATA / JSON BODY
    const contentType = request.headers.get('content-type') || '';
    let updateData = {};
    let newImages = {};

    if (contentType.includes('application/json')) {
      // Handle JSON Body
      let body;
      try {
        body = await request.json();
      } catch (error) {
        throw new ApiError(400, 'Invalid JSON data format');
      }

      // ✅ ADDED 'points' AND 'headers' HERE
      const allowedFields = ['title', 'content', 'excerpt', 'category', 'status', 'tags', 'slug', 'points', 'headers'];
      const errors = [];

      allowedFields.forEach(field => {
        if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
          if (field === 'tags' && Array.isArray(body[field])) {
            updateData[field] = body[field].map(t => String(t).trim()).filter(t => t.length > 0 && t.length <= 30).slice(0, 15);
          } else if (field === 'points' && Array.isArray(body[field])) {
            // ✅ PARSE POINTS FROM JSON
            updateData[field] = body[field].map(p => ({
              title: sanitizeInput(String(p.title || '').trim()),
              description: p.description ? sanitizeInput(String(p.description).trim()) : '',
            })).filter(p => p.title.length > 0).slice(0, 15);
          } else if (field === 'headers' && Array.isArray(body[field])) {
             // ✅ PARSE HEADERS FROM JSON
             updateData[field] = body[field].map(h => ({
               title: sanitizeInput(String(h.title || '').trim()),
               description: h.description ? sanitizeInput(String(h.description).trim()) : '',
               headerType: ['h2', 'h3', 'h4'].includes(h.headerType) ? h.headerType : 'h2',
             })).filter(h => h.title.length > 0).slice(0, 20);
          } else {
            updateData[field] = sanitizeInput(String(body[field]).trim());
          }
          const error = validators[field]?.(body[field]);
          if (error) errors.push(error);
        }
      });

      if (errors.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Validation failed', errors },
          { status: 400, headers: getSecurityHeaders() }
        );
      }
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      // Handle Form Data
      let formData;
      try {
        formData = await request.formData();
      } catch (error) {
        throw new ApiError(400, 'Invalid form data');
      }

      // ✅ ADDED 'points' AND 'headers' HERE
      const textFields = ['title', 'content', 'excerpt', 'category', 'status', 'tags', 'slug', 'points', 'headers'];
      const errors = [];

      textFields.forEach(field => {
        const val = formData.get(field);
        if (val === null || val === undefined || val === '') return;

        if (field === 'tags') {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              updateData[field] = parsed.map(t => String(t).trim()).filter(t => t.length > 0 && t.length <= 30).slice(0, 15);
            }
          } catch (e) {
            errors.push('Invalid tags format. Expected JSON array.');
          }
        } else if (field === 'points') {
          // ✅ PARSE POINTS FROM FORM DATA STRING
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              updateData[field] = parsed.map(p => ({
                title: sanitizeInput(String(p.title || '').trim()),
                description: p.description ? sanitizeInput(String(p.description).trim()) : '',
              })).filter(p => p.title.length > 0).slice(0, 15);
            }
          } catch (e) {
            errors.push('Invalid points format. Expected JSON array.');
          }
        } else if (field === 'headers') {
           // ✅ PARSE HEADERS FROM FORM DATA STRING
           try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              updateData[field] = parsed.map(h => ({
                title: sanitizeInput(String(h.title || '').trim()),
                description: h.description ? sanitizeInput(String(h.description).trim()) : '',
                headerType: ['h2', 'h3', 'h4'].includes(h.headerType) ? h.headerType : 'h2',
              })).filter(h => h.title.length > 0).slice(0, 20);
            }
          } catch (e) {
            errors.push('Invalid headers format. Expected JSON array.');
          }
        } else {
          updateData[field] = sanitizeInput(String(val).trim());
        }

        const error = validators[field]?.(val);
        if (error) errors.push(error);
      });

      if (errors.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Validation failed', errors },
          { status: 400, headers: getSecurityHeaders() }
        );
      }

      newImages = extractImageFields(formData);
    } else {
      // If no body is sent (e.g., only query params), throw error to prevent empty updates
      throw new ApiError(400, 'Unsupported content type or empty body. Please send JSON or Form Data.');
    }

    // STEP 5: SLUG UNIQUENESS CHECK
    if (updateData.slug && updateData.slug !== existingBlog.slug) {
      const slugExists = await Blog.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      }).lean();

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: `Slug "${updateData.slug}" is already taken.` },
          { status: 409, headers: getSecurityHeaders() }
        );
      }
    }

    // STEP 6: RECALCULATE READ TIME IF CONTENT OR POINTS CHANGED
    if (updateData.content || updateData.points || updateData.headers) {
      // Combine content and points/headers text to calculate accurate read time
      let textForReadTime = updateData.content || existingBlog.content || '';
      
      const pointsToConsider = updateData.points || existingBlog.points || [];
      pointsToConsider.forEach(p => {
        if (p.title) textForReadTime += ' ' + p.title;
        if (p.description) textForReadTime += ' ' + p.description;
      });

      const headersToConsider = updateData.headers || existingBlog.headers || [];
      headersToConsider.forEach(h => {
        if (h.title) textForReadTime += ' ' + h.title;
        if (h.description) textForReadTime += ' ' + h.description;
      });

      updateData.readTime = calculateReadTime(textForReadTime);
    }

    // STEP 7: HANDLE PUBLISH STATUS & PUBLISHED AT DATE
    if (updateData.status === 'published' && !existingBlog.publishedAt) {
      updateData.publishedAt = new Date();
    }

    // STEP 8: IMAGE UPLOAD & REPLACEMENT LOGIC
    const imageFieldsToProcess = ['featuredImage', 'socialShareImage'];
    let imageModified = false;

    for (const field of imageFieldsToProcess) {
      if (newImages[field]) {
        const fileValidation = validateFiles([newImages[field]]);
        if (!fileValidation.valid) {
          return NextResponse.json(
            { success: false, message: `${field} validation failed`, errors: fileValidation.errors },
            { status: 400, headers: getSecurityHeaders() }
          );
        }

        try {
          const uploaded = await uploadMultipleImages([newImages[field]], 'blogs', {
            maxWidth: 1600,
            maxHeight: 900,
            quality: 85,
          });

          updateData[field] = {
            url: uploaded[0].url,
            public_id: uploaded[0].public_id,
          };

          if (existingBlog[field]?.public_id) {
            try {
              await deleteImage(existingBlog[field].public_id);
            } catch (err) {
              console.error(`Failed to delete old ${field}:`, err);
            }
          }

          imageModified = true;
        } catch (error) {
          securityLog('BLOG_IMAGE_UPLOAD_FAILED_UPDATE', { requestId, blogId: id, error: error.message });
          return NextResponse.json(
            { success: false, message: `Failed to upload ${field}. Please try again.` },
            { status: 500, headers: getSecurityHeaders() }
          );
        }
      }
    }

    // STEP 9: DATABASE UPDATE
    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'No valid fields provided to update');
    }

    updateData.updatedBy = user._id;

    // ✅ Console log to verify what is being sent to DB
    console.log("[BLOG_UPDATE] Updating DB with:", JSON.stringify(updateData, null, 2));

    // Using $set to strictly force MongoDB to update these fields
    const updatedBlog = await Blog.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    if (!updatedBlog) throw new ApiError(404, 'Blog not found after update');

    await updatedBlog.populate('author', 'name email avatar');

    // STEP 10: SECURITY LOG
    securityLog('BLOG_UPDATED', {
      requestId,
      adminId: user._id,
      blogId: id,
      updatedFields: Object.keys(updateData),
      imagesUpdated: imageModified ? imageFieldsToProcess.filter(f => newImages[f]) : [],
      duration: Date.now() - startTime,
    });

    // STEP 11: RESPONSE
    const obj = updatedBlog.toObject();

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      updatedFields: Object.keys(updateData),
      data: obj,
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

    securityLog('UPDATE_BLOG_ERROR', {
      requestId,
      userId: user?._id,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      duration,
    });

    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = (statusCode === 500 && process.env.NODE_ENV === 'production')
      ? 'Failed to update blog'
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
// ✅ EXPORTS — PUT & PATCH both accepted
// ==========================================
const protectedHandler = withAdminAuth(updateBlogHandler, {
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
  message: 'Too many update attempts. Please try again later.',
});

export const PUT = protectedHandler;
export const PATCH = protectedHandler;

const methodNotAllowed = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed on this endpoint' },
    { status: 405, headers: { ...getSecurityHeaders(), 'Allow': 'PUT, PATCH' } }
  );
};

export const GET = methodNotAllowed;
export const POST = methodNotAllowed;
export const DELETE = methodNotAllowed;