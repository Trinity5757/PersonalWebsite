// app/api/users/change-password/route.ts

import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { connectDB } from '@/app/lib/connectDB';
import { User } from "@/app/models/Users";

export async function POST(request: Request) {
    console.log('API route reached');
  try {
    const { currentPassword, newPassword, userEmail } = await request.json();

    if (!currentPassword || !newPassword || !userEmail) {
      return NextResponse.json(
        { error: 'Current password, new password, and user email are required' }, 
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' }, 
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    user.password = hashedPassword;
    
    user.last_login = new Date();
    
    await user.save();

    return NextResponse.json({ 
      message: 'Password changed successfully',
      success: true
    });
    
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    console.error('Error changing password:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}