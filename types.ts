export enum ApplicationStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
}

export type LoanTerm = 30 | 60 | 90;

export type EmploymentStatus = 'Employed' | 'Self-Employed' | 'Unemployed';

export interface AuditLog {
  status: ApplicationStatus;
  date: string;
  changedBy: 'user' | 'admin';
}

export interface CommunicationLog {
  type: 'Email' | 'SMS';
  sender: string;
  recipient: string;
  subject?: string;
  contentSnippet: string;
  sentAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface LoanApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employmentStatus: EmploymentStatus;
  loanPurpose: string;
  companyName?: string;
  monthlyIncome: number;
  idDocument: string;
  proofOfResidence: string;
  proofOfSalary: string;
  loanAmount: number;
  loanTerm: LoanTerm;
  interestRate: number;
  repaymentFee: number;
  totalRepayment: number;
  status: ApplicationStatus;
  applicationDate: string;
  auditLogs?: AuditLog[];
  communicationLogs?: CommunicationLog[];
  contractSent?: boolean;
  contractDate?: string;
}