import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Lead from '@/backend/models/lead';
import { withAdminAuth } from '@/backend/middleware/auth';
import mongoose from 'mongoose';

// ============================================
// ✅ DELETE - Lead Delete By ID (Admin Only)
// ============================================
export const DELETE = withAdminAuth(async (request, context, user) => {
  try {
    // 1. Database Connect
    await dbConnect();

    // 2. ID Nikalo (context.params se - Next.js 15+ mein ye promise hai)
    const { id } = await context.params;

    // 3. ID Valid Check Karo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Lead ID format" },
        { status: 400 }
      );
    }

    // 4. Lead Dhundo
    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    // 5. Lead Delete Karo
    await Lead.findByIdAndDelete(id);

    // 6. Success Response
    return NextResponse.json(
      {
        success: true,
        message: "Lead deleted successfully",
        data: {
          _id: id,
          name: lead.name,
          email: lead.email,
        },
        deletedBy: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE Lead Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while deleting lead",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
});