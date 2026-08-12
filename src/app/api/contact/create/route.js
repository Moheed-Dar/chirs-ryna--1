// import { NextResponse } from 'next/server';
// import dbConnect from '@/backend/lib/db';
// import Contact from '@/backend/models/contact';

// export async function POST(request) {
//   try {
//     await dbConnect();
    
//     const body = await request.json();
//     const { name, email, phone, message } = body;

//     // Required Fields Check
//     if (!name || !email || !message) {
//       return NextResponse.json(
//         { success: false, message: "Name, Email, and Message are required" },
//         { status: 400 }
//       );
//     }

//     // Database Mein Save Karo
//     const newContact = await Contact.create({
//       name: name.trim(),
//       email: email.trim().toLowerCase(),
//       phone: phone ? phone.trim() : undefined,
//       message: message.trim(),
//     });

//     return NextResponse.json(
//       { 
//         success: true, 
//         message: "Your message has been sent successfully! We will get back to you soon.", 
//         data: newContact 
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("POST Contact Error:", error);
    
//     if (error.name === 'ValidationError') {
//       const firstError = Object.values(error.errors)[0].message;
//       return NextResponse.json({ success: false, message: firstError }, { status: 400 });
//     }

//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }












import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Contact from '@/backend/models/contact';
// ✅ Apni email.js file ka path yahan dein
import { sendContactEmail, sendLeadThankYouEmail } from '@/backend/lib/email'; 

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Required Fields Check
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, Email, and Message are required" },
        { status: 400 }
      );
    }

    // Database Mein Save Karo
    const newContact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      message: message.trim(),
    });

    // ============================================
    // ✅ EMAIL NOTIFICATIONS (Background Mein)
    // ============================================

    // 1. Admin Ko Email Bhejo (Nayi Message Ki Notification)
    sendContactEmail({
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || 'Not provided',
      subject: 'General Inquiry', // API mein subject field nahi hai, isliye default
      message: newContact.message,
    }).catch((error) => {
      console.error("Admin email send fail:", error.message);
    });

    // 2. User Ko Thank You Email Bhejo (Auto-Reply)
    sendLeadThankYouEmail(newContact).catch((error) => {
      console.error("User thank you email fail:", error.message);
    });

    // User Ko Fataak Se Success Response Bhejo (Emails ka wait nahi karega)
    return NextResponse.json(
      { 
        success: true, 
        message: "Your message has been sent successfully! We will get back to you soon.", 
        data: newContact 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST Contact Error:", error);
    
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}