import { NextResponse } from 'next/server';
import { withAuth } from '@/backend/middleware/auth';

// Get current logged-in user
const getMe = async (request, context, user) => {
  return NextResponse.json(
    {
      success: true,
      data: user,
    },
    { status: 200 }
  );
};

export const GET = withAuth(getMe);