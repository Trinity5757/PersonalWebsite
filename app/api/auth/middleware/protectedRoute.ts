import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function protectedRouteMiddleware(request: Request, requiredRole?: string) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthorized - Unauthenticated - Please log in" },
      { status: 401 }
    );
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return NextResponse.json(
      { message: "Forbidden - Insufficient permissions - Only Admins are allowed" },
      { status: 403 }
    );
  }

  return null;
}
