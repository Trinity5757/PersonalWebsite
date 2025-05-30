// app/lib/email/passwordResetTemplate.ts
export const passwordResetTemplate = (username: string, resetUrl: string): string => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
    }
    .content a {
      color: #ffffff;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #000000;
      color: #ffffff;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #999;
    }
    .footer a {
      color: #000000;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hi ${username},</p>
      <p>We received a request to reset the password for your Olympiah account. Click the button below to set a new password:</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p style="margin-top: 20px; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
      <p style="font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact us at <a href="mailto:support@olympiah.com">support@olympiah.com</a>.</p>
      <p>© ${new Date().getFullYear()} Olympiah. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;