import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db'; // Agar yeh path alag hai toh theek karo
import Contact from '@/backend/models/contact';
import mongoose from 'mongoose';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    // Next.js 15+ mein params Promise hai
    const { id } = await params;

    // ID Valid Check
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Contact ID" },
        { status: 400 }
      );
    }

    // Contact Update Karo
    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new : true, runValidators: true }
    ).lean();

    // Contact Exist Check
    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact marked as read",
        data: contact,
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