// lib/emailTemplates.ts

interface ClientWelcomeEmailData {
  clientName: string;
  vendorName: string;
  email: string;
  password: string;
  eventDate: string;
  eventType: string;
  location: string;
  guestCount: number;
  inquiryId: number;
  brideName: string;
  groomName: string;
  eventId?: string;
  vendorId?: string;
}

interface VendorNotificationEmailData {
  vendorName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  eventType: string;
  location: string;
  guestCount: number;
  inquiryId: number;
  brideName: string;
  groomName: string;
  eventId?: string;
  vendorId?: string;
}

export function generateClientWelcomeEmail(
  data: ClientWelcomeEmailData
): string {
  // Construct the auto-login URL
  let loginUrl = `https://client.wpro.ai/login?email=${encodeURIComponent(
    data.email
  )}&phone=${encodeURIComponent(data.password)}`;

  // Add additional parameters if available
  if (data.eventId) {
    loginUrl += `&id=${data.eventId}`;
  }
  if (data.vendorId) {
    loginUrl += `&vendorId=${data.vendorId}`;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Your Wedding Journey</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 650px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 300;
        }
        
        .header p {
          opacity: 0.9;
          font-size: 16px;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .welcome-section {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .welcome-section h2 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 15px;
        }
        
        .welcome-section p {
          color: #7f8c8d;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .inquiry-badge {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          padding: 15px 25px;
          border-radius: 50px;
          text-align: center;
          font-weight: bold;
          margin: 25px 0;
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }
        
        .login-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin: 25px 0;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .login-section h3 {
          color: white;
          margin-bottom: 15px;
          font-size: 20px;
        }
        
        .credentials-box {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 8px;
          margin: 15px 0;
          backdrop-filter: blur(10px);
        }
        
        .credentials-box p {
          color: white;
          margin: 5px 0;
          font-size: 14px;
        }
        
        .login-button {
          display: inline-block;
          background: #ff6b6b;
          color: white !important;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 25px;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
          transition: all 0.3s ease;
          margin-top: 10px;
        }
        
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }
        
        .login-note {
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          margin-top: 15px;
        }
        
        .event-details {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
        }
        
        .event-details h3 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 18px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          font-weight: 600;
          color: #34495e;
          flex: 1;
        }
        
        .detail-value {
          color: #7f8c8d;
          text-align: right;
          flex: 1;
        }
        
        .next-steps {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .next-steps h3 {
          color: #495057;
          margin-bottom: 15px;
        }
        
        .next-steps ul {
          color: #6c757d;
          line-height: 1.6;
          padding-left: 20px;
        }
        
        .next-steps li {
          margin-bottom: 8px;
        }
        
        .footer {
          background: #2c3e50;
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .footer p {
          opacity: 0.8;
          margin-bottom: 10px;
        }
        
        .social-links {
          margin-top: 20px;
        }
        
        .social-links a {
          color: white;
          text-decoration: none;
          margin: 0 10px;
          opacity: 0.8;
        }
        
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 15px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }
          
          .detail-value {
            text-align: left;
            margin-top: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌸 Welcome to Your Wedding Journey! 🌸</h1>
          <p>Your inquiry has been successfully submitted</p>
        </div>
        
        <div class="content">
          <div class="welcome-section">
            <h2>Hello ${data.clientName}! 💕</h2>
            <p>Congratulations on taking this beautiful step towards your special day! Your wedding inquiry has been successfully submitted to <strong>${
              data.vendorName
            }</strong>.</p>
          </div>

          ${
            data.inquiryId
              ? `
          <div class="inquiry-badge">
            📋 Inquiry Reference: #${data.inquiryId.toString().padStart(6, "0")}
          </div>
          `
              : ""
          }

          <div class="login-section">
            <h3>🔐 Your Login Credentials</h3>
            <div class="credentials-box">
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Password:</strong> ${data.password}</p>
            </div>
            <a href="${loginUrl}" class="login-button">
              🚀 Login to Your Dashboard
            </a>
            <p class="login-note">
              Click the button above for instant access to your event dashboard
            </p>
          </div>

          <div class="event-details">
            <h3>📅 Your Event Details</h3>
            
            ${
              data.brideName && data.groomName
                ? `
            <div class="detail-row">
              <span class="detail-label">Couple:</span>
              <span class="detail-value">${data.brideName} & ${data.groomName}</span>
            </div>
            `
                : ""
            }
            
            ${
              data.eventType
                ? `
            <div class="detail-row">
              <span class="detail-label">Event Type:</span>
              <span class="detail-value">${
                data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1)
              }</span>
            </div>
            `
                : ""
            }
            
            ${
              data.eventDate
                ? `
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${data.eventDate}</span>
            </div>
            `
                : ""
            }
            
            ${
              data.location
                ? `
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${data.location}</span>
            </div>
            `
                : ""
            }
            
            ${
              data.guestCount
                ? `
            <div class="detail-row">
              <span class="detail-label">Guest Count:</span>
              <span class="detail-value">${data.guestCount} guests</span>
            </div>
            `
                : ""
            }
          </div>

          <div class="next-steps">
            <h3>✨ What's Next?</h3>
            <ul>
              <li>Use the login button above to access your personalized dashboard</li>
              <li>Chat directly with ${data.vendorName} about your event</li>
              <li>Review and approve event proposals</li>
              <li>Track your event planning progress</li>
              <li>Upload inspiration photos and share your vision</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing our platform for your special day! 💖</p>
          <p>If you have any questions, please don't hesitate to reach out.</p>
          <div class="social-links">
            <a href="#">📧 Support</a>
            <a href="#">📱 Contact</a>
            <a href="#">🌐 Website</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateVendorNotificationEmail(
  data: VendorNotificationEmailData
): string {
  // Construct the client login URL for vendor reference
  let clientLoginUrl = `https://client.wpro.ai/login?email=${encodeURIComponent(
    data.clientEmail
  )}&phone=${encodeURIComponent(data.clientPhone)}`;

  // Add additional parameters if available
  if (data.eventId) {
    clientLoginUrl += `&id=${data.eventId}`;
  }
  if (data.vendorId) {
    clientLoginUrl += `&vendorId=${data.vendorId}`;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Client Inquiry Alert</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .container {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 300;
        }
        
        .header p {
          opacity: 0.9;
          font-size: 16px;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .urgent-alert {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
          box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
        }
        
        .urgent-alert h2 {
          margin: 0;
          font-size: 24px;
        }
        
        .urgent-alert p {
          margin: 10px 0 0 0;
          opacity: 0.9;
        }
        
        .inquiry-badge {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          padding: 15px 25px;
          border-radius: 50px;
          text-align: center;
          font-weight: bold;
          margin: 25px 0;
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }
        
        .client-info, .event-details {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
        }
        
        .client-info h3, .event-details h3 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 18px;
        }
        
        .detail-grid {
          display: grid;
          gap: 15px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }
        
        .detail-label {
          font-weight: 600;
          color: #34495e;
          flex: 1;
        }
        
        .detail-value {
          color: #7f8c8d;
          text-align: right;
          flex: 1;
          word-break: break-word;
        }
        
        .client-access-info {
          background: #e3f2fd;
          border: 2px solid #2196f3;
          padding: 20px;
          border-radius: 10px;
          margin: 25px 0;
        }
        
        .client-access-info h3 {
          color: #1976d2;
          margin-top: 0;
          margin-bottom: 15px;
        }
        
        .client-access-info p {
          color: #424242;
          margin-bottom: 15px;
        }
        
        .credentials-display {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #2196f3;
          margin: 15px 0;
        }
        
        .credentials-display p {
          margin: 5px 0;
          color: #424242;
        }
        
        .url-section {
          margin-top: 15px;
        }
        
        .url-section p {
          color: #424242;
          margin-bottom: 10px;
        }
        
        .url-link {
          word-break: break-all;
          color: #1976d2;
          text-decoration: underline;
          display: block;
          padding: 10px;
          background: white;
          border-radius: 5px;
          margin: 10px 0;
        }
        
        .url-note {
          color: #666;
          font-size: 14px;
          margin-top: 15px;
          font-style: italic;
        }
        
        .action-required {
          background: #fff3cd;
          border: 2px solid #ffc107;
          padding: 20px;
          border-radius: 10px;
          margin: 25px 0;
        }
        
        .action-required h3 {
          color: #856404;
          margin-top: 0;
          margin-bottom: 15px;
        }
        
        .action-required ul {
          color: #856404;
          margin: 10px 0;
          padding-left: 20px;
        }
        
        .action-required li {
          margin-bottom: 8px;
        }
        
        .footer {
          background: #2c3e50;
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .footer p {
          opacity: 0.8;
          margin-bottom: 10px;
        }
        
        .priority-badge {
          background: #e74c3c;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin: 10px 0;
        }
        
        @media (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 15px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }
          
          .detail-value {
            text-align: left;
            margin-top: 5px;
          }
          
          .url-link {
            font-size: 12px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Client Inquiry Alert!</h1>
          <p>You have received a new wedding inquiry</p>
        </div>
        
        <div class="content">
          <div class="urgent-alert">
            <h2>⚡ URGENT: New Inquiry Received!</h2>
            <p>Please respond promptly to secure this booking</p>
            <div class="priority-badge">HIGH PRIORITY</div>
          </div>

          ${
            data.inquiryId
              ? `
          <div class="inquiry-badge">
            📋 Inquiry #${data.inquiryId.toString().padStart(6, "0")}
          </div>
          `
              : ""
          }

          <div class="client-info">
            <h3>👰🤵 Client Information</h3>
            <div class="detail-grid">
              
              ${
                data.brideName && data.groomName
                  ? `
              <div class="detail-item">
                <div class="detail-label">Couple Names</div>
                <div class="detail-value">${data.brideName} & ${data.groomName}</div>
              </div>
              `
                  : ""
              }
              
              ${
                data.clientName
                  ? `
              <div class="detail-item">
                <div class="detail-label">Primary Contact</div>
                <div class="detail-value">${data.clientName}</div>
              </div>
              `
                  : ""
              }
              
              ${
                data.clientEmail
                  ? `
              <div class="detail-item">
                <div class="detail-label">Email Address</div>
                <div class="detail-value">${data.clientEmail}</div>
              </div>
              `
                  : ""
              }
              
              ${
                data.clientPhone
                  ? `
              <div class="detail-item">
                <div class="detail-label">Phone Number</div>
                <div class="detail-value">${data.clientPhone}</div>
              </div>
              `
                  : ""
              }
              
            </div>
          </div>

          <div class="event-details">
            <h3>📅 Event Details</h3>
            <div class="detail-grid">
              
              ${
                data.eventType
                  ? `
              <div class="detail-item">
                <div class="detail-label">Event Type</div>
                <div class="detail-value">${
                  data.eventType.charAt(0).toUpperCase() +
                  data.eventType.slice(1)
                }</div>
              </div>
              `
                  : ""
              }
              
              ${
                data.eventDate
                  ? `
              <div class="detail-item">
                <div class="detail-label">Event Date</div>
                <div class="detail-value">${data.eventDate}</div>
              </div>
              `
                  : ""
              }
              
              ${
                data.location
                  ? `
              <div class="detail-item">
                <div class="detail-label">Venue Location</div>
                <div class="detail-value">${data.location}</div>
              </div>
              `
                  : ""
              }
              
              ${
                data.guestCount
                  ? `
              <div class="detail-item">
                <div class="detail-label">Expected Guests</div>
                <div class="detail-value">${data.guestCount} people</div>
              </div>
              `
                  : ""
              }
              
            </div>
          </div>

          <div class="client-access-info">
            <h3>🔑 Client Access Information</h3>
            <p>The client has been provided with these login credentials:</p>
            <div class="credentials-display">
              <p><strong>Email:</strong> ${data.clientEmail}</p>
              <p><strong>Password:</strong> ${data.clientPhone}</p>
            </div>
            <div class="url-section">
              <p><strong>Client Login URL:</strong></p>
              <a href="${clientLoginUrl}" class="url-link">
                ${clientLoginUrl}
              </a>
            </div>
            <p class="url-note">
              💡 You can share this link directly with your client if needed
            </p>
          </div>

          <div class="action-required">
            <h3>⚡ Action Required</h3>
            <ul>
              <li>Log into your vendor dashboard to respond to this inquiry</li>
              <li>Start a chat conversation with the client</li>
              <li>Provide a detailed quote and timeline</li>
              <li>Schedule a consultation if appropriate</li>
              <li>Review client's inspiration photos and requirements</li>
              <li>Send a personalized welcome message</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>🚀 Don't let this opportunity slip away!</p>
          <p>Quick responses lead to higher booking rates.</p>
          <p>Good luck securing this event! 💼✨</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
