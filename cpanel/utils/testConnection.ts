import nodemailer from 'nodemailer';

export const testSMTPConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🔍 Testing SMTP connection...');
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: process.env.EMAIL_SECURE === 'true' || parseInt(process.env.EMAIL_PORT || '465') === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();
    
    console.log('✅ SMTP connection successful!');
    return {
      success: true,
      message: `SMTP connection to ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT} successful`
    };
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return {
      success: false,
      message: `SMTP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const testTwilioConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🔍 Testing Twilio connection...');
    
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return {
        success: false,
        message: 'Twilio credentials not configured'
      };
    }

    if (!process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
      return {
        success: false,
        message: 'Invalid Twilio Account SID format'
      };
    }

    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Test by fetching account info
    await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    
    console.log('✅ Twilio connection successful!');
    return {
      success: true,
      message: 'Twilio connection successful'
    };
  } catch (error) {
    console.error('❌ Twilio connection failed:', error);
    return {
      success: false,
      message: `Twilio connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};