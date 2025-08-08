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
    <!-- head section remains the same -->
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

          <!-- rest of the template remains the same -->
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
    <!-- head section remains the same -->
    <body>
      <div class="container">
        <!-- header remains the same -->
        
        <div class="content">
          <!-- urgent alert remains the same -->

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

          <!-- rest of template remains the same -->
        </div>
      </div>
    </body>
    </html>
  `;
}
