import { sendEmail } from '../services/communication';

export const testEmailConfiguration = async (testEmail: string): Promise<boolean> => {
  try {
    console.log('🧪 Testing email configuration...');
    
    const subject = 'Akelihle Capital - Email Configuration Test';
    const text = `This is a test email to verify that the Akelihle Capital email system is working correctly.

If you receive this email, the configuration is successful!

Test Details:
- Server: mail.akelihlecap.co.za
- Port: 465 (SSL/TLS)
- From: loans@akelihlecap.co.za
- Timestamp: ${new Date().toISOString()}

Best regards,
Akelihle Capital System`;

    await sendEmail(testEmail, subject, text);
    console.log('✅ Test email sent successfully!');
    return true;
  } catch (error) {
    console.error('❌ Test email failed:', error);
    return false;
  }
};

// Test SMS configuration
export const testSMSConfiguration = async (testPhone: string): Promise<boolean> => {
  try {
    console.log('🧪 Testing SMS configuration...');
    
    const { sendSMS } = await import('../services/communication');
    const message = `Akelihle Capital SMS test: Configuration successful! Time: ${new Date().toLocaleTimeString()}`;
    
    await sendSMS(testPhone, message);
    console.log('✅ Test SMS sent successfully!');
    return true;
  } catch (error) {
    console.error('❌ Test SMS failed:', error);
    return false;
  }
};