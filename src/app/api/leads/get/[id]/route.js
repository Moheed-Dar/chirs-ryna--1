// backend/app/api/leads/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Lead from '@/backend/models/lead';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Lead ID format" },
        { status: 400 }
      );
    }

    // ✅ OPTIMIZED: Sirf wahi fields populate kar rahe hain jo Modal mein use ho rahe hain
    const lead = await Lead.findById(id)
      .populate('property', 'title propertyCode') // ❌ images, thumbnail, location hata diye
      .lean(); // ❌ assignedTo hata diya (zaroorat nahi modal mein)

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead fetched successfully",
        data: lead,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Single Lead Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching lead",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}