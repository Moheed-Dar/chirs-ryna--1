import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import Blog from '@/backend/models/blog';
import User from '@/backend/models/user';
import { 
  getSecurityHeaders, 
  securityLog 
} from '@/backend/lib/security';

// ==========================================
// ✅ GET ALL BLOGS (With Pagination, Filtering & Search)
// ==========================================
export const GET = async (request) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    // STEP 1: Extract query parameters
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const status = searchParams.get('status') || null;
    const category = searchParams.get('category') || null;
    const search = searchParams.get('search') || null;

    // Sorting (default: newest first)
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    // STEP 2: Build Mongoose Query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      // Search in title, content, or tags
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // STEP 3: Execute Query
    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .lean();

    // STEP 4: Get Total Count for Pagination
    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    // STEP 5: Build Response
    const response = {
      success: true,
      count: blogs.length,
      totalBlogs,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      data: blogs,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        ...getSecurityHeaders(),
        'X-Request-Id': requestId,
        'X-Response-Time': `${Date.now() - startTime}ms`,
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    
    securityLog('BLOG_FETCH_ERROR', {
      requestId,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      duration,
    });

    const errorResponse = {
      success: false,
      message: 'Failed to fetch blogs',
      ...(process.env.NODE_ENV === 'development' && {
        error: { name: error.name, message: error.message, stack: error.stack }
      }),
    };

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: { ...getSecurityHeaders(), 'X-Request-Id': requestId }
    });
  }
};

// Handle other methods if someone accidentally tries to POST/PUT here
export const POST = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405, headers: getSecurityHeaders() }
  );
};