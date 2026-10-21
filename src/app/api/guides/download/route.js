// backend/app/api/guides/download/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Lead from '@/backend/models/lead';
import { sendGuideDownloadNotificationEmail, sendGuideDownloadThankYouEmail } from '@/backend/lib/email';

export async function POST(request) {
  try {
    // 1. Database Connect
    await dbConnect();

    // 2. Frontend se data lo
    const body = await request.json();
    const { name, email, phone, guideType } = body;

    // 3. Required Fields Check
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Name, Email, and Phone are required" },
        { status: 400 }
      );
    }

    // 4. Name Validation
    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // 5. Email Validation (Basic)
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // 6. Guide Type Validation
    const validGuideTypes = ['buyer', 'seller'];
    if (!guideType || !validGuideTypes.includes(guideType)) {
      return NextResponse.json(
        { success: false, message: "Invalid guide type. Must be 'buyer' or 'seller'" },
        { status: 400 }
      );
    }

    // 7. IP Address aur User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 'Unknown';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // 8. Lead Title Set Karo
    const leadTitle = guideType === 'buyer'
      ? 'Buyer Guide Download'
      : 'Seller Guide Download';

    // 9. Database Mein Lead Save Karo
    const newLead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      title: leadTitle,
      leadType: 'guide_download',
      guideType: guideType,
      source: 'website',
      status: 'new',
      priority: 'medium',
      ipAddress: ipAddress,
      userAgent: userAgent,
    });

    // 10. PDF Download URL Set Karo
    const downloadUrl = `/guides/${guideType}-guide.pdf`;

    // ============================================
    // ✅ EMAIL NOTIFICATIONS (Background Mein)
    // ============================================

    // 1. Admin Ko Notification Email
    sendGuideDownloadNotificationEmail(newLead, guideType).catch((error) => {
      console.error("Admin Guide Download Email Fail:", error.message);
    });

    // 2. User Ko Thank You Email
    sendGuideDownloadThankYouEmail(newLead, guideType).catch((error) => {
      console.error("User Guide Thank You Email Fail:", error.message);
    });

    // 11. Success Response with Download URL
    return NextResponse.json(
      {
        success: true,
        message: `Your ${guideType === 'buyer' ? 'Buyer' : 'Seller'} Guide is ready to download!`,
        data: {
          lead: newLead,
          downloadUrl: downloadUrl
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Guide Download Error:", error);

    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error while processing guide download" },
      { status: 500 }
    );
  }
}