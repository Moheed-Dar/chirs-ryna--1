// import { NextResponse } from 'next/server';
// import dbConnect from '@/backend/lib/db';
// import Contact from '@/backend/models/contact';
// import mongoose from 'mongoose';

// export async function GET(request, { params }) {
//   try {
//     // 1. Database Connect
//     await dbConnect();

//     // 2. ID Ko Params Se Lo
//     const { id } = await params;

//     // 3. ID Valid Ha Ya Nahi Check Karo
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid Contact ID format" },
//         { status: 400 }
//       );
//     }

//     // 4. Database Mein Dhundo
//     const contact = await Contact.findById(id).lean();

//     // 5. Agar Nahi Mila
//     if (!contact) {
//       return NextResponse.json(
//         { success: false, message: "Contact not found" },
//         { status: 404 }
//       );
//     }

//     // 6. Success Response
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Contact fetched successfully",
//         data: contact
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("GET Contact By ID Error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal Server Error while fetching contact",
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//       },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Contact from '@/backend/models/contact';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    // 1. Database Connect
    await dbConnect();

    // 2. ID Ko Params Se Lo
    const { id } = await params;

    // 3. ID Valid Ha Ya Nahi Check Karo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Contact ID format" },
        { status: 400 }
      );
    }

    // 4. Query Params Check - Auto Read Feature
    const { searchParams } = new URL(request.url);
    const markRead = searchParams.get('markRead') === 'true';

    // 5. Database Mein Dhundo
    const contact = await Contact.findById(id).lean();

    // 6. Agar Nahi Mila
    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    // 7. Agar markRead=true hai aur contact unread hai → Auto Read Kar Do
    if (markRead && contact.isRead === false) {
      await Contact.findByIdAndUpdate(
        id,
        { isRead: true, readAt: new Date() },
        { returnDocument: 'after' }
      ).lean();

      // Response mein bhi update kar do
      contact.isRead = true;
      contact.readAt = new Date().toISOString();
    }

    // 8. Success Response
    return NextResponse.json(
      {
        success: true,
        message: "Contact fetched successfully",
        data: contact,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Contact By ID Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching contact",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}