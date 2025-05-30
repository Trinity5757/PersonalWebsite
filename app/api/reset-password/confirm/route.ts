
// app/api/password-reset/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/app/lib/emailUtils/sendPasswordResetEmail";
import { SignupFormSchema } from "@/app/lib/definitions";
import { connectDB } from "@/app/lib/connectDB";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required." },
        { status: 400 }
      );
    }

    // Validate password using the schema from definitions.ts
    try {
      // Create a partial schema for just the password
      const passwordSchema = SignupFormSchema.pick({ password: true });
      passwordSchema.parse({ password });
    } catch (error) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters and include a letter, number, and special character." },
        { status: 400 }
      );
    }

    // Reset the password
    const result = await resetPassword(token, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("Password reset confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}