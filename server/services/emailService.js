import nodemailer from "nodemailer";

const createTransporter = () => {
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  // Fallback for development if no Resend key is provided
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    
    // Make sure we have a valid from address configured
    const fromAddress = process.env.EMAIL_FROM || "onboarding@resend.dev"; // Resend allows onboarding@resend.dev for testing to your verified email
    
    const mailOptions = {
      from: `ResQNet <${fromAddress}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    
    // If using ethereal email for local testing
    if (info.messageId && !process.env.RESEND_API_KEY && process.env.SMTP_HOST === "smtp.ethereal.email") {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't crash the server if email fails, just return failure
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #0284c7;">Welcome to ResQNet! 🐾</h2>
      <p>Hi ${user.fullName || "there"},</p>
      <p>Thank you for joining ResQNet! We're excited to have you on board.</p>
      <p>Together, we can make a difference in animal rescue.</p>
      <p>Best,<br>The ResQNet Team</p>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject: "Welcome to ResQNet",
    html,
    text: `Welcome to ResQNet, ${user.fullName || "there"}!`,
  });
};

export const sendRescueAlertEmail = async (user, rescue) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #dc2626;">🚨 Emergency Rescue Alert</h2>
      <p>Hi ${user.fullName},</p>
      <p>A new <strong>${rescue.severity}</strong> rescue request has been reported near your location.</p>
      <p><strong>Animal:</strong> ${rescue.animalType}</p>
      <p><strong>Location:</strong> ${rescue.address}</p>
      <p>Please check your dashboard for more details.</p>
      <div style="margin-top: 20px;">
        <a href="${process.env.CLIENT_URL}/dashboard" style="background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dashboard</a>
      </div>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject: `🚨 Urgent: ${rescue.severity} Rescue Alert in your area`,
    html,
    text: `Emergency Rescue Alert: ${rescue.animalType} at ${rescue.address}. Check your dashboard.`,
  });
};

export const sendAdoptionApprovalEmail = async (user, adoption) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #16a34a;">🎉 Adoption Application Approved!</h2>
      <p>Hi ${user.fullName},</p>
      <p>Great news! Your adoption application for <strong>${adoption.animalName}</strong> has been approved.</p>
      <p>The NGO will contact you shortly to arrange the next steps.</p>
      <p>Thank you for giving a rescue animal a forever home.</p>
      <p>Best,<br>The ResQNet Team</p>
    </div>
  `;
  
  return sendEmail({
    to: user.email,
    subject: "Adoption Application Approved!",
    html,
    text: `Your adoption application for ${adoption.animalName} has been approved. The NGO will contact you shortly.`,
  });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendRescueAlertEmail,
  sendAdoptionApprovalEmail,
};
