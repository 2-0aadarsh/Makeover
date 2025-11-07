import "dotenv/config"

import transporter from '../configs/nodemailer.config.js';
import { contactUsEmailTemplate, emailTemplate, passwordResetEmailTemplate, bookingNotificationEmailTemplate, welcomeNewsletterEmailTemplate, enquiryNotificationEmailTemplate, enquiryConfirmationEmailTemplate } from '../uitils/emails/emailTemplate.js';

const sendEmailVerification = async (to, subject, htmlContent) => {
  try {
    // Generate the email body with dynamic values (OTP, User, App Name)
    const emailHtml = emailTemplate(htmlContent.otp) // Insert OTP
      .replace('[User]', htmlContent.username) // Insert User Name
      .replace('[Your App Name]', htmlContent.appName); // Insert App Name

    // Mail options
    const mailOptions = {
      from: 'Chittchat <no-reply@chittchat.com>', // Valid sender address
      to: to, // Recipient
      subject: subject, // Subject line
      html: emailHtml, // Email body (HTML format)
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendForgetPassword = async(to, subject, emailContent) => {
  try {
    // Reset URL: frontend + token
    // const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${emailContent.token}`;
    const resetUrl = `${emailContent.url}`;
    // Generate HTML using template
    const emailHtml = passwordResetEmailTemplate(resetUrl)
      .replaceAll('[User]', emailContent.username)
      .replaceAll('[Your App Name]', emailContent.appName);

    const mailOptions = {
      from: 'Chittchat <no-reply@chittchat.com>',
      to,
      subject,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


const sendContactUsMail = async (userData) => {
  try {
    const { name, email, subject, message } = userData;

    // Generate HTML template
    const emailHtml = contactUsEmailTemplate(name, email, message);

    const adminEmail = process.env.ADMIN_EMAIL;

    // Mail options
    const mailOptions = {
      from: `"Wemakeover Contact" <no-reply@chittchat.com>`,
      to: adminEmail, // 🔥 Admin email (replace with real admin email)
      subject: `New Contact Us Message `,
      replyTo: email, // allows admin to reply directly to user
      html: emailHtml,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending Contact Us email:", error);
    throw error;
  }
};

/**
 * Send booking notification email to admin
 * @param {Object} bookingData - Booking details including customer info, services, address, etc.
 * @returns {Promise} - Email send result
 */
const sendBookingNotificationToAdmin = async (bookingData) => {
  try {
    console.log('📧 Preparing to send booking notification email to admin...');
    
    // Format booking date for display
    const bookingDate = new Date(bookingData.bookingDetails.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Prepare email data
    const emailData = {
      orderNumber: bookingData.orderNumber,
      customerName: bookingData.userId?.name || 'N/A',
      customerEmail: bookingData.userId?.email || 'N/A',
      customerPhone: bookingData.bookingDetails?.address?.phone || bookingData.userId?.phone || 'N/A',
      services: bookingData.services,
      bookingDate: bookingDate,
      bookingSlot: bookingData.bookingDetails.slot,
      address: bookingData.bookingDetails.address,
      subtotal: bookingData.pricing.subtotal,
      taxAmount: bookingData.pricing.taxAmount,
      totalAmount: bookingData.pricing.totalAmount,
      paymentMethod: bookingData.paymentDetails?.paymentMethod || 'online',
      paymentStatus: bookingData.paymentStatus,
      status: bookingData.status
    };

    // Generate HTML template
    const emailHtml = bookingNotificationEmailTemplate(emailData);

    // Get admin email from environment variable or use default
    const adminEmail = process.env.ADMIN_EMAIL ;

    // Mail options
    const mailOptions = {
      from: `"Wemakeover Bookings" <no-reply@chittchat.com>`,
      to: adminEmail,
      subject: `🎉 New Booking Received - Order #${bookingData.orderNumber}`,
      replyTo: emailData.customerEmail, // allows admin to reply directly to customer
      html: emailHtml,
    };

    console.log('📧 Sending booking notification email to:', adminEmail);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Booking notification email sent successfully:', info.messageId);
    
    return info;
  } catch (error) {
    console.error("❌ Error sending booking notification email:", error);
    // Don't throw error - we don't want to break booking flow if email fails
    // Just log it and continue
    return null;
  }
};

/**
 * Send welcome email to newsletter subscriber
 * @param {Object} subscriberData - Subscriber email and unsubscribe token
 * @returns {Promise} - Email send result
 */
const sendWelcomeNewsletterEmail = async (subscriberData) => {
  try {
    const { email, unsubscribeToken } = subscriberData;
    
    console.log('📧 Preparing to send welcome newsletter email to:', email);
    
    // Build unsubscribe URL
    const unsubscribeUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/newsletter/unsubscribe/${unsubscribeToken}`;
    
    // Generate HTML template
    const emailHtml = welcomeNewsletterEmailTemplate({
      unsubscribeUrl
    });
    
    // Mail options
    const mailOptions = {
      from: '"Wemakeover Newsletter" <no-reply@chittchat.com>',
      to: email,
      subject: "Welcome to Wemakeover's Community Circle! ✨",
      html: emailHtml,
    };
    
    console.log('📧 Sending welcome newsletter email to:', email);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Welcome newsletter email sent successfully:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Error sending welcome newsletter email:', error);
    // Don't throw error - we don't want to break subscription flow if email fails
    return null;
  }
};

/**
 * Send enquiry notification email to admin
 * @param {Object} enquiryData - Enquiry details including customer info, service details, etc.
 * @returns {Promise} - Email send result
 */
const sendEnquiryNotificationToAdmin = async (enquiryData) => {
  try {
    console.log('📧 Preparing to send enquiry notification email to admin...');
    
    // Generate HTML template
    const emailHtml = enquiryNotificationEmailTemplate(enquiryData);
    
    // Get admin email from environment variable or use default
    const adminEmail = process.env.ADMIN_EMAIL;
    
    // Mail options
    const mailOptions = {
      from: '"Wemakeover Enquiries" <no-reply@chittchat.com>',
      to: adminEmail,
      subject: `🔔 New Service Enquiry - ${enquiryData.enquiryNumber}`,
      replyTo: enquiryData.userDetails.email, // allows admin to reply directly to customer
      html: emailHtml,
    };
    
    console.log('📧 Sending enquiry notification email to:', adminEmail);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Enquiry notification email sent successfully:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Error sending enquiry notification email:', error);
    // Don't throw error - we don't want to break enquiry flow if email fails
    return null;
  }
};

/**
 * Send enquiry confirmation email to user
 * @param {Object} enquiryData - Enquiry details including customer info, service details, etc.
 * @returns {Promise} - Email send result
 */
const sendEnquiryConfirmationToUser = async (enquiryData) => {
  try {
    const { userDetails, enquiryNumber } = enquiryData;
    
    console.log('📧 Preparing to send enquiry confirmation email to user:', userDetails.email);
    
    // Generate HTML template
    const emailHtml = enquiryConfirmationEmailTemplate(enquiryData);
    
    // Mail options
    const mailOptions = {
      from: '"Wemakeover Services" <no-reply@chittchat.com>',
      to: userDetails.email,
      subject: `✅ We received your enquiry - ${enquiryNumber}`,
      html: emailHtml,
    };
    
    console.log('📧 Sending enquiry confirmation email to:', userDetails.email);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Enquiry confirmation email sent successfully:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Error sending enquiry confirmation email:', error);
    // Don't throw error - we don't want to break enquiry flow if email fails
    return null;
  }
};

export { sendEmailVerification, sendForgetPassword, sendContactUsMail, sendBookingNotificationToAdmin, sendWelcomeNewsletterEmail, sendEnquiryNotificationToAdmin, sendEnquiryConfirmationToUser };