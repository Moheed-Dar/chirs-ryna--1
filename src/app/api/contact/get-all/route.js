import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Contact from '@/backend/models/contact';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Search & Filters
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const isRead = searchParams.get('isRead');

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // ============================================
    // FILTER BUILD
    // ============================================
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    if (isRead === 'true') {
      filter.isRead = true;
    } else if (isRead === 'false') {
      filter.isRead = false;
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        filter.createdAt.$lt = endDate;
      }
    }

    // ============================================
    // SORTING
    // ============================================
    const sort = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'email'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    // ============================================
    // PAGINATION
    // ============================================
    const skip = (page - 1) * limit;

    // ============================================
    // 🚀 PARALLEL QUERIES + .select() OPTIMIZATION
    // ============================================
    const [totalContacts, contacts, statsResult] = await Promise.all([
      Contact.countDocuments(filter),

      // ✅ .select() => Sirf zaroori fields lega (Extra data transfer nahi hoga)
      Contact.find(filter)
        .select('name email phone isRead readAt message createdAt')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Contact.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            read: {
              $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] },
            },
            unread: {
              $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const statsData = statsResult[0] || { total: 0, read: 0, unread: 0 };
    const stats = {
      total: statsData.total,
      read: statsData.read,
      unread: statsData.unread,
    };

    // ============================================
    // PAGINATION OBJECT
    // ============================================
    const totalPages = Math.ceil(totalContacts / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalRecords: totalContacts,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Contacts fetched successfully',
        total: totalContacts,
        data: contacts,
        pagination,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET Contacts Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error while fetching contacts',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}