import { NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/db';
import Contact from '@/backend/models/contact';
import mongoose from 'mongoose';

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Contact ID format" },
        { status: 400 }
      );
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json(
        { success: false, message: "Contact not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact deleted successfully",
        data: deletedContact
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE Contact Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error while deleting contact" },
      { status: 500 }
    );
  }
}