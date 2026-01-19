import React, { useState, useMemo } from 'react';
import { LoanTerm } from '../types';
import { INTEREST_RATE, REPAYMENT_FEES, MIN_LOAN_AMOUNT, MAX_LOAN_AMOUNT, LOAN_AMOUNT_STEP } from '../constants';
import ApplicationForm from './ApplicationForm';
import { useAppContext } from '../contexts/AppContext';
import { View } from '../App';

interface LoanCalculatorProps {
  setView: (view: View) => void;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ setView }) => {
  const [amount, setAmount] = useState<number>(5000);
  const [term, setTerm] = useState<LoanTerm>(30);
  const [isApplying, setIsApplying] = useState(false);
  const { currentUser } = useAppContext();

  const { interest, repaymentFee, totalRepayment, monthlyDeduction, installments } = useMemo(() => {
    const interest = amount * INTEREST_RATE;
    const repaymentFee = REPAYMENT_FEES[term];
    const totalRepayment = amount + interest + repaymentFee;
    const termInMonths = term / 30;
    const monthlyDeduction = totalRepayment / termInMonths;
    return { interest, repaymentFee, totalRepayment, monthlyDeduction, installments: termInMonths };
  }, [amount, term]);
  
  const loanDetails = { amount, term, interest: INTEREST_RATE, repaymentFee, totalRepayment };

  const handleApplyClick = () => {
    if (currentUser) {
      setIsApplying(true);
    } else {
      setView('applicant-auth');
    }
  };
  
  const handleGoBack = () => {
      setIsApplying(false);
      setView('user-dashboard');
  }

  if (isApplying) {
    return <ApplicationForm loanDetails={loanDetails} goBack={handleGoBack} />;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(value);
  };
  
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400">Fast, Simple, Secure</h1>
        <p className="mt-4 text-lg text-neutral-200">Get the cash you need in minutes. Adjust your loan amount and term to see your repayment details instantly.</p>
         { !currentUser && <p className="mt-2 text-yellow-300 text-sm">Please log in or sign up to apply.</p>}
      </div>
      <div className="bg-neutral-900 p-8 rounded-lg shadow-2xl border border-neutral-800">
        <h2 className="text-2xl font-bold text-center mb-6">Loan Calculator</h2>

        <div className="mb-6">
          <label htmlFor="loan-amount" className="block text-sm font-medium text-neutral-200 mb-2">How much do you need?</label>
          <div className="text-center text-3xl font-bold text-yellow-400 mb-4">{formatCurrency(amount)}</div>
          <input
            id="loan-amount"
            type="range"
            min={MIN_LOAN_AMOUNT}
            max={MAX_LOAN_AMOUNT}
            step={LOAN_AMOUNT_STEP}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-neutral-300 mt-2">
            <span>{formatCurrency(MIN_LOAN_AMOUNT)}</span>
            <span>{formatCurrency(MAX_LOAN_AMOUNT)}</span>
          </div>
        </div>

        <div className="mb-6">
           <label className="block text-sm font-medium text-neutral-200 mb-2">Repayment Term</label>
           <div className="grid grid-cols-3 gap-2">
            {(Object.keys(REPAYMENT_FEES) as unknown as LoanTerm[]).map((t) => (
               <button
                 key={t}
                 onClick={() => setTerm(t)}
                 className={`px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200 flex flex-col items-center ${
                    term === Number(t) ? 'bg-yellow-400 text-black scale-105 shadow-lg' : 'bg-neutral-800 text-white hover:bg-neutral-700'
                 }`}
               >
                 <span>{t} days</span>
                 <span className="text-[10px] opacity-80">{t === 30 ? '1 Month' : `${t/30} Months`}</span>
               </button>
             ))}
           </div>
        </div>

        <div className="bg-black p-4 rounded-lg border border-neutral-800 space-y-2 text-sm">
           <div className="flex justify-between">
             <span className="text-neutral-300">Principal Amount:</span>
             <span className="font-semibold">{formatCurrency(amount)}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-neutral-300">Interest (20%):</span>
             <span className="font-semibold">{formatCurrency(interest)}</span>
           </div>
           <div className="flex justify-between">
             <span className="text-neutral-300">Repayment Fee:</span>
             <span className="font-semibold">{formatCurrency(repaymentFee)}</span>
           </div>
           <hr className="border-neutral-800 my-2" />
           <div className="flex justify-between items-center py-1">
             <div className="flex flex-col">
               <span className="text-yellow-400 font-bold text-lg">Monthly Installment</span>
               <span className="text-[10px] text-neutral-400">Repaid over {installments} {installments === 1 ? 'month' : 'months'}</span>
             </div>
             <span className="font-bold text-yellow-400 text-2xl">{formatCurrency(monthlyDeduction)}</span>
           </div>
           <hr className="border-neutral-800 my-2 opacity-30" />
           <div className="flex justify-between text-xs pt-1">
             <span className="text-neutral-400">Total Repayment Amount:</span>
             <span className="font-semibold text-neutral-200">{formatCurrency(totalRepayment)}</span>
           </div>
        </div>

        <button
          onClick={handleApplyClick}
          className="w-full mt-6 bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors duration-300 text-lg shadow-md"
        >
          {currentUser ? 'Apply Now' : 'Login to Apply'}
        </button>
      </div>
    </div>
  );
};

export default LoanCalculator;