// app/lib/email/sendPasswordResetEmail.ts
"use server"
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "@/app/lib/config/sesClient";
import { passwordResetTemplate } from "./passwordResetTemplate";
import crypto from 'crypto';
import { connectDB } from "@/app/lib/connectDB";
import { User } from "@/app/models/Users";
import bcrypt from 'bcryptjs';

export const generatePasswordResetToken = async (email: string) => {
  await connectDB();

  const resetToken = crypto.randomBytes(32).toString('hex');

  const resetTokenExpiry = new Date();
  resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

  console.log("Generated Reset Token:", resetToken);
  console.log("Token Expiry:", resetTokenExpiry.toISOString());

  

  const user = await User.findOneAndUpdate(
    { email },
    { $set: { resetToken, resetTokenExpiry } }, // use set to 
    // update resetToken and resetTokenExpiry, since may not exist on user
    { new: true, upsert: false } 
  );

  if (!user) {
    throw new Error("User not found");
  }

  console.log("Generated Reset Token:", resetToken);
  console.log("Stored Token in DB:", user.resetToken);
  console.log("Token Expiry:", user.resetTokenExpiry);
  return resetToken;
};

export const sendPasswordResetEmail = async (email: string, baseUrl: string) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return { success: true };
    }

    const resetToken = await generatePasswordResetToken(email);
    
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    
    const params = new SendEmailCommand({
      Source: "Olympiah <noreply@olympiah.org>", 
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: passwordResetTemplate(user.first_name || 'User', resetUrl),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Your Olympiah Password",
        },
      },
    });

    const response = await sesClient.send(params);
    return { success: true, response };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email.");
  }
};

export const validateResetToken = async (token: string) => {
  console.log("Validating reset token:", token.substring(0, 10) + "...");
  
  try {
    await connectDB();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } 
    });


    console.log("Token Received for Validation:", token);
    console.log("UserStored Token:", user?.resetToken);
    console.log("token Expiry in DB:", user?.resetTokenExpiry);

    if (!user) {
      console.log("❌ Invalid or expired reset token");
      return { valid: false, message: "Invalid or expired reset token." };
    }

    console.log("✅ Valid reset token for user:", user._id);
    // Return userId as a string to avoid serialization issues
    return { 
      valid: true, 
      userId: user._id.toString() 
    };
  } catch (error) {
    console.error("Error validating reset token:", error);
    return { valid: false, message: "Error validating token." };
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  console.log("Resetting password with token:", token.substring(0, 10) + "...");
  
  try {
    await connectDB();
    
    const validation = await validateResetToken(token);
    
    if (!validation.valid) {
      console.log("❌ Invalid reset token");
      return { success: false, message: validation.message };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(
      validation.userId,
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        last_login: new Date() 
      }
    );

    console.log("✅ Password reset successful for user ID:", validation.userId);
    return { success: true, message: "Password reset successful. Please login with your new password." };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, message: "Failed to reset password." };
  }
};