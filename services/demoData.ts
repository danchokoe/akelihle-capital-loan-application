// Demo data for AWS Amplify deployment (frontend-only)
import { LoanApplication, ApplicationStatus } from '../types';

// Demo users
export const demoUsers = [
  {
    id: 'demo-user-1',
    email: 'demo@akelihlecap.co.za',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User'
  },
  {
    id: 'demo-user-2', 
    email: 'john.doe@example.com',
    password: 'demo123',
    firstName: 'John',
    lastName: 'Doe'
  }
];

// Demo admin credentials
export const demoAdmin = {
  username: 'admin',
  password: 'demo123'
};

// Demo loan applications
export const demoApplications: LoanApplication[] = [
  {
    id: 'app-001',
    userId: 'demo-user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+27123456789',
    employmentStatus: 'EMPLOYED',
    companyName: 'Tech Solutions SA',
    monthlyIncome: 15000,
    loanAmount: 2500,
    loanTerm: 30,
    loanPurpose: 'Emergency medical expenses',
    interestRate: 20,
    repaymentFee: 150,
    totalRepayment: 2691.67,
    idDocument: 'demo-id-001.pdf',
    proofOfResidence: 'demo-residence-001.pdf', 
    proofOfSalary: 'demo-salary-001.pdf',
    status: ApplicationStatus.PENDING,
    contractSent: false,
    contractDate: null,
    applicationDate: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'app-002',
    userId: 'demo-user-2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+27987654321',
    employmentStatus: 'EMPLOYED',
    companyName: 'Marketing Pro',
    monthlyIncome: 12000,
    loanAmount: 1500,
    loanTerm: 60,
    loanPurpose: 'Home repairs',
    interestRate: 20,
    repaymentFee: 300,
    totalRepayment: 1850,
    idDocument: 'demo-id-002.pdf',
    proofOfResidence: 'demo-residence-002.pdf',
    proofOfSalary: 'demo-salary-002.pdf', 
    status: ApplicationStatus.APPROVED,
    contractSent: true,
    contractDate: new Date('2024-01-10T14:20:00Z'),
    applicationDate: new Date('2024-01-08T09:15:00Z'),
    updatedAt: new Date('2024-01-10T14:20:00Z')
  },
  {
    id: 'app-003',
    userId: 'demo-user-1',
    firstName: 'Michael',
    lastName: 'Smith',
    email: 'michael.smith@example.com',
    phone: '+27555123456',
    employmentStatus: 'SELF_EMPLOYED',
    companyName: 'Smith Consulting',
    monthlyIncome: 8000,
    loanAmount: 1000,
    loanTerm: 90,
    loanPurpose: 'Business equipment',
    interestRate: 20,
    repaymentFee: 450,
    totalRepayment: 1499.17,
    idDocument: 'demo-id-003.pdf',
    proofOfResidence: 'demo-residence-003.pdf',
    proofOfSalary: 'demo-salary-003.pdf',
    status: ApplicationStatus.REJECTED,
    contractSent: false,
    contractDate: null,
    applicationDate: new Date('2024-01-12T16:45:00Z'),
    updatedAt: new Date('2024-01-13T11:30:00Z')
  },
  {
    id: 'app-004',
    userId: 'demo-user-2',
    firstName: 'Lisa',
    lastName: 'Williams',
    email: 'lisa.williams@example.com',
    phone: '+27444987654',
    employmentStatus: 'EMPLOYED',
    companyName: 'Healthcare Plus',
    monthlyIncome: 18000,
    loanAmount: 3000,
    loanTerm: 30,
    loanPurpose: 'Debt consolidation',
    interestRate: 20,
    repaymentFee: 150,
    totalRepayment: 3230,
    idDocument: 'demo-id-004.pdf',
    proofOfResidence: 'demo-residence-004.pdf',
    proofOfSalary: 'demo-salary-004.pdf',
    status: ApplicationStatus.APPROVED,
    contractSent: true,
    contractDate: new Date('2024-01-14T13:10:00Z'),
    applicationDate: new Date('2024-01-13T08:20:00Z'),
    updatedAt: new Date('2024-01-14T13:10:00Z')
  },
  {
    id: 'app-005',
    userId: 'demo-user-1',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '+27333456789',
    employmentStatus: 'EMPLOYED',
    companyName: 'Construction Co',
    monthlyIncome: 11000,
    loanAmount: 2000,
    loanTerm: 60,
    loanPurpose: 'Vehicle repairs',
    interestRate: 20,
    repaymentFee: 300,
    totalRepayment: 2533.33,
    idDocument: 'demo-id-005.pdf',
    proofOfResidence: 'demo-residence-005.pdf',
    proofOfSalary: 'demo-salary-005.pdf',
    status: ApplicationStatus.PENDING,
    contractSent: false,
    contractDate: null,
    applicationDate: new Date('2024-01-16T12:00:00Z'),
    updatedAt: new Date('2024-01-16T12:00:00Z')
  }
];

// Demo statistics
export const demoStats = {
  totalApplications: demoApplications.length,
  pendingApplications: demoApplications.filter(app => app.status === ApplicationStatus.PENDING).length,
  approvedApplications: demoApplications.filter(app => app.status === ApplicationStatus.APPROVED).length,
  rejectedApplications: demoApplications.filter(app => app.status === ApplicationStatus.REJECTED).length,
  totalLoanAmount: demoApplications.reduce((sum, app) => sum + Number(app.loanAmount), 0),
  averageLoanAmount: demoApplications.reduce((sum, app) => sum + Number(app.loanAmount), 0) / demoApplications.length
};

// Helper functions for demo mode
export const isDemoMode = (): boolean => {
  return process.env.NODE_ENV === 'production' && window.location.hostname.includes('amplifyapp.com');
};

export const getDemoToken = (type: 'admin' | 'user', userId?: string): string => {
  return `demo-token-${type}-${userId || 'admin'}-${Date.now()}`;
};

export const findDemoUser = (email: string, password: string) => {
  return demoUsers.find(user => user.email === email && user.password === password);
};

export const validateDemoAdmin = (username: string, password: string): boolean => {
  return username === demoAdmin.username && password === demoAdmin.password;
};

export const getDemoApplicationsForUser = (userId: string): LoanApplication[] => {
  return demoApplications.filter(app => app.userId === userId);
};

export const getDemoApplicationById = (id: string): LoanApplication | undefined => {
  return demoApplications.find(app => app.id === id);
};

export const updateDemoApplicationStatus = (id: string, status: ApplicationStatus): LoanApplication | null => {
  const appIndex = demoApplications.findIndex(app => app.id === id);
  if (appIndex !== -1) {
    demoApplications[appIndex].status = status;
    demoApplications[appIndex].updatedAt = new Date();
    if (status === ApplicationStatus.APPROVED) {
      demoApplications[appIndex].contractSent = true;
      demoApplications[appIndex].contractDate = new Date();
    }
    return demoApplications[appIndex];
  }
  return null;
};

export const addDemoApplication = (application: Omit<LoanApplication, 'id' | 'applicationDate' | 'updatedAt'>): LoanApplication => {
  const newApp: LoanApplication = {
    ...application,
    id: `app-${Date.now()}`,
    applicationDate: new Date(),
    updatedAt: new Date()
  };
  demoApplications.push(newApp);
  return newApp;
};