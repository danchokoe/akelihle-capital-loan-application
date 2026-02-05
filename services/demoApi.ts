// Demo API service for AWS Amplify deployment (frontend-only)
import { 
  demoUsers, 
  demoAdmin, 
  demoApplications, 
  demoStats,
  isDemoMode,
  getDemoToken,
  findDemoUser,
  validateDemoAdmin,
  getDemoApplicationsForUser,
  getDemoApplicationById,
  updateDemoApplicationStatus,
  addDemoApplication
} from './demoData';
import { ApplicationStatus } from '../types';

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Demo Auth API
export const demoAuthAPI = {
  adminLogin: async (username: string, password: string) => {
    await delay();
    
    if (!validateDemoAdmin(username, password)) {
      throw new Error('Invalid credentials');
    }

    const token = getDemoToken('admin');
    localStorage.setItem('authToken', token);
    localStorage.setItem('isAdminLoggedIn', 'true');
    
    return {
      message: 'Admin login successful',
      token,
      admin: { username }
    };
  },

  applicantSignup: async (email: string, password: string, firstName?: string, lastName?: string) => {
    await delay();
    
    // Check if user already exists
    if (demoUsers.find(user => user.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: `demo-user-${Date.now()}`,
      email,
      password,
      firstName: firstName || 'Demo',
      lastName: lastName || 'User'
    };
    
    demoUsers.push(newUser);
    
    const token = getDemoToken('user', newUser.id);
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    }));
    
    return {
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    };
  },

  applicantLogin: async (email: string, password: string) => {
    await delay();
    
    const user = findDemoUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = getDemoToken('user', user.id);
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }));
    
    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdminLoggedIn');
  }
};

// Demo Applications API
export const demoApplicationsAPI = {
  submit: async (applicationData: any, files: { [key: string]: File }) => {
    await delay(1000); // Longer delay to simulate file upload
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.id) {
      throw new Error('User not authenticated');
    }

    // Create demo file names
    const timestamp = Date.now();
    const demoFiles = {
      idDocument: `demo-id-${timestamp}.pdf`,
      proofOfResidence: `demo-residence-${timestamp}.pdf`,
      proofOfSalary: `demo-salary-${timestamp}.pdf`
    };

    const newApplication = addDemoApplication({
      userId: currentUser.id,
      firstName: applicationData.firstName,
      lastName: applicationData.lastName,
      email: applicationData.email,
      phone: applicationData.phone,
      employmentStatus: applicationData.employmentStatus,
      companyName: applicationData.companyName || '',
      monthlyIncome: parseFloat(applicationData.monthlyIncome),
      loanAmount: parseFloat(applicationData.loanAmount),
      loanTerm: parseInt(applicationData.loanTerm),
      loanPurpose: applicationData.loanPurpose,
      interestRate: parseFloat(applicationData.interestRate),
      repaymentFee: parseFloat(applicationData.repaymentFee),
      totalRepayment: parseFloat(applicationData.totalRepayment),
      idDocument: demoFiles.idDocument,
      proofOfResidence: demoFiles.proofOfResidence,
      proofOfSalary: demoFiles.proofOfSalary,
      status: ApplicationStatus.PENDING,
      contractSent: false,
      contractDate: null
    });

    return {
      message: 'Application submitted successfully',
      application: newApplication
    };
  },

  getById: async (id: string) => {
    await delay();
    
    const application = getDemoApplicationById(id);
    if (!application) {
      throw new Error('Application not found');
    }
    
    return { application };
  },

  getAll: async () => {
    await delay();
    
    console.log('Demo API getAll called, returning:', { applications: demoApplications.length, stats: demoStats });
    
    return {
      applications: demoApplications,
      stats: demoStats
    };
  },

  getUserApplications: async () => {
    await delay();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.id) {
      throw new Error('User not authenticated');
    }

    const userApplications = getDemoApplicationsForUser(currentUser.id);
    
    return {
      applications: userApplications
    };
  },

  updateStatus: async (id: string, status: string) => {
    await delay();
    
    const updatedApp = updateDemoApplicationStatus(id, status as ApplicationStatus);
    if (!updatedApp) {
      throw new Error('Application not found');
    }
    
    return {
      message: 'Application status updated successfully',
      application: updatedApp
    };
  },

  getContract: async (id: string) => {
    await delay();
    
    const application = getDemoApplicationById(id);
    if (!application) {
      throw new Error('Application not found');
    }
    
    if (application.status !== ApplicationStatus.APPROVED) {
      throw new Error('Contract only available for approved applications');
    }
    
    // Create a demo PDF blob
    const pdfContent = `
      AKELIHLE CAPITAL LOAN AGREEMENT
      
      Application ID: ${application.id}
      Applicant: ${application.firstName} ${application.lastName}
      Loan Amount: R${application.loanAmount}
      Term: ${application.loanTerm} days
      Interest Rate: ${application.interestRate}%
      Total Repayment: R${application.totalRepayment}
      
      This is a demo contract for testing purposes.
    `;
    
    return new Blob([pdfContent], { type: 'application/pdf' });
  }
};

// Demo Admin API
export const demoAdminAPI = {
  updatePassword: async (newPassword: string) => {
    await delay();
    // In demo mode, just return success
    return { message: 'Password updated successfully' };
  },

  getStats: async () => {
    await delay();
    return demoStats;
  },

  sendNotification: async (applicationId: string, type: string, message: string) => {
    await delay();
    
    const application = getDemoApplicationById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }
    
    return {
      message: `${type} notification sent successfully to ${application.email}`,
      sent: true
    };
  }
};

// Check if we should use demo mode
export const shouldUseDemoMode = (): boolean => {
  return isDemoMode();
};