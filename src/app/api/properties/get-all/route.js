// import { NextResponse } from 'next/server';
// import connectDB from '@/backend/lib/db';
// import Property from '@/backend/models/property';
// import ApiError from '@/backend/utils/apierror';

// const getProperties = async (request) => {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);

//     // ==========================================
//     // 1. PAGINATION & FILTERS EXTRACT
//     // ==========================================
//     const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
//     const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit')) || 10));
//     const skip = (page - 1) * limit;

//     // Filters
//     const city = searchParams.get('city') || '';
//     const propertyType = searchParams.get('propertyType') || '';
//     const priceType = searchParams.get('priceType') || '';
//     const status = searchParams.get('status') || 'available';
//     const search = searchParams.get('search') || '';
//     const isFeatured = searchParams.get('isFeatured');

//     // Build Query
//     const query = {
//       isPublished: true, // Sirf published properties dikhao public ko
//     };

//     if (city) query.city = { $regex: city, $options: 'i' };
//     if (propertyType) query.propertyType = propertyType;
//     if (priceType) query.priceType = priceType;
//     if (status) query.status = status;
//     if (isFeatured === 'true') query.isFeatured = true;

//     // Text Search (Title, Description, Location)
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { location: { $regex: search, $options: 'i' } },
//         { propertyCode: { $regex: search, $options: 'i' } },
//       ];
//     }

//     // ==========================================
//     // 2. DATABASE FETCH
//     // ==========================================
//     const totalProperties = await Property.countDocuments(query);
//     const properties = await Property.find(query)
//       .sort({ createdAt: -1 }) // Newest first
//       .skip(skip)
//       .limit(limit)
//       .populate('addedBy', 'name email phone avatar');

//     // ==========================================
//     // 3. TRANSFORM DATA (Same as POST Response)
//     // ==========================================
//     const transformedProperties = properties.map(property => {
//       const obj = property.toObject();
//       return {
//         _id: obj._id,
//         propertyCode: obj.propertyCode,
//         title: obj.title,
//         description: obj.description,
//         price: obj.price,
//         priceType: obj.priceType,
//         currency: obj.currency,
//         location: obj.location,
//         city: obj.city,
//         area: obj.area,
//         address: obj.address,
//         coordinates: {
//           latitude: obj.latitude,
//           longitude: obj.longitude
//         },
//         propertyType: obj.propertyType,
//         bedrooms: obj.bedrooms,
//         bathrooms: obj.bathrooms,
//         kitchens: obj.kitchens,
//         areaSize: obj.areaSize,
//         areaUnit: obj.areaUnit,
//         floors: obj.floors,
//         yearBuilt: obj.yearBuilt,
//         features: obj.features,
//         amenities: obj.amenities,
//         images: obj.images,
//         thumbnail: obj.thumbnail,
//         status: obj.status,
//         isFeatured: obj.isFeatured,
//         isPublished: obj.isPublished,
//         contact: {
//           name: obj.contactName,
//           phone: obj.contactPhone,
//           email: obj.contactEmail
//         },
//         addedBy: obj.addedBy,
//         createdAt: obj.createdAt,
//         updatedAt: obj.updatedAt,
//         viewsCount: obj.viewsCount,
//         leadsCount: obj.leadsCount
//       };
//     });

//     // ==========================================
//     // 4. PAGINATION META DATA
//     // ==========================================
//     const pagination = {
//       currentPage: page,
//       totalPages: Math.ceil(totalProperties / limit),
//       totalItems: totalProperties,
//       itemsPerPage: limit,
//       hasNextPage: page < Math.ceil(totalProperties / limit),
//       hasPrevPage: page > 1,
//     };

//     // ==========================================
//     // 5. RESPONSE (TOTAL ON TOP)
//     // ==========================================
//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Properties fetched successfully',
//         total: totalProperties, // ✅ TOP PAR TOTAL COUNT
//         data: transformedProperties,
//         pagination: pagination,
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     const message = error.message || 'Internal Server Error';
//     return NextResponse.json(
//       {
//         success: false,
//         message: message,
//       },
//       { status: statusCode }
//     );
//   }
// };

// export const GET = getProperties;












// import { NextResponse } from "next/server";
// import connectDB from "@/backend/lib/db";
// import User from "@/backend/models/user";
// import Property from "@/backend/models/property";
// import ApiError from "@/backend/utils/apierror";
// import {
//   getSecurityHeaders,
//   securityLog,
//   sanitizeInput,
// } from "@/backend/lib/security";

// // ==========================================
// // ✅ ReDoS PROTECTION HELPER
// // (Regex mein special characters escape karta hai)
// // ==========================================
// const escapeRegex = (str) => {
//   if (!str || typeof str !== "string") return "";
//   return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// };

// // ==========================================
// // ✅ ALLOWED FILTERS (Whitelist Approach)
// // ==========================================
// const ALLOWED_PROPERTY_TYPES = [
//   "house",
//   "apartment",
//   "villa",
//   "penthouse",
//   "plot",
//   "commercial",
//   "office",
//   "shop",
//   "warehouse",
//   "farmhouse",
//   "flat",
//   "studio",
// ];

// const ALLOWED_PRICE_TYPES = ["sale", "rent"];
// const ALLOWED_SORT_FIELDS = ["createdAt", "price", "title", "viewsCount"];
// const ALLOWED_SORT_ORDERS = ["asc", "desc"];

// // ==========================================
// // ✅ MAIN HANDLER
// // ==========================================
// const getProperties = async (request) => {
//   // console.log("=== ROUTE HIT ===");
//   // console.log("URL:", request.url);
//   // console.log("Headers:", JSON.stringify(Object.fromEntries(request.headers)));
//   const startTime = Date.now();
//   const requestId =
//     crypto.randomUUID?.() ||
//     `${Date.now()}-${Math.random().toString(36).slice(2)}`;

//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);

//     // ==========================================
//     // 1. PAGINATION & SORTING EXTRACT (Strict Validation)
//     // ==========================================
//     let page = parseInt(searchParams.get("page")) || 1;
//     let limit = parseInt(searchParams.get("limit")) || 10;

//     // Force limits (Security: Prevent memory exhaustion)
//     page = Math.max(1, Math.min(1000, page));
//     limit = Math.max(1, Math.min(100, limit)); // Max 100 items per request
//     const skip = (page - 1) * limit;

//     // Sorting (Default: Newest first)
//     const sortField = ALLOWED_SORT_FIELDS.includes(searchParams.get("sortBy"))
//       ? searchParams.get("sortBy")
//       : "createdAt";
//     const sortOrder = ALLOWED_SORT_ORDERS.includes(
//       searchParams.get("sortOrder"),
//     )
//       ? searchParams.get("sortOrder")
//       : "desc";

//     // ==========================================
//     // 2. FILTERS EXTRACT & SANITIZE
//     // ==========================================
//     const rawCity = searchParams.get("city") || "";
//     const rawPropertyType = searchParams.get("propertyType") || "";
//     const rawPriceType = searchParams.get("priceType") || "";
//     const rawStatus = searchParams.get("status") || "";
//     const rawSearch = searchParams.get("search") || "";
//     const rawIsFeatured = searchParams.get("isFeatured");

//     // Sanitize Strings (Remove XSS/Injection payloads)
//     const city = sanitizeInput(rawCity).trim();
//     const search = sanitizeInput(rawSearch).trim();

//     // Validate Enums strictly
//     const propertyType = ALLOWED_PROPERTY_TYPES.includes(
//       rawPropertyType.toLowerCase(),
//     )
//       ? rawPropertyType.toLowerCase()
//       : "";
//     const priceType = ALLOWED_PRICE_TYPES.includes(rawPriceType.toLowerCase())
//       ? rawPriceType.toLowerCase()
//       : "";

//     // Status validation
//     let status = rawStatus ? rawStatus.toLowerCase() : "";
//     const validStatuses = [
//       "available",
//       "sold",
//       "rented",
//       "pending",
//       "unavailable",
//     ];
//     if (status && status !== "all" && validStatuses.includes(status)) {
//       query.status = status;
//     }

//     // ==========================================
//     // 3. BUILD SECURE QUERY
//     // ==========================================
//     const query = {
//       isPublished: true, // Sirf published properties dikhao public ko
//     };
//     if (city) query.city = { $regex: `^${escapeRegex(city)}$`, $options: "i" };
//     if (propertyType) query.propertyType = propertyType;
//     if (priceType) query.priceType = priceType;
//     if (statusFilter) query.status = statusFilter; // only if we have a specific status
//     if (rawIsFeatured === "true") query.isFeatured = true;

//     // ✅ SECURE REGEX (ReDoS Protected)
//     if (city && city.length <= 100) {
//       query.city = { $regex: `^${escapeRegex(city)}$`, $options: "i" };
//     }

//     if (propertyType) {
//       query.propertyType = propertyType;
//     }

//     if (priceType) {
//       query.priceType = priceType;
//     }

//     if (status) {
//       query.status = status;
//     }

//     if (rawIsFeatured === "true") {
//       query.isFeatured = true;
//     }

//     // ✅ SECURE TEXT SEARCH (ReDoS Protected)
//     if (search && search.length <= 200) {
//       const safeSearchRegex = { $regex: escapeRegex(search), $options: "i" };
//       query.$or = [
//         { title: safeSearchRegex },
//         { description: safeSearchRegex },
//         { location: safeSearchRegex },
//         { propertyCode: safeSearchRegex },
//       ];
//     } else if (search && search.length > 200) {
//       // Security Log: Suspiciously long search query
//       securityLog("SUSPICIOUS_SEARCH_QUERY", {
//         requestId,
//         searchLength: search.length,
//         ip: request.headers.get("x-forwarded-for") || "unknown",
//       });
//     }

//     // ==========================================
//     // 4. DATABASE FETCH (Optimized)
//     // ==========================================
//     // Use lean() for performance (Read-only public data)
//     const [totalProperties, properties] = await Promise.all([
//       Property.countDocuments(query).lean(),
//       Property.find(query)
//         .select("-__v -tokenVersion") // Explicitly exclude sensitive/useless fields
//         .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate("addedBy", "name avatar") // Only select needed fields
//         .lean(),
//     ]);

//     // ==========================================
//     // 5. TRANSFORM DATA (Consistent with POST)
//     // ==========================================
//     const transformedProperties = properties.map((property) => ({
//       _id: property._id,
//       propertyCode: property.propertyCode,
//       title: property.title,
//       description: property.description,
//       price: property.price,
//       priceType: property.priceType,
//       currency: property.currency,
//       location: property.location,
//       city: property.city,
//       area: property.area,
//       address: property.address,
//       coordinates: {
//         latitude: property.latitude,
//         longitude: property.longitude,
//       },
//       propertyType: property.propertyType,
//       bedrooms: property.bedrooms,
//       bathrooms: property.bathrooms,
//       kitchens: property.kitchens,
//       areaSize: property.areaSize,
//       areaUnit: property.areaUnit,
//       floors: property.floors,
//       yearBuilt: property.yearBuilt,
//       features: property.features || [],
//       amenities: property.amenities || [],
//       images: property.images || [],
//       thumbnail: property.thumbnail,
//       status: property.status,
//       isFeatured: property.isFeatured,
//       contact: {
//         name: property.contactName,
//         phone: property.contactPhone,
//         email: property.contactEmail,
//       },
//       addedBy: property.addedBy, // Populated: { _id, name, avatar }
//       createdAt: property.createdAt,
//       updatedAt: property.updatedAt,
//       viewsCount: property.viewsCount || 0,
//       leadsCount: property.leadsCount || 0,
//     }));

//     // ==========================================
//     // 6. PAGINATION META DATA
//     // ==========================================
//     const totalPages = Math.ceil(totalProperties / limit);
//     const pagination = {
//       currentPage: page,
//       totalPages,
//       totalItems: totalProperties,
//       itemsPerPage: limit,
//       hasNextPage: page < totalPages,
//       hasPrevPage: page > 1,
//     };

//     // ==========================================
//     // 7. RESPONSE
//     // ==========================================
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Properties fetched successfully",
//         total: totalProperties,
//         data: transformedProperties,
//         pagination: pagination,
//       },
//       {
//         status: 200,
//         headers: {
//           ...getSecurityHeaders(),
//           // ✅ GET Requests ke liye Caching (CDN/Browser level)
//           "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
//           "X-Request-Id": requestId,
//           "X-Response-Time": `${Date.now() - startTime}ms`,
//         },
//       },
//     );
//   } catch (error) {
//     const duration = Date.now() - startTime;

//     securityLog("GET_PROPERTIES_ERROR", {
//       requestId,
//       error: error.message,
//       duration,
//     });

//     const statusCode = error.statusCode || 500;
//     const message = error.message;

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           process.env.NODE_ENV === "production"
//             ? "Something went wrong"
//             : message,
//       },
//       {
//         status: statusCode,
//         headers: {
//           ...getSecurityHeaders(),
//           "Cache-Control": "no-store", // Error pe cache mat karo
//           "X-Request-Id": requestId,
//         },
//       },
//     );
//   }
// };

// // ==========================================
// // ✅ EXPORT GET
// // ==========================================
// export const GET = getProperties;

// // ==========================================
// // ✅ BLOCK OTHER METHODS (Security)
// // ==========================================
// const methodNotAllowed = () => {
//   return NextResponse.json(
//     { success: false, message: "Method not allowed on this endpoint" },
//     { status: 405, headers: { ...getSecurityHeaders(), Allow: "GET" } },
//   );
// };

// export const POST = methodNotAllowed;
// export const PUT = methodNotAllowed;
// export const DELETE = methodNotAllowed;
// export const PATCH = methodNotAllowed;

















import { NextResponse } from "next/server";
import connectDB from "@/backend/lib/db";
import User from "@/backend/models/user";
import Property from "@/backend/models/property";
import ApiError from "@/backend/utils/apierror";
import {
  getSecurityHeaders,
  securityLog,
  sanitizeInput,
} from "@/backend/lib/security";

// ==========================================
// ✅ ReDoS PROTECTION HELPER
// ==========================================
const escapeRegex = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ==========================================
// ✅ ALLOWED FILTERS (Whitelist)
// ==========================================
const ALLOWED_PROPERTY_TYPES = [
  "house",
  "apartment",
  "villa",
  "penthouse",
  "plot",
  "commercial",
  "office",
  "shop",
  "warehouse",
  "farmhouse",
  "flat",
  "studio",
];

const ALLOWED_PRICE_TYPES = ["sale", "rent"];
const ALLOWED_SORT_FIELDS = ["createdAt", "price", "title", "viewsCount"];
const ALLOWED_SORT_ORDERS = ["asc", "desc"];

// ==========================================
// ✅ MAIN HANDLER
// ==========================================
const getProperties = async (request) => {
  const startTime = Date.now();
  const requestId =
    crypto.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // ==========================================
    // 1. PAGINATION & SORTING
    // ==========================================
    let page = parseInt(searchParams.get("page")) || 1;
    let limit = parseInt(searchParams.get("limit")) || 10;

    page = Math.max(1, Math.min(1000, page));
    limit = Math.max(1, Math.min(100, limit));
    const skip = (page - 1) * limit;

    const sortField = ALLOWED_SORT_FIELDS.includes(searchParams.get("sortBy"))
      ? searchParams.get("sortBy")
      : "createdAt";
    const sortOrder = ALLOWED_SORT_ORDERS.includes(
      searchParams.get("sortOrder"),
    )
      ? searchParams.get("sortOrder")
      : "desc";

    // ==========================================
    // 2. FILTERS EXTRACT & SANITIZE
    // ==========================================
    const rawCity = searchParams.get("city") || "";
    const rawPropertyType = searchParams.get("propertyType") || "";
    const rawPriceType = searchParams.get("priceType") || "";
    const rawStatus = searchParams.get("status") || "";    // ✅ No default
    const rawSearch = searchParams.get("search") || "";
    const rawIsFeatured = searchParams.get("isFeatured");

    const city = sanitizeInput(rawCity).trim();
    const search = sanitizeInput(rawSearch).trim();

    const propertyType = ALLOWED_PROPERTY_TYPES.includes(
      rawPropertyType.toLowerCase(),
    )
      ? rawPropertyType.toLowerCase()
      : "";
    const priceType = ALLOWED_PRICE_TYPES.includes(rawPriceType.toLowerCase())
      ? rawPriceType.toLowerCase()
      : "";

    // ✅ STATUS: 'all' or empty => no filter; else must be valid
    const validStatuses = [
      "available",
      "sold",
      "rented",
      "pending",
      "unavailable",
    ];
    let status = rawStatus ? rawStatus.toLowerCase() : "";
    if (status && status !== "all" && !validStatuses.includes(status)) {
      status = ""; // invalid -> ignore
    }
    // Now status is either '' (no filter), 'all' (no filter), or a valid status

    // ==========================================
    // 3. BUILD SECURE QUERY
    // ==========================================
    const query = {
      isPublished: true, // Public: only published properties
    };

    if (city && city.length <= 100) {
      query.city = { $regex: `^${escapeRegex(city)}$`, $options: "i" };
    }
    if (propertyType) {
      query.propertyType = propertyType;
    }
    if (priceType) {
      query.priceType = priceType;
    }
    // ✅ Only add status filter if a specific status is provided (not 'all' and not empty)
    if (status && status !== "all") {
      query.status = status;
    }
    if (rawIsFeatured === "true") {
      query.isFeatured = true;
    }

    // ✅ SECURE TEXT SEARCH
    if (search && search.length <= 200) {
      const safeSearchRegex = { $regex: escapeRegex(search), $options: "i" };
      query.$or = [
        { title: safeSearchRegex },
        { description: safeSearchRegex },
        { location: safeSearchRegex },
        { propertyCode: safeSearchRegex },
      ];
    } else if (search && search.length > 200) {
      securityLog("SUSPICIOUS_SEARCH_QUERY", {
        requestId,
        searchLength: search.length,
        ip: request.headers.get("x-forwarded-for") || "unknown",
      });
    }

    // ==========================================
    // 4. DATABASE FETCH
    // ==========================================
    const [totalProperties, properties] = await Promise.all([
      Property.countDocuments(query).lean(),
      Property.find(query)
        .select("-__v -tokenVersion")
        .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .populate("addedBy", "name avatar")
        .lean(),
    ]);

    // ==========================================
    // 5. TRANSFORM DATA
    // ==========================================
    const transformedProperties = properties.map((property) => ({
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
        longitude: property.longitude,
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
        email: property.contactEmail,
      },
      addedBy: property.addedBy,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      viewsCount: property.viewsCount || 0,
      leadsCount: property.leadsCount || 0,
    }));

    const totalPages = Math.ceil(totalProperties / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalProperties,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    // ==========================================
    // 6. RESPONSE
    // ==========================================
    return NextResponse.json(
      {
        success: true,
        message: "Properties fetched successfully",
        total: totalProperties,
        data: transformedProperties,
        pagination: pagination,
      },
      {
        status: 200,
        headers: {
          ...getSecurityHeaders(),
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Request-Id": requestId,
          "X-Response-Time": `${Date.now() - startTime}ms`,
        },
      },
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    securityLog("GET_PROPERTIES_ERROR", {
      requestId,
      error: error.message,
      duration,
    });

    const statusCode = error.statusCode || 500;
    const message = error.message;

    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "production"
            ? "Something went wrong"
            : message,
      },
      {
        status: statusCode,
        headers: {
          ...getSecurityHeaders(),
          "Cache-Control": "no-store",
          "X-Request-Id": requestId,
        },
      },
    );
  }
};

// ==========================================
// ✅ EXPORT GET
// ==========================================
export const GET = getProperties;

// ==========================================
// ✅ BLOCK OTHER METHODS
// ==========================================
const methodNotAllowed = () => {
  return NextResponse.json(
    { success: false, message: "Method not allowed on this endpoint" },
    { status: 405, headers: { ...getSecurityHeaders(), Allow: "GET" } },
  );
};

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const PATCH = methodNotAllowed;