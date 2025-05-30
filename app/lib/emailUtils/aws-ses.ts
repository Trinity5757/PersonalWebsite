// app/lib/email/sendEmail.ts
"use server"
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "@/app/lib/config/sesClient";
import { welcomeEmailTemplate } from "./welcomeEmailTemplate";

export const sendWelcomeEmail = async (username: string, toAddress: string, subject: string, destinationUrl: string) => {
  const params = new SendEmailCommand({
    Source: "Olympiah <noreply@olympiah.org>",  // Verified SES sender email

    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: welcomeEmailTemplate(username, destinationUrl || ""),
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  });

  try {
    const response = await sesClient.send(params);
    return response;
  } catch (error) {
    console.error("SES Error:", error);
    throw new Error("Email sending failed.");
  }
};
