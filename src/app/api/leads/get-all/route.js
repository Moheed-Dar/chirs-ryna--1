// backend/app/api/leads/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Lead from '@/backend/models/lead';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const source = searchParams.get('source') || '';
    const priority = searchParams.get('priority') || '';
    const property = searchParams.get('property') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const leadType = searchParams.get('leadType') || '';
    const guideType = searchParams.get('guideType') || '';

    const filter = {};

    // Search Filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    // Filters
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (priority) filter.priority = priority;
    if (leadType) filter.leadType = leadType;
    if (guideType) filter.guideType = guideType;

    if (property && mongoose.Types.ObjectId.isValid(property)) {
      filter.property = new mongoose.Types.ObjectId(property);
    }

    // Date Range Filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        filter.createdAt.$lt = endDate;
      }
    }

    // Sorting
    const sort = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'name', 'status', 'priority', 'source', 'leadType', 'guideType'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // ✅ PARALLEL QUERIES: Filtered Data + Global Stats (For Cards)
    const [totalLeads, leads, propertyCount, buyerCount, sellerCount] = await Promise.all([
      // 1. Filtered Count (for pagination)
      Lead.countDocuments(filter),
      
      // 2. Filtered Data
      Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('property', 'title propertyCode city propertyType price')
        .lean(),

      // 3. Global Stats for Frontend Cards (Ignorant of current table filters)
      Lead.countDocuments({ leadType: 'property_inquiry' }),
      Lead.countDocuments({ leadType: 'guide_download', guideType: 'buyer' }),
      Lead.countDocuments({ leadType: 'guide_download', guideType: 'seller' }),
    ]);

    // ✅ Stats Object
    const stats = {
      allLeads: propertyCount + buyerCount + sellerCount, // Total of all 3 types
      propertyInquiries: propertyCount,
      buyerGuides: buyerCount,
      sellerGuides: sellerCount
    };

    // Pagination
    const totalPages = Math.ceil(totalLeads / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalRecords: totalLeads,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Leads fetched successfully",
        total: totalLeads,
        data: leads,
        pagination,
        stats, // ✅ Sent to frontend for Cards
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Leads Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching leads",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}