const generateOtp = () => {
  // Return keyword add kiya hai aur 6-digit ke liye 900000 use kiya hai
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getopthtml = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
          }
          .email-wrapper {
              width: 100%;
              background-color: #f9f9f9;
              padding: 40px 0;
          }
          .email-content {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
              overflow: hidden;
          }
          .header {
              background-color: #4F46E5;
              color: #ffffff;
              text-align: center;
              padding: 24px;
              font-size: 24px;
              font-weight: bold;
          }
          .body-content {
              padding: 32px;
              text-align: center;
              color: #333333;
          }
          .message {
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 24px;
              color: #4b5563;
          }
          .otp-container {
              margin: 24px 0;
          }
          .otp-code {
              background-color: #EEF2FF;
              color: #4F46E5;
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 16px 32px;
              border-radius: 6px;
              border: 2px dashed #4F46E5;
              display: inline-block;
          }
          .warning {
              font-size: 14px;
              color: #ef4444;
              margin-top: 24px;
              font-weight: 500;
          }
          .footer {
              background-color: #f3f4f6;
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #6b7280;
          }
      </style>
  </head>
  <body>
      <div class="email-wrapper">
          <div class="email-content">
              <div class="header">
                  Verification Code
              </div>
              <div class="body-content">
                  <p class="message">
                      Hello,<br><br>
                      Please use the verification code below to complete your sign-in process. This code is valid for the next <strong>10 minutes</strong>.
                  </p>
                  
                  <div class="otp-container">
                      <!-- Yahan aapka OTP inject hoga -->
                      <div class="otp-code">${otp}</div>
                  </div>
                  
                  <p class="warning">
                      ⚠️ Do not share this OTP with anyone. Our team will never ask for your password or OTP.
                  </p>
              </div>
              <div class="footer">
                  <p>If you didn't request this email, you can safely ignore it.</p>
                  <p>&copy; 2026 Your Company Name. All rights reserved.</p>
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
};

export { generateOtp, getopthtml };
