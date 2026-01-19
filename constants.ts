import { LoanTerm } from './types';

export const INTEREST_RATE = 0.20; // 20%

export const REPAYMENT_FEES: Record<LoanTerm, number> = {
  30: 150,
  60: 300,
  90: 450,
};

export const MIN_LOAN_AMOUNT = 500;
export const MAX_LOAN_AMOUNT = 5000;
export const LOAN_AMOUNT_STEP = 100;