import { NextResponse } from "next/server";
import catchAsync from "../../../lib/utils/catchAsync.js";
import { User }  from "@/app/models/Users";

const validateOtp = catchAsync(async (request: Request) => {
    const { email, otp } = await request.json();

    // Find user by email and check if the OTP matches and hasn't expired
    const user = await User.findOne({
        email,
        otp,
        otp_expires_in: { $gt: Date.now() }
    });

    if (!user) {
        return NextResponse.json({
            success: false,
            message: 'Invalid OTP or OTP has expired.',
        }, { status: 400 });
    }

    // If OTP is valid, verify the user and clear OTP all fields
    user.is_verified = true;
    user.otp = null;
    user.otp_expires_in = null;
    await user.save();

    return NextResponse.json({
        success: true,
        message: 'Email successfully verified!',
    }, { status: 200 });
});

export const POST = validateOtp;
