import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Blog from '@/backend/models/blog';
import { withAdminAuth } from '@/backend/middleware/auth';
import { uploadMultipleImages } from '@/backend/lib/cloudinary';
import ApiError from '@/backend/utils/apierror';
import { 
  sanitizeInput, 
  validateFiles, 
  getSecurityHeaders, 
  validateRequestSize,
  securityLog 
} from '@/backend/lib/security';
import { uploadRateLimiter } from '@/backend/lib/rateLimiter';

// ==========================================
// ✅ CONSTANTS
// ==========================================
const ALLOWED_CATEGORIES = [
  'Buying Tips', 'Selling Tips', 'Market Updates', 'First-Time Buyers',
  'Mortgage Advice', 'Home Maintenance', 'Neighborhood Guides',
  'Investment Properties', 'Luxury Homes'
];

const MAX_TITLE_LENGTH = 150;
const MIN_TITLE_LENGTH = 5;
const MAX_CONTENT_LENGTH = 50000;
const MIN_CONTENT_LENGTH = 100;

// ==========================================
// ✅ HELPER FUNCTIONS
// ==========================================
const generateSlug = (title) => {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
};

const calculateReadTime = (content, headers = [], points = []) => {
  let totalText = content || '';
  headers.forEach(h => { if (h.title) totalText += ' ' + h.title; if (h.description) totalText += ' ' + h.description; });
  points.forEach(p => { if (p.title) totalText += ' ' + p.title; if (p.description) totalText += ' ' + p.description; });
  const plainText = totalText.replace(/<[^>]*>/g, ' ');
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
    if (!value) return 'Category is required';
    if (!ALLOWED_CATEGORIES.includes(value)) return `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`;
    return null;
  },
  status: (value) => {
    if (!value) return null;
    if (!['draft', 'published', 'archived'].includes(value)) return 'Invalid status';
    return null;
  },
  headers: (value) => {
    if (!value) return null;
    if (!Array.isArray(value)) return 'Headers must be an array';
    if (value.length > 20) return 'Maximum 20 headers allowed';
    for (let i = 0; i < value.length; i++) {
      const h = value[i];
      if (!h || typeof h !== 'object') return `Header at index ${i} must be an object`;
      if (!h.title || typeof h.title !== 'string') return `Header at index ${i}: title is required`;
      if (h.title.trim().length < 2) return `Header at index ${i}: title must be at least 2 characters`;
      if (h.title.trim().length > 200) return `Header at index ${i}: title max 200 characters`;
      if (h.description !== undefined && h.description !== null) {
        if (typeof h.description !== 'string') return `Header at index ${i}: description must be a string`;
        if (h.description.length > 10000) return `Header at index ${i}: description too long`;
      }
      if (h.headerType !== undefined && !['h2', 'h3', 'h4'].includes(h.headerType)) return `Header at index ${i}: headerType must be h2, h3, or h4`;
    }
    return null;
  },
  points: (value) => {
    if (!value) return null;
    if (!Array.isArray(value)) return 'Points must be an array';
    if (value.length > 15) return 'Maximum 15 points allowed';
    for (let i = 0; i < value.length; i++) {
      const p = value[i];
      if (!p || typeof p !== 'object') return `Point at index ${i} must be an object`;
      if (!p.title || typeof p.title !== 'string') return `Point at index ${i}: title is required`;
      if (p.title.trim().length < 2) return `Point at index ${i}: title must be at least 2 characters`;
      if (p.title.trim().length > 200) return `Point at index ${i}: title max 200 characters`;
      if (p.description !== undefined && p.description !== null) {
        if (typeof p.description !== 'string') return `Point at index ${i}: description must be a string`;
        if (p.description.length > 500) return `Point at index ${i}: description max 500 characters`;
      }
    }
    return null;
  }
};

// ==========================================
// ✅ PARSE AND VALIDATE FORM DATA
// ==========================================
const parseAndValidateFormData = (formData, user) => {
  const errors = [];
  const data = {};

  const fields = ['title', 'content', 'excerpt', 'category', 'status', 'tags', 'publishedAt'];
  fields.forEach(field => { data[field] = formData.get(field); });

  // ==========================================
  // 🔥 DEBUG: Log raw form data keys
  // ==========================================
  console.log('🔥 ================================');
  console.log('🔥 ALL FORM DATA KEYS:');
  for (const [key, value] of formData.entries()) {
    if (value instanceof File || value instanceof Blob) {
      console.log(`🔥   ${key}: [File/Blob - size: ${value.size}]`);
    } else {
      console.log(`🔥   ${key}: "${value}"`);
    }
  }
  console.log('🔥 ================================');

  // Parse headers
  const headersRaw = formData.get('headers');
  console.log('🔥 headersRaw:', headersRaw);
  if (headersRaw) {
    try { data.headers = JSON.parse(headersRaw); console.log('🔥 headers parsed:', data.headers); }
    catch (e) { errors.push('Invalid headers format. Expected JSON array.'); console.log('🔥 headers parse ERROR:', e.message); }
  } else { data.headers = []; }

  // ✅ Parse points
  const pointsRaw = formData.get('points');
  console.log('🔥 pointsRaw:', pointsRaw);
  console.log('🔥 pointsRaw type:', typeof pointsRaw);
  if (pointsRaw) {
    try { data.points = JSON.parse(pointsRaw); console.log('🔥 points parsed:', JSON.stringify(data.points)); }
    catch (e) { errors.push('Invalid points format. Expected JSON array.'); console.log('🔥 points parse ERROR:', e.message); }
  } else { data.points = []; console.log('🔥 pointsRaw is NULL/empty — points set to []'); }

  // Parse individual header fields
  if (!headersRaw) {
    const headerMap = {};
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^headers\[(\d+)\]\[(\w+)\]$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        if (!headerMap[index]) headerMap[index] = {};
        headerMap[index][field] = value;
      }
    }
    if (Object.keys(headerMap).length > 0) {
      data.headers = Object.keys(headerMap).sort((a, b) => parseInt(a) - parseInt(b)).map(k => headerMap[k]);
      console.log('🔥 headers from individual fields:', data.headers);
    }
  }

  // ✅ Parse individual point fields
  if (!pointsRaw) {
    const pointMap = {};
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^points\[(\d+)\]\[(\w+)\]$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        if (!pointMap[index]) pointMap[index] = {};
        pointMap[index][field] = value;
      }
    }
    if (Object.keys(pointMap).length > 0) {
      data.points = Object.keys(pointMap).sort((a, b) => parseInt(a) - parseInt(b)).map(k => pointMap[k]);
      console.log('🔥 points from individual fields:', data.points);
    }
  }

  // Image URLs
  data.featuredImageUrl = formData.get('featuredImageUrl') || null;
  data.featuredImagePublicId = formData.get('featuredImagePublicId') || null;
  data.socialShareImageUrl = formData.get('socialShareImageUrl') || null;
  data.socialShareImagePublicId = formData.get('socialShareImagePublicId') || null;

  // Defaults
  data.status = data.status || 'draft';
  data.excerpt = data.excerpt || '';
  data.tags = data.tags || '[]';
  data.publishedAt = data.publishedAt || null;

  // Validate required
  const requiredFields = ['title', 'content', 'category'];
  requiredFields.forEach(field => {
    const error = validators[field]?.(data[field]);
    if (error) errors.push(error);
  });

  // Validate optional
  if (data.status) { const error = validators.status(data.status); if (error) errors.push(error); }
  if (data.headers && data.headers.length > 0) { const error = validators.headers(data.headers); if (error) errors.push(error); }
  if (data.points && data.points.length > 0) { const error = validators.points(data.points); if (error) errors.push(error); }

  // Parse tags
  let tags = [];
  if (data.tags) {
    try {
      const parsed = JSON.parse(data.tags);
      if (Array.isArray(parsed)) {
        tags = parsed.map(t => String(t).trim()).filter(t => t.length > 0 && t.length <= 30);
        if (tags.length > 15) errors.push('Maximum 15 tags allowed');
       
      }
    } catch (e) { errors.push('Invalid tags format. Expected JSON array.');  }
  }

  // ==========================================
  // 🔥 DEBUG: Final validation result
  // ==========================================

  return { valid: errors.length === 0, errors, data: { ...data, tags } };
};

// ==========================================
// ✅ EXTRACT IMAGES
// ==========================================
const extractImages = (formData) => {
  let imageFiles = [];
  const keys = ['featuredImage', 'socialShareImage', 'images'];
  for (const key of keys) {
    const file = formData.get(key);
    if (file instanceof File && file.size > 0) { imageFiles.push({ field: key, file }); }
  }
  // Header images
  for (const [key, value] of formData.entries()) {
    const match = key.match(/^headerImage\[(\d+)\]$/);
    if (match && value instanceof File && value.size > 0) { imageFiles.push({ field: `headerImage_${match[1]}`, file: value }); }
  }
  if (imageFiles.length === 0) {
    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob && value.size > 0) { imageFiles.push({ field: key, file: value }); }
    }
  }
  return imageFiles;
};

// ==========================================
// ✅ MAIN HANDLER
// ==========================================
const createBlogPost = async (request, context, user) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    const sizeCheck = await validateRequestSize(request, 15);
    if (!sizeCheck.valid) { return NextResponse.json({ success: false, message: sizeCheck.error }, { status: 413, headers: getSecurityHeaders() }); }

    await connectDB();

    let formData;
    try { formData = await request.formData(); }
    catch (error) { return NextResponse.json({ success: false, message: 'Invalid form data' }, { status: 400, headers: getSecurityHeaders() }); }

    const uploadRateCheck = uploadRateLimiter(request);
    if (!uploadRateCheck.allowed) {
      const response = NextResponse.json({ success: false, message: uploadRateCheck.message }, { status: 429, headers: getSecurityHeaders() });
      response.headers.set('Retry-After', String(uploadRateCheck.retryAfter));
      return response;
    }

    const validation = parseAndValidateFormData(formData, user);
    if (!validation.valid) { return NextResponse.json({ success: false, message: 'Validation failed', errors: validation.errors }, { status: 400, headers: getSecurityHeaders() }); }

    const data = validation.data;

    // ==========================================
    // 🔥 DEBUG: Log data after validation
    // ==========================================
    console.log('🔥 DATA AFTER VALIDATION:');
    console.log('🔥   data.points:', JSON.stringify(data.points));
    console.log('🔥   data.tags:', data.tags);
    console.log('🔥   data.headers:', JSON.stringify(data.headers));

    // Extract images
    const imageObjects = extractImages(formData);
    const rawFiles = imageObjects.map(obj => obj.file);
    if (rawFiles.length > 0) {
      const fileValidation = validateFiles(rawFiles);
      if (!fileValidation.valid) { return NextResponse.json({ success: false, message: 'Image validation failed', errors: fileValidation.errors }, { status: 400, headers: getSecurityHeaders() }); }
    }

    // Upload images
    let uploadedImages = [];
    let featuredImageObj = null;
    let socialShareImageObj = null;
    const headerImageMap = {};

    if (rawFiles.length > 0) {
      try {
        uploadedImages = await uploadMultipleImages(rawFiles, 'blogs', { maxWidth: 1600, maxHeight: 900, quality: 85 });
        imageObjects.forEach((obj, index) => {
          if (obj.field === 'featuredImage' || obj.field === 'images') { featuredImageObj = uploadedImages[index]; }
          else if (obj.field === 'socialShareImage') { socialShareImageObj = uploadedImages[index]; }
          else if (obj.field.startsWith('headerImage_')) { const headerIndex = obj.field.replace('headerImage_', ''); headerImageMap[headerIndex] = uploadedImages[index]; }
        });
        if (!featuredImageObj && uploadedImages.length > 0) { featuredImageObj = uploadedImages[0]; }
      } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to upload images.' }, { status: 500, headers: getSecurityHeaders() });
      }
    }

    // Build featuredImage
    let finalFeaturedImage = null;
    if (featuredImageObj) { finalFeaturedImage = { url: featuredImageObj.url, public_id: featuredImageObj.public_id }; }
    else if (data.featuredImageUrl) { finalFeaturedImage = { url: data.featuredImageUrl.trim(), public_id: data.featuredImagePublicId || 'manual_upload' }; }
    if (!finalFeaturedImage) { return NextResponse.json({ success: false, message: 'Featured image is required' }, { status: 400, headers: getSecurityHeaders() }); }

    let finalSocialShareImage = null;
    if (socialShareImageObj) { finalSocialShareImage = { url: socialShareImageObj.url, public_id: socialShareImageObj.public_id }; }
    else if (data.socialShareImageUrl) { finalSocialShareImage = { url: data.socialShareImageUrl.trim(), public_id: data.socialShareImagePublicId || 'manual_upload' }; }

    // Generate slug
    let baseSlug = generateSlug(data.title);
    let finalSlug = baseSlug;
    let slugCounter = 1;
    while (await Blog.findOne({ slug: finalSlug }).lean()) { finalSlug = `${baseSlug}-${slugCounter}`; slugCounter++; }

    // Read time
    const readTime = calculateReadTime(data.content, data.headers, data.points);

    // Process headers
    const processedHeaders = (data.headers || []).map((header, index) => {
      const processed = {
        title: sanitizeInput(header.title),
        description: header.description ? sanitizeInput(header.description) : '',
        headerType: header.headerType || 'h2',
        order: index + 1,
      };
      if (headerImageMap[String(index)]) { processed.image = { url: headerImageMap[String(index)].url, public_id: headerImageMap[String(index)].public_id }; }
      return processed;
    });

    // ✅ Process points
    const processedPoints = (data.points || []).map((point, index) => ({
      title: sanitizeInput(point.title),
      description: point.description ? sanitizeInput(point.description) : '',
      order: index + 1,
    }));

    // ==========================================
    // 🔥 DEBUG: Processed data
    // ==========================================
    console.log('🔥 PROCESSED POINTS:', JSON.stringify(processedPoints));
    console.log('🔥 PROCESSED HEADERS:', JSON.stringify(processedHeaders));

    // Prepare data
    const sanitizedData = {
      title: sanitizeInput(data.title),
      slug: finalSlug,
      content: sanitizeInput(data.content),
      excerpt: sanitizeInput(data.excerpt),
      featuredImage: finalFeaturedImage,
      socialShareImage: finalSocialShareImage || undefined,
      author: user._id,
      category: sanitizeInput(data.category),
      tags: data.tags,
      status: sanitizeInput(data.status),
      publishedAt: data.status === 'published' ? (data.publishedAt || new Date()) : null,
      readTime,
      headers: processedHeaders.length > 0 ? processedHeaders : undefined,
      points: processedPoints.length > 0 ? processedPoints : undefined,
    };

    Object.keys(sanitizedData).forEach(key => sanitizedData[key] === undefined && delete sanitizedData[key]);

    // ==========================================
    // 🔥 DEBUG: Final sanitizedData
    // ==========================================
    console.log('🔥 FINAL sanitizedData:');
    console.log('🔥   points:', JSON.stringify(sanitizedData.points));
    console.log('🔥   tags:', sanitizedData.tags);
    console.log('🔥   keys present:', Object.keys(sanitizedData));
    console.log('🔥 ================================');

    // Create
    const blog = await Blog.create(sanitizedData);

    // ==========================================
    // 🔥 DEBUG: Blog created — check points
    // ==========================================
    console.log('🔥 BLOG CREATED:');
    console.log('🔥   blog.points:', JSON.stringify(blog.points));
    console.log('🔥   blog.tags:', blog.tags);
    console.log('🔥   blog._id:', blog._id);

    await blog.populate('author', 'name email avatar');

    securityLog('BLOG_CREATED', {
      requestId, userId: user._id, blogId: blog._id, title: blog.title, status: blog.status,
      headersCount: processedHeaders.length, pointsCount: processedPoints.length,
      imageSource: featuredImageObj ? 'upload' : 'url', duration: Date.now() - startTime,
    });

    const blogObject = blog.toObject();

    // ==========================================
    // 🔥 DEBUG: Final response data
    // ==========================================
    console.log('🔥 FINAL RESPONSE blogObject:');
    console.log('🔥   points:', JSON.stringify(blogObject.points));
    console.log('🔥   tags:', blogObject.tags);
    console.log('🔥 ================================');

    return NextResponse.json({ success: true, message: 'Blog post created successfully', data: blogObject }, { status: 201, headers: { ...getSecurityHeaders(), 'X-Request-Id': requestId, 'X-Response-Time': `${Date.now() - startTime}ms` } });

  } catch (error) {
    const duration = Date.now() - startTime;
    securityLog('BLOG_CREATE_ERROR', { requestId, userId: user._id, error: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, duration });

    console.error('🔥 CREATE ERROR:', error.message);
    console.error('🔥 ERROR STACK:', error.stack);

    let statusCode = 500;
    let message = 'Internal Server Error';
    if (error instanceof ApiError) { statusCode = error.statusCode; message = error.message; }
    else if (error.name === 'MongoError' || error.name === 'MongoServerError') { if (error.code === 11000) { statusCode = 409; message = 'Duplicate slug'; } }
    else if (error.name === 'ValidationError') { statusCode = 400; message = 'Data validation failed'; }

    return NextResponse.json({ success: false, message, ...(process.env.NODE_ENV === 'development' && { error: { name: error.name, message: error.message, stack: error.stack } }) }, { status: statusCode, headers: { ...getSecurityHeaders(), 'X-Request-Id': requestId } });
  }
};

// ==========================================
// ✅ EXPORT
// ==========================================
export const POST = withAdminAuth(createBlogPost, { windowMs: 15 * 60 * 1000, maxRequests: 20, message: 'Blog creation limit reached.' });

export const GET = () => { return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405, headers: getSecurityHeaders() }); };