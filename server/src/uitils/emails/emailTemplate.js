import 'dotenv/config';

const emailTemplate = (otp) => `
        <!DOCTYPE html>
        <html>

        <head>
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }

                .email-container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .header {
                    background-color: #4caf50;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                    font-size: 24px;
                }

                .content {
                    padding: 20px;
                    color: #333333;
                    line-height: 1.6;
                }

                .content p {
                    margin: 0 0 20px;
                }

                .otp-box {
                    display: block; /*Makes the box take up the full width*/
                    width: 85%; /* Full width */
                    text-align: center; /* Centers the text */
                    background-color: #4caf50;
                    color: #ffffff;
                    padding: 12px 25px;
                    border-radius: 4px; 
                    font-size: 25px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .footer {
                    background-color: #f4f4f4;
                    color: #888888;
                    text-align: center;
                    padding: 10px 20px;
                    font-size: 12px;
                }
            </style>
        </head>

        <body>
            <div class="email-container">
                <div class="header">
                    Verify Your Email
                </div>
                <div class="content">
                    <p>Hi [User],</p>
                    <p>Thank you for signing up! Use the OTP below to verify your email address:</p>
                    <div class="otp-box">
                        ${otp} <!-- Insert dynamic OTP here -->
                    </div>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Best regards,<br>The [Your App Name] Team</p>
                </div>
                <div class="footer">
                    © 2024 pingpong. All rights reserved.
                </div>
            </div>
        </body>

        </html>`;

const passwordResetEmailTemplate = (resetLink) => `
<!DOCTYPE html>
<html>
<head>
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 10px 0;
    }
    .header h1 {
      color: #333333;
      font-size: 24px;
    }
    .content {
      margin: 20px 0;
      line-height: 1.6;
      color: #555555;
    }
    .button {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 10px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello [User],</p>
      <p>We received a request to reset your password for your [Your App Name] account. Click the button below to reset your password:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>
      <p>If you didn’t request this, you can safely ignore this email. Your password will not be changed.</p>
      <p>For your security, this link will expire in 1 hour from now.</p>
    </div>
    <div class="footer">
      <p>&copy; [Your App Name] | All rights reserved</p>
    </div>
  </div>
</body>
</html>
`;

const contactUsEmailTemplate = (userName, userEmail, message) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>New Contact Us Message</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 650px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
      }
      .header {
        background: #2563eb;
        color: #ffffff;
        text-align: center;
        padding: 20px 15px;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .content {
        padding: 25px;
        color: #333333;
        line-height: 1.6;
      }
      .content p {
        margin: 8px 0;
      }
      .highlight {
        font-weight: bold;
        color: #111827;
      }
      .message-box {
        margin-top: 15px;
        padding: 15px;
        background: #f9fafb;
        border-left: 4px solid #2563eb;
        border-radius: 6px;
        font-style: italic;
        color: #444;
      }
      .footer {
        background: #f1f5f9;
        padding: 15px;
        text-align: center;
        font-size: 13px;
        color: #6b7280;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Request</h1>
      </div>
      <div class="content">
        <p>Hello <span class="highlight">Admin</span>,</p>
        <p>You’ve received a new message from the Contact Us form.</p>
        
        <p><span class="highlight">Name:</span> ${userName}</p>
        <p><span class="highlight">Email:</span> ${userEmail}</p>
        
        <div class="message-box">
          ${message}
        </div>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Chittchat — Contact Us Notification
      </div>
    </div>
  </body>
  </html>
  `;
};

const bookingNotificationEmailTemplate = (bookingData) => {
  const { 
    orderNumber, 
    customerName, 
    customerEmail, 
    customerPhone, 
    services, 
    bookingDate, 
    bookingSlot, 
    address, 
    subtotal, 
    taxAmount, 
    totalAmount, 
    paymentMethod, 
    paymentStatus, 
    status 
  } = bookingData;

  // Format services list HTML
  const servicesListHTML = services.map(service => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${service.name}</strong>
        ${service.description ? `<br/><span style="font-size: 13px; color: #6b7280;">${service.description}</span>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${service.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ₹${service.price.toFixed(2)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
        ₹${(service.price * service.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  // Format address - use completeAddress if available, otherwise build from components
  const fullAddress = address.completeAddress || 
    `${address.houseFlatNumber ? address.houseFlatNumber + ', ' : ''}${address.streetAreaName ? address.streetAreaName + ', ' : ''}${address.city}, ${address.state} - ${address.pincode}`.trim();

  // Status badge color - show booking status as primary
  const statusColor = status === 'confirmed' ? '#10b981' : status === 'pending' ? '#f59e0b' : status === 'cancelled' ? '#ef4444' : '#6b7280';
  const statusLabel = status.toUpperCase();
  
  // Payment method badge color
  const paymentMethodColor = paymentMethod === 'cod' ? '#3b82f6' : paymentMethod === 'online' ? '#10b981' : '#6b7280';
  const paymentMethodLabel = (paymentMethod || 'online').toUpperCase();

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Booking Notification</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 700px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0px 10px 30px rgba(0,0,0,0.1);
      }
      .header {
        background: linear-gradient(135deg, #CC2B52 0%, #B02547 100%);
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
      }
      .header h1 {
        margin: 0 0 10px 0;
        font-size: 28px;
        font-weight: 700;
      }
      .header p {
        margin: 0;
        font-size: 16px;
        opacity: 0.95;
      }
      .content {
        padding: 30px;
        color: #1f2937;
      }
      .order-badge {
        display: inline-block;
        background: #fef3c7;
        color: #92400e;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .status-badges {
        display: flex;
        gap: 10px;
        margin-bottom: 25px;
        flex-wrap: wrap;
      }
      .badge {
        padding: 6px 14px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .section {
        margin-bottom: 30px;
      }
      .section-title {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 15px;
        padding-bottom: 8px;
        border-bottom: 2px solid #CC2B52;
      }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 20px;
      }
      .info-item {
        background: #f9fafb;
        padding: 12px;
        border-radius: 8px;
      }
      .info-label {
        font-size: 12px;
        color: #6b7280;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .info-value {
        font-size: 15px;
        color: #111827;
        font-weight: 500;
      }
      .services-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
      }
      .services-table thead {
        background: #f3f4f6;
      }
      .services-table th {
        padding: 12px;
        text-align: left;
        font-size: 13px;
        color: #374151;
        font-weight: 600;
        text-transform: uppercase;
      }
      .pricing-summary {
        background: #f9fafb;
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
      }
      .pricing-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 15px;
      }
      .pricing-row.total {
        border-top: 2px solid #CC2B52;
        margin-top: 10px;
        padding-top: 15px;
        font-size: 18px;
        font-weight: 700;
        color: #CC2B52;
      }
      .address-box {
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
      }
      .footer {
        background: #f9fafb;
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: #6b7280;
        border-top: 1px solid #e5e7eb;
      }
      .footer-actions {
        margin-top: 15px;
      }
      .action-button {
        display: inline-block;
        background: #CC2B52;
        color: #ffffff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        margin: 5px;
      }
      @media only screen and (max-width: 600px) {
        .info-grid {
          grid-template-columns: 1fr;
        }
        .services-table {
          font-size: 12px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>New Booking Received</h1>
        <p>A new customer has booked your services</p>
      </div>

      <!-- Content -->
      <div class="content">
        <!-- Order Number Badge -->
        <div class="order-badge">
          Order #${orderNumber}
        </div>

        <!-- Status Badges -->
        <div class="status-badges">
          <span class="badge" style="background-color: ${statusColor}; color: white;">
            ${statusLabel}
          </span>
          <span class="badge" style="background-color: ${paymentMethodColor}; color: white;">
            ${paymentMethodLabel}
          </span>
        </div>

        <!-- Customer Information -->
        <div class="section">
          <div class="section-title">Customer Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Customer Name</div>
              <div class="info-value">${customerName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Phone Number</div>
              <div class="info-value">${customerPhone}</div>
            </div>
            <div class="info-item" style="grid-column: span 2;">
              <div class="info-label">Email Address</div>
              <div class="info-value">${customerEmail}</div>
            </div>
          </div>
        </div>

        <!-- Booking Details -->
        <div class="section">
          <div class="section-title">Booking Details</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Booking Date</div>
              <div class="info-value">${bookingDate}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Time Slot</div>
              <div class="info-value">${bookingSlot}</div>
            </div>
          </div>
          
          <div class="address-box">
            <div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">Service Location</div>
            <div style="color: #78350f; font-size: 14px; line-height: 1.6;">
              ${fullAddress}
            </div>
          </div>
        </div>

        <!-- Services Booked -->
        <div class="section">
          <div class="section-title">Services Booked</div>
          <table class="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${servicesListHTML}
            </tbody>
          </table>
        </div>

        <!-- Pricing Summary -->
        <div class="pricing-summary">
          <div class="pricing-row">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          <div class="pricing-row">
            <span>Tax (18% GST):</span>
            <span>₹${taxAmount.toFixed(2)}</span>
          </div>
          <div class="pricing-row total">
            <span>Total Amount:</span>
            <span>₹${totalAmount.toFixed(2)}</span>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">
          Action Required
        </p>
        <p style="margin: 0 0 15px 0;">
          Please review this booking and prepare for the scheduled service.
        </p>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
          © ${new Date().getFullYear()} Wemakeover - Beauty Services Platform<br/>
          This is an automated notification. Please do not reply to this email.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

const welcomeNewsletterEmailTemplate = (data) => {
  const { unsubscribeUrl } = data;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Wemakeover Newsletter</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0px 10px 30px rgba(0,0,0,0.1);
      }
      .header {
        background: linear-gradient(135deg, #CC2B52 0%, #B02547 100%);
        color: #ffffff;
        text-align: center;
        padding: 40px 20px;
      }
      .header h1 {
        margin: 0 0 10px 0;
        font-size: 32px;
        font-weight: 700;
      }
      .header p {
        margin: 0;
        font-size: 16px;
        opacity: 0.95;
      }
      .content {
        padding: 40px 30px;
        color: #1f2937;
      }
      .welcome-message {
        text-align: center;
        margin-bottom: 30px;
      }
      .welcome-message h2 {
        color: #111827;
        font-size: 24px;
        margin-bottom: 15px;
      }
      .welcome-message p {
        color: #6b7280;
        font-size: 16px;
        line-height: 1.6;
      }
      .benefits-section {
        background: #f9fafb;
        padding: 25px;
        border-radius: 12px;
        margin: 30px 0;
      }
      .benefits-section h3 {
        color: #CC2B52;
        font-size: 18px;
        margin-bottom: 15px;
      }
      .benefit-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 15px;
      }
      .benefit-icon {
        width: 24px;
        height: 24px;
        background: #CC2B52;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        flex-shrink: 0;
        margin-right: 12px;
      }
      .benefit-text {
        color: #374151;
        font-size: 15px;
        line-height: 1.5;
      }
      .cta-section {
        text-align: center;
        margin: 30px 0;
      }
      .cta-button {
        display: inline-block;
        background: #CC2B52;
        color: #ffffff;
        padding: 14px 32px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        transition: background 0.3s;
      }
      .cta-button:hover {
        background: #B02547;
      }
      .footer {
        background: #f9fafb;
        padding: 25px;
        text-align: center;
        font-size: 13px;
        color: #6b7280;
        border-top: 1px solid #e5e7eb;
      }
      .footer a {
        color: #CC2B52;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      .social-links {
        margin: 20px 0;
      }
      .social-links a {
        display: inline-block;
        margin: 0 8px;
        color: #6b7280;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Welcome to Wemakeover</h1>
        <p>Your Beauty Journey Starts Here</p>
      </div>

      <!-- Content -->
      <div class="content">
        <!-- Welcome Message -->
        <div class="welcome-message">
          <h2>Thank You for Subscribing!</h2>
          <p>
            We're thrilled to have you join our beauty community. Get ready for exclusive tips, 
            special offers, and the latest updates on our at-home beauty services.
          </p>
        </div>

        <!-- Benefits Section -->
        <div class="benefits-section">
          <h3>What You'll Get:</h3>
          
          <div class="benefit-item">
            <div class="benefit-icon">✓</div>
            <div class="benefit-text">
              <strong>Beauty Tips & Tricks:</strong> Expert advice on skincare, haircare, and makeup delivered to your inbox
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon">✓</div>
            <div class="benefit-text">
              <strong>Exclusive Offers:</strong> Be the first to know about special discounts and seasonal promotions
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon">✓</div>
            <div class="benefit-text">
              <strong>New Service Updates:</strong> Stay informed about our latest beauty services and offerings
            </div>
          </div>

          <div class="benefit-item">
            <div class="benefit-icon">✓</div>
            <div class="benefit-text">
              <strong>Wellness Content:</strong> Holistic beauty and self-care inspiration to help you look and feel your best
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="cta-section">
          <p style="color: #6b7280; margin-bottom: 20px;">
            Ready to experience luxury beauty services at home?
          </p>
          <a href="${process.env.FRONTEND_URL || 'https://makeover.com'}" class="cta-button">
            Explore Our Services
          </a>
        </div>

        <!-- Frequency Info -->
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            You'll receive our newsletter bi-weekly, packed with valuable content. 
            We respect your inbox and promise no spam!
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="social-links">
          <a href="#">Facebook</a> • 
          <a href="#">Instagram</a> • 
          <a href="#">Twitter</a>
        </div>
        
        <p style="margin: 15px 0;">
          Questions? Contact us at <a href="mailto:support@Wemakeover.com">support@Wemakeover.com</a>
        </p>
        
        <p style="margin: 15px 0; font-size: 12px;">
          <a href="${unsubscribeUrl}">Unsubscribe</a> • 
          <a href="${process.env.FRONTEND_URL}/privacy-policy">Privacy Policy</a>
        </p>
        
        <p style="margin: 15px 0; color: #9ca3af; font-size: 11px;">
          © ${new Date().getFullYear()} Wemakeover - Beauty Services Platform<br/>
          Delivering beauty to your doorstep
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Enquiry Notification Email Template for Admin
const enquiryNotificationEmailTemplate = (enquiryData) => {
  const {
    enquiryNumber,
    userDetails,
    serviceDetails,
    enquiryDetails,
    status,
    priority,
    createdAt,
    userId,
  } = enquiryData;

  const userType = userId ? 'Registered User' : 'Guest User';
  
  // Priority colors
  const priorityColors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };
  
  const priorityColor = priorityColors[priority] || priorityColors.medium;
  
  // Status colors
  const statusColors = {
    pending: '#f59e0b',
    contacted: '#3b82f6',
    quoted: '#8b5cf6',
    converted: '#10b981',
    cancelled: '#6b7280',
  };
  
  const statusColor = statusColors[status] || statusColors.pending;
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Service Enquiry</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 650px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0px 4px 20px rgba(0,0,0,0.08);
        box-sizing: border-box;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .header {
        background: linear-gradient(135deg, #CC2B52 0%, #B02547 100%);
        color: #ffffff;
        text-align: center;
        padding: 30px 20px;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .header h1 {
        margin: 0 0 10px 0;
        font-size: 28px;
        font-weight: 700;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .header p {
        margin: 0;
        font-size: 14px;
        opacity: 0.95;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .content {
        padding: 30px;
        color: #1f2937;
        box-sizing: border-box;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .enquiry-number {
        text-align: center;
        background: #fef3c7;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 25px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        box-sizing: border-box;
      }
      .enquiry-number h2 {
        margin: 0;
        color: #92400e;
        font-size: 24px;
        font-weight: 700;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
      }
      .badges {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 25px;
        flex-wrap: wrap;
      }
      .badge {
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
        word-wrap: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
      }
      .info-card {
        background: #f9fafb;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
        border-left: 4px solid #CC2B52;
        word-wrap: break-word;
        overflow-wrap: break-word;
        box-sizing: border-box;
      }
      .info-card h3 {
        margin: 0 0 15px 0;
        color: #111827;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .info-row {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #e5e7eb;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .info-row:last-child {
        border-bottom: none;
      }
      .info-label {
        font-weight: 600;
        color: #6b7280;
        min-width: 140px;
        max-width: 140px;
        font-size: 14px;
        flex-shrink: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .info-value {
        color: #111827;
        font-size: 14px;
        flex: 1;
        min-width: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        line-height: 1.5;
      }
      .info-value a {
        word-break: break-all;
        overflow-wrap: anywhere;
      }
      .info-value strong {
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .message-box {
        background: #fff;
        border: 2px dashed #d1d5db;
        padding: 15px;
        border-radius: 8px;
        margin-top: 10px;
        font-style: italic;
        color: #4b5563;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        line-height: 1.6;
        white-space: pre-wrap;
      }
      .footer {
        background: #f9fafb;
        padding: 25px 30px;
        text-align: center;
        color: #6b7280;
        font-size: 13px;
      }
      .footer p {
        margin: 8px 0;
      }
      .icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: #CC2B52;
        color: white;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>New Service Enquiry Received</h1>
        <p>A customer is interested in your services</p>
      </div>

      <!-- Content -->
      <div class="content">
        <!-- Enquiry Number -->
        <div class="enquiry-number">
          <h2>${enquiryNumber}</h2>
        </div>

        <!-- Status Badges -->
        <div class="badges">
          <span class="badge" style="background-color: ${statusColor};">
            ${status.toUpperCase()}
          </span>
          <span class="badge" style="background-color: ${priorityColor};">
            ${priority.toUpperCase()} PRIORITY
          </span>
          <span class="badge" style="background-color: #6366f1;">
            ${userType}
          </span>
        </div>

        <!-- Service Details -->
        <div class="info-card">
          <h3>
            <span class="icon">★</span>
            Service Details
          </h3>
          <div class="info-row">
            <span class="info-label">Service Name:</span>
            <span class="info-value"><strong>${serviceDetails.serviceName}</strong></span>
          </div>
          <div class="info-row">
            <span class="info-label">Category:</span>
            <span class="info-value">${serviceDetails.serviceCategory}</span>
          </div>
          ${serviceDetails.priceRange ? `
          <div class="info-row">
            <span class="info-label">Price Range:</span>
            <span class="info-value">₹${serviceDetails.priceRange}</span>
          </div>
          ` : ''}
        </div>

        <!-- Customer Details -->
        <div class="info-card">
          <h3>
            <span class="icon">👤</span>
            Customer Details
          </h3>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${userDetails.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">
              <a href="mailto:${userDetails.email}" style="color: #CC2B52; text-decoration: none; word-break: break-all; overflow-wrap: anywhere;">
                ${userDetails.email}
              </a>
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">
              <a href="tel:${userDetails.phone}" style="color: #CC2B52; text-decoration: none; word-break: break-word;">
                ${userDetails.phone}
              </a>
            </span>
          </div>
        </div>

        <!-- Enquiry Details -->
        ${enquiryDetails && (enquiryDetails.message || enquiryDetails.preferredDate || enquiryDetails.preferredTimeSlot) ? `
        <div class="info-card">
          <h3>
            <span class="icon">📋</span>
            Enquiry Details
          </h3>
          ${enquiryDetails.preferredDate ? `
          <div class="info-row">
            <span class="info-label">Preferred Date:</span>
            <span class="info-value">${new Date(enquiryDetails.preferredDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
          </div>
          ` : ''}
          ${enquiryDetails.preferredTimeSlot ? `
          <div class="info-row">
            <span class="info-label">Preferred Time:</span>
            <span class="info-value">${enquiryDetails.preferredTimeSlot}</span>
          </div>
          ` : ''}
          ${enquiryDetails.message ? `
          <div class="info-row">
            <span class="info-label">Message:</span>
          </div>
          <div class="message-box">
            "${enquiryDetails.message}"
          </div>
          ` : ''}
          ${enquiryDetails.additionalRequirements ? `
          <div class="info-row">
            <span class="info-label">Additional Requirements:</span>
          </div>
          <div class="message-box">
            ${enquiryDetails.additionalRequirements}
          </div>
          ` : ''}
        </div>
        ` : ''}

        <!-- Timestamp -->
        <div style="text-align: center; margin-top: 25px; padding: 15px; background: #eff6ff; border-radius: 8px; word-wrap: break-word; overflow-wrap: break-word; box-sizing: border-box;">
          <p style="margin: 0; color: #1e40af; font-size: 13px; font-weight: 500; word-wrap: break-word; overflow-wrap: break-word;">
            Enquiry received on: ${formattedDate}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">
          Action Required
        </p>
        <p style="margin: 0 0 15px 0;">
          Please contact the customer as soon as possible to discuss their requirements.
        </p>
        <div style="font-size: 11px; color: #9ca3af; margin-top: 15px;">
          © ${new Date().getFullYear()} Wemakeover - Beauty Services Platform<br/>
          This is an automated notification. Please do not reply to this email.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Enquiry Confirmation Email Template for User
const enquiryConfirmationEmailTemplate = (enquiryData) => {
  const {
    enquiryNumber,
    userDetails,
    serviceDetails,
    enquiryDetails,
    createdAt,
  } = enquiryData;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Enquiry Confirmation</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0px 4px 20px rgba(0,0,0,0.08);
      }
      .header {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: #ffffff;
        text-align: center;
        padding: 40px 20px;
      }
      .header h1 {
        margin: 0 0 10px 0;
        font-size: 32px;
        font-weight: 700;
      }
      .header p {
        margin: 0;
        font-size: 16px;
        opacity: 0.95;
      }
      .content {
        padding: 40px 30px;
        color: #1f2937;
      }
      .success-icon {
        text-align: center;
        font-size: 60px;
        margin-bottom: 20px;
      }
      .enquiry-number-box {
        text-align: center;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
        border: 2px solid #fbbf24;
      }
      .enquiry-number-box p {
        margin: 0 0 10px 0;
        color: #78350f;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .enquiry-number-box h2 {
        margin: 0;
        color: #92400e;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 2px;
      }
      .service-summary {
        background: #f9fafb;
        padding: 20px;
        border-radius: 10px;
        margin: 25px 0;
        border-left: 4px solid #10b981;
      }
      .service-summary h3 {
        margin: 0 0 15px 0;
        color: #111827;
        font-size: 16px;
        font-weight: 600;
      }
      .service-row {
        display: flex;
        padding: 8px 0;
      }
      .service-label {
        font-weight: 600;
        color: #6b7280;
        min-width: 120px;
        font-size: 14px;
      }
      .service-value {
        color: #111827;
        font-size: 14px;
      }
      .timeline {
        background: #eff6ff;
        padding: 25px;
        border-radius: 10px;
        margin: 25px 0;
      }
      .timeline h3 {
        margin: 0 0 20px 0;
        color: #1e40af;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
      }
      .timeline-step {
        display: table;
        width: 100%;
        margin-bottom: 15px;
        table-layout: fixed;
      }
      .timeline-step:last-child {
        margin-bottom: 0;
      }
      .timeline-number {
        background: #3b82f6;
        color: white;
        width: 30px;
        height: 30px;
        min-width: 30px;
        border-radius: 50%;
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        line-height: 30px;
        font-weight: 700;
        font-size: 14px;
        padding-right: 15px;
      }
      .timeline-content {
        display: table-cell;
        vertical-align: top;
        padding-top: 4px;
      }
      .timeline-content strong {
        color: #1e40af;
        font-size: 15px;
      }
      .timeline-content p {
        margin: 5px 0 0 0;
        color: #4b5563;
        font-size: 13px;
        line-height: 1.5;
      }
      .contact-box {
        background: #fef2f2;
        padding: 20px;
        border-radius: 10px;
        margin: 25px 0;
        text-align: center;
        border: 2px solid #fecaca;
      }
      .contact-box h3 {
        margin: 0 0 10px 0;
        color: #991b1b;
        font-size: 16px;
      }
      .contact-box p {
        margin: 5px 0;
        color: #7f1d1d;
        font-size: 14px;
      }
      .contact-box a {
        color: #CC2B52;
        text-decoration: none;
        font-weight: 600;
      }
      .footer {
        background: #f9fafb;
        padding: 25px 30px;
        text-align: center;
        color: #6b7280;
        font-size: 13px;
      }
      .footer p {
        margin: 8px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="success-icon">✓</div>
        <h1>Thank You for Your Enquiry!</h1>
        <p>We've received your service request</p>
      </div>

      <!-- Content -->
      <div class="content">
        <p style="font-size: 16px; color: #4b5563; text-align: center; margin-bottom: 30px;">
          Hi <strong>${userDetails.name}</strong>, <br/>
          Thank you for your interest in our services. We're excited to help you look and feel your best!
        </p>

        <!-- Enquiry Number -->
        <div class="enquiry-number-box">
          <p>Your Enquiry Reference Number</p>
          <h2>${enquiryNumber}</h2>
        </div>

        <!-- Service Summary -->
        <div class="service-summary">
          <h3>📝 Service Summary</h3>
          <div class="service-row">
            <span class="service-label">Service:</span>
            <span class="service-value"><strong>${serviceDetails.serviceName}</strong></span>
          </div>
          <div class="service-row">
            <span class="service-label">Category:</span>
            <span class="service-value">${serviceDetails.serviceCategory}</span>
          </div>
          ${serviceDetails.priceRange ? `
          <div class="service-row">
            <span class="service-label">Price Range:</span>
            <span class="service-value">₹${serviceDetails.priceRange}</span>
          </div>
          ` : ''}
          ${enquiryDetails?.preferredDate ? `
          <div class="service-row">
            <span class="service-label">Preferred Date:</span>
            <span class="service-value">${new Date(enquiryDetails.preferredDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
          </div>
          ` : ''}
          <div class="service-row">
            <span class="service-label">Submitted on:</span>
            <span class="service-value">${formattedDate}</span>
          </div>
        </div>

        <!-- Timeline -->
        <div class="timeline">
          <h3>🕒 What Happens Next?</h3>
          
          <div class="timeline-step">
            <div class="timeline-number">1</div>
            <div class="timeline-content">
              <strong>Review Your Enquiry</strong>
              <p>Our team is reviewing your request and will get back to you shortly.</p>
            </div>
          </div>

          <div class="timeline-step">
            <div class="timeline-number">2</div>
            <div class="timeline-content">
              <strong>Get in Touch</strong>
              <p>We'll contact you within 24 hours via phone or email to discuss your requirements.</p>
            </div>
          </div>

          <div class="timeline-step">
            <div class="timeline-number">3</div>
            <div class="timeline-content">
              <strong>Confirm Booking</strong>
              <p>Once we discuss the details, we'll help you book your service at a convenient time.</p>
            </div>
          </div>

          <div class="timeline-step">
            <div class="timeline-number">4</div>
            <div class="timeline-content">
              <strong>Enjoy Your Service</strong>
              <p>Sit back and relax while our professionals take care of you!</p>
            </div>
          </div>
        </div>

        <!-- Contact Box -->
        <div class="contact-box">
          <h3>Need Help?</h3>
          <p>If you have any questions or need immediate assistance, feel free to contact us:</p>
          <p>
            📧 Email: <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a><br/>
            📱 Phone: <a href="tel:${process.env.ADMIN_PHONE_NUMBER}">+91 ${process.env.ADMIN_PHONE_NUMBER}</a>
          </p>
        </div>

        <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
          Please save your enquiry number <strong>${enquiryNumber}</strong> for future reference.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="font-weight: 600; color: #374151;">
          Thank you for choosing Wemakeover!
        </p>
        <p>
          We're committed to providing you with the best beauty services.
        </p>
        <div style="font-size: 11px; color: #9ca3af; margin-top: 15px;">
          © ${new Date().getFullYear()} Wemakeover - Beauty Services Platform<br/>
          Delivering beauty to your doorstep
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

export { emailTemplate, passwordResetEmailTemplate, contactUsEmailTemplate, bookingNotificationEmailTemplate, welcomeNewsletterEmailTemplate, enquiryNotificationEmailTemplate, enquiryConfirmationEmailTemplate };
