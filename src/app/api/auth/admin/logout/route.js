import { NextResponse } from 'next/server';
import { verifyToken } from '@/backend/lib/auth';
import connectDB from '@/backend/lib/db';
import User from '@/backend/models/user';
import { getSecurityHeaders } from '@/backend/lib/security';

const logoutUser = async (request) => {
  try {
    await connectDB();

    // ==========================================
    // ✅ STEP 1: TOKEN EXTRACT KARO
    // ==========================================
    let token = request.cookies.get('token')?.value;

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    // Agar token hi nahi hai toh bhi success bhej do
    // (Client ko cookie clear karne do)
    if (!token) {
      const response = NextResponse.json(
        {
          success: true,
          message: 'Logged out successfully'
        },
        { status: 200, headers: getSecurityHeaders() }
      );

      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
        path: '/',
      });

      return response;
    }

    // ==========================================
    // ✅ STEP 2: TOKEN VERIFY KARO
    // ==========================================
    const decoded = verifyToken(token);

    if (decoded && decoded.id) {
      // ==========================================
      // ✅ STEP 3: DIRECT DB UPDATE (No .save() needed)
      // ==========================================
      try {
        await User.findByIdAndUpdate(
          decoded.id,
          { $inc: { tokenVersion: 1 } },  // ✅ Atomic increment
          { 
            runValidators: false,
            returnDocument: 'after'  // ✅ Fixed: new: true replaced
          }
        );
      } catch (dbError) {
        // DB update fail ho jaye toh bhi logout kar do
        // Token cookie delete ho jayegi toh koi farq nahi parta
        console.error('Token version update failed (non-critical):', dbError.message);
      }
    }

    // ==========================================
    // ✅ STEP 4: RESPONSE WITH COOKIE CLEAR
    // ==========================================
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
        data: {
          loggedOutAt: new Date().toLocaleTimeString('en-PK', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          })
        }
      },
      { 
        status: 200,
        headers: getSecurityHeaders()
      }
    );

    // Cookie delete karo
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout Error:', error.message);
    
    // Error bhi aaye toh cookie clear kar do
    const response = NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500, headers: getSecurityHeaders() }
    );

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    return response;
  }
};

export const POST = logoutUser;