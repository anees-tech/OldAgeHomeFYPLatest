const nodemailer = require("nodemailer");

// Create transporter with your email credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "aneesliaqat557@gmail.com",
    pass: process.env.EMAIL_PASS || "xobg yrab vxuh kmiy",
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Email templates
const emailTemplates = {
  contactConfirmation: (name, email) => ({
    from: process.env.EMAIL_USER || "aneesliaqat557@gmail.com",
    to: email,
    subject: "Thank you for contacting Golden Years Home",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Golden Years Home</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for reaching out to us</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e1e8ed; border-radius: 0 0 10px 10px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Dear ${name},</h2>
          <p style="color: #555; line-height: 1.6;">We have received your message and appreciate you taking the time to contact us.</p>
          <p style="color: #555; line-height: 1.6;">Our team will review your inquiry and get back to you within 24 hours during business days.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Contact Information:</h3>
            <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> (555) 123-4567</p>
            <p style="margin: 5px 0; color: #555;"><strong>Emergency:</strong> (555) 987-6543</p>
            <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> info@goldenyearshome.com</p>
          </div>
          <p style="color: #555; line-height: 1.6;">Best regards,<br><strong>Golden Years Home Team</strong></p>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>Golden Years Home - Caring for Your Loved Ones</p>
        </div>
      </div>
    `,
  }),

  admissionConfirmation: (name, email, residentName) => ({
    from: process.env.EMAIL_USER || "aneesliaqat557@gmail.com",
    to: email,
    subject: "Admission Application Received - Golden Years Home",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Application Received</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Golden Years Home</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e1e8ed; border-radius: 0 0 10px 10px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Dear ${name},</h2>
          <p style="color: #555; line-height: 1.6;">Thank you for submitting an admission application for <strong>${residentName}</strong>.</p>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <h3 style="color: #27ae60; margin-top: 0;">Application Status: Received</h3>
            <p style="margin: 5px 0; color: #555;">Our admissions team will review the application and contact you within 2-3 business days.</p>
          </div>
          <h3 style="color: #2c3e50;">Next Steps:</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>Application review by our admissions committee</li>
            <li>Background and medical record verification</li>
            <li>Scheduling of facility tour and assessment</li>
            <li>Final admission decision notification</li>
          </ul>
          <p style="color: #555; line-height: 1.6;">If you have any urgent questions, please don't hesitate to contact us.</p>
          <p style="color: #555; line-height: 1.6;">Best regards,<br><strong>Golden Years Home Admissions Team</strong></p>
        </div>
      </div>
    `,
  }),

  donationConfirmation: (name, email, amount, donationType) => ({
    from: process.env.EMAIL_USER || "aneesliaqat557@gmail.com",
    to: email,
    subject: "Thank you for your generous donation - Golden Years Home",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Thank You!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your generosity makes a difference</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e1e8ed; border-radius: 0 0 10px 10px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Dear ${name},</h2>
          <p style="color: #555; line-height: 1.6;">Thank you for your generous ${donationType} ${typeof amount === 'number' ? `donation of <strong>$${amount}</strong>` : 'contribution'}.</p>
          ${typeof amount === 'number' ? `
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
            <h3 style="color: #f39c12; margin-top: 0;">Donation Details:</h3>
            <p style="margin: 5px 0; color: #555;"><strong>Amount:</strong> $${amount}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Type:</strong> ${donationType}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          ` : ''}
          <p style="color: #555; line-height: 1.6;">Your contribution helps us provide:</p>
          <ul style="color: #555; line-height: 1.8;">
            <li>Quality healthcare and medical services</li>
            <li>Nutritious meals and dietary support</li>
            <li>Recreational activities and social programs</li>
            <li>Comfortable living facilities and amenities</li>
            <li>Professional care and support staff</li>
          </ul>
          ${typeof amount === 'number' ? '<p style="color: #555; line-height: 1.6;">A receipt for your donation will be mailed to you for tax purposes.</p>' : ''}
          <p style="color: #555; line-height: 1.6;">With heartfelt gratitude,<br><strong>Golden Years Home Team</strong></p>
        </div>
      </div>
    `,
  }),

  // Admin notification emails
  newContactNotification: (contactData) => ({
    from: process.env.EMAIL_USER || "aneesliaqat557@gmail.com",
    to: process.env.ADMIN_EMAIL || "aneesliaqat557@gmail.com",
    subject: `New Contact Form Submission - ${contactData.urgency} Priority`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #e74c3c;">New Contact Form Submission</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${contactData.subject || 'General Inquiry'}</p>
          <p><strong>Urgency:</strong> ${contactData.urgency}</p>
          <p><strong>Preferred Contact:</strong> ${contactData.preferredContact}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div style="margin-top: 20px;">
          <h3>Message:</h3>
          <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
            ${contactData.message}
          </div>
        </div>
      </div>
    `,
  }),

  newAdmissionNotification: (admissionData) => ({
    from: process.env.EMAIL_USER || "aneesliaqat557@gmail.com",
    to: process.env.ADMIN_EMAIL || "aneesliaqat557@gmail.com",
    subject: `New Admission Application - ${admissionData.urgency || 'Normal'} Priority`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3498db;">New Admission Application</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3>Resident Information:</h3>
          <p><strong>Name:</strong> ${admissionData.residentInfo.firstName} ${admissionData.residentInfo.lastName}</p>
          <p><strong>Age:</strong> ${admissionData.residentInfo.age}</p>
          <p><strong>Gender:</strong> ${admissionData.residentInfo.gender}</p>
          <p><strong>Date of Birth:</strong> ${new Date(admissionData.residentInfo.dateOfBirth).toLocaleDateString()}</p>
          
          <h3>Contact Information:</h3>
          <p><strong>Contact Person:</strong> ${admissionData.contactInfo.contactName}</p>
          <p><strong>Relationship:</strong> ${admissionData.contactInfo.relationship}</p>
          <p><strong>Phone:</strong> ${admissionData.contactInfo.phone}</p>
          <p><strong>Email:</strong> ${admissionData.contactInfo.email || 'Not provided'}</p>
          <p><strong>Address:</strong> ${admissionData.contactInfo.address}</p>
          
          <h3>Medical Information:</h3>
          <p><strong>Care Level Needed:</strong> ${admissionData.medicalInfo.careLevel}</p>
          <p><strong>Mobility Level:</strong> ${admissionData.medicalInfo.mobility}</p>
          <p><strong>Medical Conditions:</strong> ${admissionData.medicalInfo.conditions || 'None specified'}</p>
          <p><strong>Current Medications:</strong> ${admissionData.medicalInfo.medications || 'None specified'}</p>
          <p><strong>Primary Physician:</strong> ${admissionData.medicalInfo.primaryPhysician || 'Not specified'}</p>
          
          <p><strong>Application Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  }),
};

const sendEmail = async (emailOptions) => {
  try {
    const info = await transporter.sendMail(emailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  transporter,
  emailTemplates,
  sendEmail,
};
