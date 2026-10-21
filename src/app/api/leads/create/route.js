// import { NextResponse } from 'next/server';
// import dbConnect from '@/backend/lib/db';
// import Lead from '@/backend/models/lead';
// import Property from '@/backend/models/property';
// import { sendLeadNotificationEmail, sendLeadThankYouEmail } from '@/backend/lib/email'; // ✅ Email import
// import mongoose from 'mongoose';

// export async function POST(request) {
//   try {
//     // 1. Database Connect
//     await dbConnect();
    
//     // 2. Frontend se data lo
//     const body = await request.json();
//     const { name, email, phone, message, property, title } = body;

//     // 3. Required Fields Check
//     if (!name || !email || !phone) {
//       return NextResponse.json(
//         { success: false, message: "Name, Email, and Phone are required" },
//         { status: 400 }
//       );
//     }

//     // 4. Property ID Check
//     if (property && !mongoose.Types.ObjectId.isValid(property)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid Property ID format" },
//         { status: 400 }
//       );
//     }

//     // 5. User ka IP Address aur Device Info
//     const ipAddress = request.headers.get('x-forwarded-for') || 'Unknown';
//     const userAgent = request.headers.get('user-agent') || 'Unknown';

//     // 6. Database Mein Lead Save Karo
//     const newLead = await Lead.create({
//       name: name.trim(),
//       email: email.trim().toLowerCase(),
//       phone: phone.trim(),
//       message: message ? message.trim() : undefined,
//       property: property,                     
//       title: title ? title.trim() : "General Inquiry", 
//       source: 'website',
//       status: 'new',
//       priority: 'medium',
//       ipAddress: ipAddress,
//       userAgent: userAgent,
//     });

//     // 7. Response Mein Property Ka Title Bhejo (Populate)
//     // ✅ Location is liye add kiya hai taake admin ko email mein location bhi dikhe
//     const leadWithProperty = await Lead.findById(newLead._id)
//       .populate('property', 'title propertyCode city propertyType price location')
//       .lean();

//     // ============================================
//     // ✅ EMAIL NOTIFICATIONS (Background Mein)
//     // ============================================

//     // 1. Admin Ko Email Bhejo (Lead Details + Property Details)
//     sendLeadNotificationEmail(leadWithProperty, leadWithProperty.property).catch((error) => {
//       console.error("Admin Lead Notification Email Fail:", error.message);
//     });

//     // 2. User Ko Thank You Email Bhejo (Auto-Reply)
//     sendLeadThankYouEmail(leadWithProperty).catch((error) => {
//       console.error("User Thank You Email Fail:", error.message);
//     });

//     // 8. Success Response (User ko fataak se response milega)
//     return NextResponse.json(
//       { 
//         success: true, 
//         message: "Your interest has been submitted successfully! Our team will contact you soon.", 
//         data: leadWithProperty 
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("POST Lead Error:", error);
    
//     if (error.name === 'ValidationError') {
//       const firstError = Object.values(error.errors)[0].message;
//       return NextResponse.json(
//         { success: false, message: firstError }, 
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: "Internal Server Error while submitting lead" },
//       { status: 500 }
//     );
//   }
// }














import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Lead from '@/backend/models/lead';
import Property from '@/backend/models/property';
import { sendLeadNotificationEmail, sendLeadThankYouEmail } from '@/backend/lib/email';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    // 1. Database Connect
    await dbConnect();
    
    // 2. Frontend se data lo
    const body = await request.json();
    const { name, email, phone, message, property, title } = body;

    // 3. Required Fields Check
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Name, Email, and Phone are required" },
        { status: 400 }
      );
    }

    // 4. Property ID Check
    if (property && !mongoose.Types.ObjectId.isValid(property)) {
      return NextResponse.json(
        { success: false, message: "Invalid Property ID format" },
        { status: 400 }
      );
    }

    // 5. User ka IP Address aur Device Info
    const ipAddress = request.headers.get('x-forwarded-for') || 'Unknown';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // 6. Database Mein Lead Save Karo
    const newLead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message ? message.trim() : undefined,
      property: property,                     
      title: title ? title.trim() : "General Inquiry", 
      leadType: 'property_inquiry',
      guideType: null,
      source: 'website',
      status: 'new',
      priority: 'medium',
      ipAddress: ipAddress,
      userAgent: userAgent,
    });

    // 7. Response Mein Property Ka Title Bhejo (Populate)
    const leadWithProperty = await Lead.findById(newLead._id)
      .populate('property', 'title propertyCode city propertyType price location')
      .lean();

    // ============================================
    // ✅ EMAIL NOTIFICATIONS (Background Mein)
    // ============================================

    // 1. Admin Ko Email Bhejo
    sendLeadNotificationEmail(leadWithProperty, leadWithProperty.property).catch((error) => {
      console.error("Admin Lead Notification Email Fail:", error.message);
    });

    // 2. User Ko Thank You Email Bhejo
    sendLeadThankYouEmail(leadWithProperty).catch((error) => {
      console.error("User Thank You Email Fail:", error.message);
    });

    // 8. Success Response
    return NextResponse.json(
      { 
        success: true, 
        message: "Your interest has been submitted successfully! Our team will contact you soon.", 
        data: leadWithProperty 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST Lead Error:", error);
    
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return NextResponse.json(
        { success: false, message: firstError }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error while submitting lead" },
      { status: 500 }
    );
  }
}