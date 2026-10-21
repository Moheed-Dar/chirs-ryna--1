import { NextResponse } from 'next/server';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/user';  
import Property from '@/backend/models/property';
import ApiError from '@/backend/utils/apierror';
import { getSecurityHeaders, securityLog } from '@/backend/lib/security';

// ==========================================
// ✅ MONGODB OBJECTID VALIDATOR
// (DB hit save karo agar ID hi invalid hai)
// ==========================================
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// ==========================================
// ✅ MAIN HANDLER
// ==========================================
const getPropertyById = async (request, context) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    const { id } = await context.params;
    
    // ==========================================
    // 1. STRICT ID VALIDATION
    // ==========================================
    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
      securityLog('INVALID_PROPERTY_ID', {
        requestId,
        providedId: id,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      throw new ApiError(400, 'Invalid Property ID format');
    }

    // ==========================================
    // 2. DATABASE FETCH + ATOMIC VIEW INCREMENT
    // ==========================================
    // ✅ $inc is atomic: Race condition nahi hogi
    // ✅ new : true: Updated document (viewsCount + 1) return hoga
    // ✅ lean(): Fast plain JS object return karega
    const property = await Property.findOneAndUpdate(
      { 
        _id: id, 
        isPublished: true // Sirf published property hi update/fetch karo
      },
      { $inc: { viewsCount: 1 } }, // ✅ Safe View Counting
      { 
        returnDocument: 'after',
        runValidators: false 
      }
    )
    .select('-__v -tokenVersion') // Sensitive/useless fields exclude
    .populate('addedBy', 'name email phone avatar')
    .lean();

    // ==========================================
    // 3. 404 CHECK
    // ==========================================
    if (!property) {
      // Log 404s to detect scraping or fuzzing attacks
      securityLog('PROPERTY_404_ATTEMPT', {
        requestId,
        propertyId: id,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      throw new ApiError(404, 'Property not found or has been removed');
    }

    // ==========================================
    // 4. TRANSFORM DATA (Consistent Structure)
    // ==========================================
    const orderedProperty = {
      _id: property._id,                                    
      propertyCode: property.propertyCode,                           
      title: property.title,
      description: property.description,
      price: property.price,
      priceType: property.priceType,
      currency: property.currency,
      location: property.location,
      city: property.city,
      area: property.area,
      address: property.address,
      coordinates: {
        latitude: property.latitude,
        longitude: property.longitude
      },
      propertyType: property.propertyType,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      kitchens: property.kitchens,
      areaSize: property.areaSize,
      areaUnit: property.areaUnit,
      floors: property.floors,
      yearBuilt: property.yearBuilt,
      features: property.features || [],
      amenities: property.amenities || [],
      images: property.images || [],
      thumbnail: property.thumbnail,
      status: property.status,
      isFeatured: property.isFeatured,
      contact: {
        name: property.contactName,
        phone: property.contactPhone,
        email: property.contactEmail
      },
      addedBy: property.addedBy,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      viewsCount: property.viewsCount || 0, // ✅ Updated count return hoga
      leadsCount: property.leadsCount || 0
    };

    // ==========================================
    // 5. RESPONSE
    // ==========================================
    return NextResponse.json(
      {
        success: true,
        message: 'Property fetched successfully',
        data: orderedProperty,
      },
      { 
        status: 200,
        headers: {
          ...getSecurityHeaders(),
          // ✅ Single item pages ko zyada cache kar sakte hain
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
          'X-Request-Id': requestId,
          'X-Response-Time': `${Date.now() - startTime}ms`,
        }
      }
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    
    // 404 ko normal log mat karo, sirf 500 ko security log karo
    if (error.statusCode !== 404) {
      securityLog('GET_PROPERTY_BY_ID_ERROR', {
        requestId,
        error: error.message,
        duration,
      });
    }

    const statusCode = error.statusCode || 500;
    // Production mein 500 ka exact message hide karo
    const message = (statusCode === 500 && process.env.NODE_ENV === 'production') 
      ? 'Internal Server Error' 
      : error.message;
      
    return NextResponse.json(
      {
        success: false,
        message: message,
      },
      { 
        status: statusCode,
        headers: {
          ...getSecurityHeaders(),
          'Cache-Control': 'no-store', // Error pe cache mat karo
          'X-Request-Id': requestId,
        }
      }
    );
  }
};

// ==========================================
// ✅ EXPORT GET
// ==========================================
export const GET = getPropertyById;

// ==========================================
// ✅ BLOCK OTHER METHODS (Security)
// ==========================================
const methodNotAllowed = () => {
  return NextResponse.json(
    { success: false, message: 'Method not allowed on this endpoint' },
    { status: 405, headers: { ...getSecurityHeaders(), 'Allow': 'GET' } }
  );
};

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const PATCH = methodNotAllowed;