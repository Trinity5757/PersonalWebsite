// app/api/password-reset/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/app/lib/emailUtils/sendPasswordResetEmail";
import validateEmail from "@/app/lib/emailUtils/validateEmail";
import { connectDB } from "@/app/lib/connectDB";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    const { email } = await request.json();

    // Validate email format
    try {
      await validateEmail(email);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid email" },
        { status: 400 }
      );
    }

    // Get the base URL for creating the reset link
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = process.env.BASE_URL || `${protocol}://${host}`;


    // Send password reset email
    await sendPasswordResetEmail(email, baseUrl);

    // Always return success even if email doesn't exist (security best practice)
    return NextResponse.json({
      message: "If your email is registered, you will receive a password reset link."
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
