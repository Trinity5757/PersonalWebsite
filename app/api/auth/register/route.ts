// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

import bcryptjs from 'bcryptjs';
import { connectDB } from '@/app/lib/connectDB';
import { User } from "@/app/models/Users";
import { createSettings } from '@/app/services/settingServices/settingService';
//import validateEmail from '../../../lib/emailUtils/validateEmail';
//import verifyEmailDomain from '@/app/lib/emailUtils/verfiyDomain';
import { sendWelcomeEmail } from '@/app/lib/emailUtils/aws-ses';

export async function POST(request: Request) {
  try {
    const { first_name, last_name, date_of_birth, gender, email, username, password, role } = await request.json();


    // Todo implement email verification

    // try {
    //     const isDomainValid = await validateEmail(email);
    //
    //     if (!isDomainValid) {
    //         return NextResponse.json({ message: 'Invalid email domain.' }, { status: 400 });
    //     }
    // } catch (error) {
    //     return NextResponse.json({ message: error }, { status: 400 });
    // }


    /*
    try {
      const isDomainValid = await verifyEmailDomain(email);
      if (!isDomainValid) {
        return NextResponse.json({ message: 'Invalid email domain.' }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }*/


    // Connect to the MongoDB database
    await connectDB();


    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert the user into the database
    const newUser = new User({
      first_name,
      last_name,
      date_of_birth,
      gender,
      email,
      username,
      password: hashedPassword,
      role: role || 'user',
    });





    await newUser.save();
    await createSettings(newUser._id);


    //await sendWelcomeEmail({ to: email, name: username });
    /*const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });*/

    //const otp = Math.floor(Math.random() * 1000000);
    /*
    const mailOptions = {
      from: 'Olympiah <no-reply@olympiah.com>',
      to: newUser.email,
      subject: 'Welcome to Olympiah - Email Verification',
      html: welcomeEmailTemplate(newUser.username, 'http://localhost:3000/login/'),
    };

    await transporter.sendMail(mailOptions);*/

    try {

      const subject = "Welcome to Olympiah - Email Verification";
      const destinationUrl = "http://localhost:3000/login"; // Replace with your actual destination URL
      await sendWelcomeEmail(username, newUser.email, subject, destinationUrl);

    } catch (error) {
      console.error('Error sending email:', error);
      await User.findByIdAndDelete(newUser._id);
      return NextResponse.json({ message: 'Registration failed during email sending.' }, { status: 500 });
    }


    return NextResponse.json({ message: 'Registration successful!' });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    console.error('Error during registration:', errorMessage);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
