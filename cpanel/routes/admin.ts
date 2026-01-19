import express from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { testEmailConfiguration, testSMSConfiguration } from '../utils/testEmail';
import { testSMTPConnection, testTwilioConnection } from '../utils/testConnection';

const router = express.Router();

// Validation schema
const passwordSchema = Joi.object({
  newPassword: Joi.string().min(6).required()
});

// Change admin password
router.patch('/password', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { error, value } = passwordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { newPassword } = value;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // In a real application, you'd update this in the database
    // For now, we'll just return success (password is stored in env)
    console.log('New admin password hash:', hashedPassword);
    console.log('Update your .env file with: ADMIN_PASSWORD_HASH=' + hashedPassword);

    res.json({
      message: 'Password updated successfully. Please update your environment variables.',
      newPasswordHash: hashedPassword
    });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get admin dashboard stats
router.get('/stats', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    // This would typically fetch real stats from the database
    res.json({
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      totalLoanAmount: 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test email configuration
router.post('/test-email', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const success = await testEmailConfiguration(email);
    
    if (success) {
      res.json({ message: 'Test email sent successfully', email });
    } else {
      res.status(500).json({ error: 'Failed to send test email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test SMS configuration
router.post('/test-sms', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const success = await testSMSConfiguration(phone);
    
    if (success) {
      res.json({ message: 'Test SMS sent successfully', phone });
    } else {
      res.status(500).json({ error: 'Failed to send test SMS' });
    }
  } catch (error) {
    console.error('Test SMS error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test SMTP connection (without sending email)
router.get('/test-smtp-connection', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const result = await testSMTPConnection();
    
    if (result.success) {
      res.json({ message: result.message, status: 'connected' });
    } else {
      res.status(500).json({ error: result.message, status: 'failed' });
    }
  } catch (error) {
    console.error('SMTP connection test error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test Twilio connection (without sending SMS)
router.get('/test-twilio-connection', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const result = await testTwilioConnection();
    
    if (result.success) {
      res.json({ message: result.message, status: 'connected' });
    } else {
      res.status(500).json({ error: result.message, status: 'failed' });
    }
  } catch (error) {
    console.error('Twilio connection test error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system configuration status
router.get('/system-status', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const smtpTest = await testSMTPConnection();
    const twilioTest = await testTwilioConnection();
    
    res.json({
      email: {
        configured: !!process.env.EMAIL_HOST && !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS,
        connected: smtpTest.success,
        message: smtpTest.message,
        settings: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          user: process.env.EMAIL_USER,
          secure: process.env.EMAIL_SECURE
        }
      },
      sms: {
        configured: !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN,
        connected: twilioTest.success,
        message: twilioTest.message,
        settings: {
          accountSid: process.env.TWILIO_ACCOUNT_SID ? 'AC***' + process.env.TWILIO_ACCOUNT_SID.slice(-4) : 'Not set',
          phoneNumber: process.env.TWILIO_PHONE_NUMBER
        }
      },
      database: {
        configured: !!process.env.DATABASE_URL,
        url: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@') : 'Not set'
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;