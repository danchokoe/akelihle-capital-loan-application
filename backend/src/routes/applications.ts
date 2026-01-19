import express from 'express';
import Joi from 'joi';
import multer from 'multer';
import path from 'path';
import { PrismaClient, ApplicationStatus, EmploymentStatus } from '@prisma/client';
import { authenticateToken, requireUser, requireAdmin, AuthRequest } from '../middleware/auth';
import { sendEmail, sendSMS } from '../services/communication';
import { generateContract } from '../services/contract';

// Generate HTML email for approved applications
const generateApprovalEmailHTML = (application: any): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Loan Application Approved</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background-color: #1a1a1a; color: #fbbf24; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .success { background-color: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; font-weight: bold; margin: 20px 0; }
        .loan-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
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
        
        <div class="success">
          🎉 LOAN APPLICATION APPROVED! 🎉
        </div>
        
        <p>Dear ${application.firstName} ${application.lastName},</p>
        
        <p>Congratulations! We are pleased to inform you that your loan application has been <strong>APPROVED</strong>.</p>
        
        <div class="loan-details">
          <h3>Loan Details</h3>
          <div class="detail-row">
            <span>Application ID:</span>
            <span><strong>${application.id}</strong></span>
          </div>
          <div class="detail-row">
            <span>Loan Amount:</span>
            <span><strong>R${application.loanAmount.toLocaleString()}</strong></span>
          </div>
          <div class="detail-row">
            <span>Loan Term:</span>
            <span><strong>${application.loanTerm} days</strong></span>
          </div>
          <div class="detail-row">
            <span>Interest Rate:</span>
            <span><strong>20% per annum</strong></span>
          </div>
          <div class="detail-row">
            <span>Total Repayment:</span>
            <span><strong>R${application.totalRepayment.toLocaleString()}</strong></span>
          </div>
        </div>
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Review your loan contract (attached to this email)</li>
          <li>Funds will be disbursed within 24-48 hours</li>
          <li>Track your application in your dashboard</li>
        </ol>
        
        <p>Your digitally signed loan contract is attached to this email. Please review all terms and conditions carefully.</p>
        
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

const router = express.Router();
const prisma = new PrismaClient();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
  }
});

// Validation schema
const applicationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^((\+27)|0)[1-9][0-9]{8}$/).required(),
  employmentStatus: Joi.string().valid('EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED').required(),
  loanPurpose: Joi.string().min(10).max(500).required(),
  companyName: Joi.string().max(100).allow('').optional(),
  monthlyIncome: Joi.number().min(0).required(),
  loanAmount: Joi.number().min(500).max(5000).required(),
  loanTerm: Joi.number().valid(30, 60, 90).required(),
  interestRate: Joi.number().min(0).required(),
  repaymentFee: Joi.number().min(0).required(),
  totalRepayment: Joi.number().min(0).required()
});

// Submit new application
router.post('/', authenticateToken, requireUser, upload.fields([
  { name: 'idDocument', maxCount: 1 },
  { name: 'proofOfResidence', maxCount: 1 },
  { name: 'proofOfSalary', maxCount: 1 }
]), async (req: AuthRequest, res) => {
  try {
    const { error, value } = applicationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files.idDocument || !files.proofOfResidence || !files.proofOfSalary) {
      return res.status(400).json({ error: 'All document uploads are required' });
    }

    const application = await prisma.loanApplication.create({
      data: {
        userId: req.user!.id,
        ...value,
        idDocument: files.idDocument[0].filename,
        proofOfResidence: files.proofOfResidence[0].filename,
        proofOfSalary: files.proofOfSalary[0].filename,
        auditLogs: {
          create: {
            status: ApplicationStatus.PENDING,
            changedBy: 'user'
          }
        }
      },
      include: {
        auditLogs: true,
        communicationLogs: true
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: application.id,
        status: application.status,
        applicationDate: application.applicationDate
      }
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get application by ID (public endpoint for status checking)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.loanApplication.findUnique({
      where: { id },
      include: {
        auditLogs: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Return limited public information
    res.json({
      id: application.id,
      status: application.status,
      applicationDate: application.applicationDate,
      loanAmount: application.loanAmount,
      loanTerm: application.loanTerm,
      auditLog: application.auditLogs.map(log => ({
        status: log.status,
        date: log.date,
        changedBy: log.changedBy
      }))
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all applications (admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const applications = await prisma.loanApplication.findMany({
      include: {
        user: {
          select: { email: true }
        },
        auditLogs: {
          orderBy: { date: 'desc' }
        },
        communicationLogs: {
          orderBy: { sentAt: 'desc' }
        }
      },
      orderBy: { applicationDate: 'desc' }
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's applications
router.get('/user/me', authenticateToken, requireUser, async (req: AuthRequest, res) => {
  try {
    const applications = await prisma.loanApplication.findMany({
      where: { userId: req.user!.id },
      include: {
        auditLogs: {
          orderBy: { date: 'desc' }
        },
        communicationLogs: {
          orderBy: { sentAt: 'desc' }
        }
      },
      orderBy: { applicationDate: 'desc' }
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update application status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(ApplicationStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await prisma.loanApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update application and create audit log
    const updatedApplication = await prisma.loanApplication.update({
      where: { id },
      data: {
        status,
        contractSent: status === ApplicationStatus.APPROVED ? true : application.contractSent,
        contractDate: status === ApplicationStatus.APPROVED && !application.contractDate 
          ? new Date() 
          : application.contractDate,
        auditLogs: {
          create: {
            status,
            changedBy: 'admin'
          }
        }
      },
      include: {
        auditLogs: true,
        communicationLogs: true
      }
    });

    // Send notifications
    try {
      const emailSubject = `Akelihle Capital - Loan Application ${status}`;
      let emailText = '';
      let emailHtml = '';

      if (status === ApplicationStatus.APPROVED) {
        emailText = `Dear ${application.firstName} ${application.lastName},

Congratulations! Your loan application (${application.id}) has been APPROVED.

Loan Details:
- Amount: R${application.loanAmount.toLocaleString()}
- Term: ${application.loanTerm} days
- Total Repayment: R${application.totalRepayment.toLocaleString()}

Your digitally signed loan contract is attached to this email. Please review the terms and conditions carefully.

Next Steps:
1. Review your loan contract
2. Funds will be disbursed within 24-48 hours
3. Track your application status in your dashboard

Thank you for choosing Akelihle Capital.

Best regards,
Akelihle Capital Team`;

        emailHtml = generateApprovalEmailHTML(application);
      } else if (status === ApplicationStatus.REJECTED) {
        emailText = `Dear ${application.firstName} ${application.lastName},

Thank you for your interest in Akelihle Capital. After careful review, we regret to inform you that your loan application (${application.id}) has been declined.

This decision was based on our current lending criteria and risk assessment policies.

You may reapply after 30 days. We encourage you to:
- Review your credit profile
- Ensure all documentation is complete and accurate
- Consider applying for a smaller loan amount

If you have any questions, please contact our customer service team.

Thank you for considering Akelihle Capital.

Best regards,
Akelihle Capital Team`;
      } else {
        emailText = `Dear ${application.firstName} ${application.lastName},

Your loan application (${application.id}) status has been updated to: ${status}

Please log into your dashboard to view the latest updates.

Best regards,
Akelihle Capital Team`;
      }

      let attachments = [];
      
      // Add contract attachment for approved applications
      if (status === ApplicationStatus.APPROVED) {
        try {
          const contractBuffer = await generateContract(updatedApplication);
          attachments.push({
            filename: `loan-contract-${application.id}.pdf`,
            content: contractBuffer,
            contentType: 'application/pdf'
          });
        } catch (contractError) {
          console.error('Error generating contract for email:', contractError);
        }
      }

      await sendEmail(application.email, emailSubject, emailText, emailHtml, attachments);

      const smsMessage = `Hi ${application.firstName}, your Akelihle loan application ${application.id} is ${status}. ${status === ApplicationStatus.APPROVED ? 'Contract sent via email.' : 'Check your email for details.'} - Akelihle Capital`;
      
      await sendSMS(application.phone, smsMessage);

      // Log communications
      await prisma.communicationLog.createMany({
        data: [
          {
            applicationId: id,
            type: 'Email',
            sender: process.env.EMAIL_USER!,
            recipient: application.email,
            subject: `Akelihle Capital - Loan Application ${status}`,
            contentSnippet: status === ApplicationStatus.APPROVED 
              ? 'Approval notice & Digitally Signed Loan Contract'
              : 'Application status update'
          },
          {
            applicationId: id,
            type: 'SMS',
            sender: 'AKELIHLE_CAP',
            recipient: application.phone,
            contentSnippet: `Hi ${application.firstName}, your Akelihle loan app ${application.id} is ${status}. View details in your dashboard.`
          }
        ]
      });
    } catch (commError) {
      console.error('Communication error:', commError);
      // Don't fail the status update if communication fails
    }

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contract (for approved applications)
router.get('/:id/contract', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.loanApplication.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user owns this application or is admin
    if (req.user!.type !== 'admin' && application.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (application.status !== ApplicationStatus.APPROVED) {
      return res.status(400).json({ error: 'Contract only available for approved applications' });
    }

    const contractBuffer = await generateContract(application);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="loan-contract-${application.id}.pdf"`);
    res.send(contractBuffer);
  } catch (error) {
    console.error('Get contract error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;