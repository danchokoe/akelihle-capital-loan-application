import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Email service
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true' || parseInt(process.env.EMAIL_PORT || '465') === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    // Don't fail on invalid certs
    rejectUnauthorized: false
  }
});

// SMS service - only initialize if credentials are provided
let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  attachments?: any[]
): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || generateEmailHTML(subject, text),
      attachments
    };

    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}: ${subject}`);
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw error;
  }
};

// Generate HTML email template
const generateEmailHTML = (subject: string, text: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background-color: #1a1a1a; color: #fbbf24; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
        .button { display: inline-block; background-color: #fbbf24; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">AKELIHLE CAPITAL</div>
          <div>Your Trusted Financial Partner</div>
        </div>
        <div class="content">
          <h2>${subject}</h2>
          <p>${text.replace(/\n/g, '</p><p>')}</p>
        </div>
        <div class="footer">
          <p><strong>Akelihle Capital Pty Ltd</strong><br>
          Reg No: 2025/053404/07<br>
          Email: loans@akelihlecap.co.za<br>
          NCRCP Registration: NCRCP21550</p>
          <p><em>This is an automated message. Please do not reply to this email.</em></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendSMS = async (to: string, message: string): Promise<void> => {
  try {
    if (!twilioClient) {
      console.log(`📱 SMS disabled - would send to ${to}: ${message}`);
      return;
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log(`📱 SMS sent to ${to}: ${message}`);
  } catch (error) {
    console.error('❌ SMS sending error:', error);
    // Don't throw error - just log it so email notifications still work
    console.log(`📱 SMS failed, continuing with email notifications only`);
  }
};