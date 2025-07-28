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
}

export function generateClientWelcomeEmail(
  data: ClientWelcomeEmailData
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Your Wedding Journey</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; }
        .container { background-color: white; border-radius: 15px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 300; }
        .content { padding: 40px 30px; }
        .welcome-section { background: linear-gradient(135deg, #ffeaa7, #fdcb6e); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; }
        .inquiry-badge { background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; padding: 15px 25px; border-radius: 25px; display: inline-block; font-weight: 600; margin: 20px 0; }
        .event-details { background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
        .detail-label { font-weight: 600; color: #666; }
        .detail-value { color: #333; }
        .login-section { background: linear-gradient(135deg, #00b894, #00cec9); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
        .credentials-box { background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; }
        .login-btn { display: inline-block; background-color: white; color: #00b894; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin-top: 15px; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; }
        .next-steps { background-color: #e3f2fd; padding: 25px; border-radius: 12px; margin: 25px 0; }
        .next-steps h3 { color: #1976d2; margin-top: 0; }
        .next-steps ul { margin: 0; padding-left: 20px; }
        .next-steps li { margin: 8px 0; }
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

          <div class="inquiry-badge">
            📋 Inquiry Reference: #${data.inquiryId.toString().padStart(6, "0")}
          </div>

          <div class="event-details">
            <h3>📅 Your Event Details</h3>
            <div class="detail-row">
              <span class="detail-label">Couple:</span>
              <span class="detail-value">${data.brideName} & ${
    data.groomName
  }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Event Type:</span>
              <span class="detail-value">${
                data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1)
              }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${data.eventDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${data.location}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Guest Count:</span>
              <span class="detail-value">${data.guestCount} guests</span>
            </div>
          </div>

          <div class="login-section">
            <h3>🔑 Access Your Client Portal</h3>
            <p>We've created a personal account for you to track your inquiry progress and communicate with ${
              data.vendorName
            }.</p>
            
            <div class="credentials-box">
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Password:</strong> ${data.password}</p>
              <p style="font-size: 14px; margin-top: 15px; opacity: 0.8;">
                Your password is set to your phone number for easy access. You can change it after logging in.
              </p>
            </div>
            
            <a href="https://client.wpro.ai/login" class="login-btn">Login to Your Portal</a>
          </div>

          <div class="next-steps">
            <h3>What's Next? 📋</h3>
            <ul>
              <li><strong>Quick Response:</strong> ${
                data.vendorName
              } will review your inquiry within 24 hours</li>
              <li><strong>Personal Consultation:</strong> You'll receive a call or email to discuss your vision</li>
              <li><strong>Upload Inspiration:</strong> Use your client portal to share inspiration images</li>
              <li><strong>Direct Communication:</strong> Chat with your vendor through the secure portal</li>
              <li><strong>Proposal & Booking:</strong> Receive a customized proposal for your event</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p><strong>Thank you for choosing our platform! 💐</strong></p>
          <p>We're excited to help make your special day absolutely beautiful.</p>
          <p style="font-size: 12px; margin-top: 20px; color: #999;">
            This email was sent because you submitted a wedding inquiry. If you didn't make this request, please contact us immediately.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateVendorNotificationEmail(
  data: VendorNotificationEmailData
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Wedding Inquiry - Action Required</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; }
        .container { background-color: white; border-radius: 15px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 300; }
        .content { padding: 40px 30px; }
        .urgent-alert { background: linear-gradient(135deg, #fd79a8, #e84393); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 25px 0; font-weight: 600; }
        .inquiry-badge { background: linear-gradient(135deg, #fdcb6e, #e17055); color: white; padding: 15px 25px; border-radius: 25px; display: inline-block; font-weight: 600; margin: 20px 0; font-size: 18px; }
        .client-info { background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #667eea; }
        .event-details { background-color: #fff5f5; padding: 25px; border-radius: 12px; margin: 25px 0; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .detail-item { background-color: white; padding: 15px; border-radius: 8px; border-left: 3px solid #667eea; }
        .detail-label { font-size: 12px; color: #666; text-transform: uppercase; font-weight: 600; margin-bottom: 5px; }
        .detail-value { font-size: 16px; color: #333; font-weight: 500; }
        .contact-section { background: linear-gradient(135deg, #00b894, #00cec9); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
        .contact-btn { display: inline-block; background-color: white; color: #00b894; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 8px; }
        .portal-btn { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; }
        .action-items { background-color: #e8f5e8; padding: 25px; border-radius: 12px; margin: 25px 0; }
        .action-items h3 { color: #2d5a2d; margin-top: 0; }
        .action-items ul { margin: 0; padding-left: 20px; }
        .action-items li { margin: 8px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Wedding Inquiry!</h1>
          <p>You have a potential new client waiting</p>
        </div>
        
        <div class="content">
          <div class="urgent-alert">
            ⏰ <strong>URGENT:</strong> Please respond within 24 hours to maintain high customer satisfaction and secure this booking!
          </div>

          <div class="inquiry-badge">
            📋 Inquiry #${data.inquiryId.toString().padStart(6, "0")}
          </div>

          <div class="client-info">
            <h3>👰🤵 Client Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">Couple Names</div>
                <div class="detail-value">${data.brideName} & ${
    data.groomName
  }</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Primary Contact</div>
                <div class="detail-value">${data.clientName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Email Address</div>
                <div class="detail-value">${data.clientEmail}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Phone Number</div>
                <div class="detail-value">${data.clientPhone}</div>
              </div>
            </div>
          </div>

          <div class="event-details">
            <h3>📅 Event Details</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">Event Type</div>
                <div class="detail-value">${
                  data.eventType.charAt(0).toUpperCase() +
                  data.eventType.slice(1)
                }</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Event Date</div>
                <div class="detail-value">${data.eventDate}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Venue Location</div>
                <div class="detail-value">${data.location}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Expected Guests</div>
                <div class="detail-value">${data.guestCount} people</div>
              </div>
            </div>
          </div>

          <div class="contact-section">
            <h3>📞 Take Immediate Action</h3>
            <p><strong>Strike while the iron is hot!</strong> Contact ${
              data.clientName
            } now to discuss their dream wedding and secure this booking.</p>
            
            <a href="mailto:${data.clientEmail}?subject=Re: Wedding Inquiry #${
    data.inquiryId
  } - ${data.brideName} & ${data.groomName}&body=Dear ${
    data.clientName
  },%0A%0AThank you for your wedding inquiry! I'm thrilled about the opportunity to create beautiful floral arrangements for ${
    data.brideName
  } and ${
    data.groomName
  }'s special day.%0A%0AI would love to schedule a consultation to discuss your vision and provide you with a personalized proposal that brings your dream wedding to life.%0A%0AWhen would be the best time for a call or in-person meeting?%0A%0ALooking forward to hearing from you!%0A%0AWarm regards,%0A${
    data.vendorName
  }" class="contact-btn">
              📧 Send Email Response
            </a>
            
            <a href="tel:${data.clientPhone}" class="contact-btn">
              📱 Call ${data.clientName}
            </a>
          </div>

          <div class="action-items">
            <h3>🎯 Recommended Next Steps</h3>
            <ul>
              <li><strong>Immediate Response:</strong> Contact the client within 2-4 hours for best results</li>
              <li><strong>Schedule Consultation:</strong> Arrange a meeting to understand their vision</li>
              <li><strong>Gather Details:</strong> Ask about specific flower preferences, color schemes, and budget</li>
              <li><strong>Site Visit:</strong> If possible, visit the venue to plan arrangements</li>
              <li><strong>Create Proposal:</strong> Develop a customized floral package with pricing</li>
              <li><strong>Follow Up:</strong> Stay in touch throughout their decision process</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="https://vendor.wpro.ai/dashboard" class="portal-btn">
              🌟 Manage This Inquiry in Vendor Portal
            </a>
          </div>
        </div>

        <div class="footer">
          <p><strong>💐 Grow Your Business with wpro.ai</strong></p>
          <p>Quick responses lead to more bookings. Don't let this opportunity slip away!</p>
          <p style="font-size: 12px; margin-top: 20px; color: #999;">
            This inquiry was submitted through your wpro.ai vendor profile. Login to manage all communications and bookings.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
