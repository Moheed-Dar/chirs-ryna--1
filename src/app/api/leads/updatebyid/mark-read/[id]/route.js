// backend/app/api/leads/mark-read/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Lead from '@/backend/models/lead';
import mongoose from 'mongoose';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    // Next.js 15+ mein params Promise hai
    const { id } = await params;

    // ID Valid Check
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Lead ID" },
        { status: 400 }
      );
    }

    // Lead Update Karo
    const lead = await Lead.findByIdAndUpdate(
      id,
      {
        isRead: true,
        readAt: new Date(),
      },
      { returnDocument: 'after',runValidators: true }
    ).lean();

    // Lead Exist Check
    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead marked as read",
        data: lead,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Mark Read Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}