import { NextResponse } from 'next/server';

export const checkAdmin = (user) => {
  if (user.role !== 'admin') {
    return false;
  }
  return true;
};

export const checkAgentOrAdmin = (user) => {
  if (user.role !== 'admin' && user.role !== 'agent') {
    return false;
  }
  return true;
};

// Wrapper for admin only routes
export const withAdmin = (handler) => {
  return async (request, context, user) => {
    if (!checkAdmin(user)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    return handler(request, context, user);
  };
};

// Wrapper for agent or admin routes
export const withAgentOrAdmin = (handler) => {
  return async (request, context, user) => {
    if (!checkAgentOrAdmin(user)) {
      return NextResponse.json(
        { success: false, message: 'Access denied. Agent or Admin only.' },
        { status: 403 }
      );
    }

    return handler(request, context, user);
  };
};