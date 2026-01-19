import React from 'react';
import { LoanApplication } from '../types';
import LogoIcon from './icons/LogoIcon';

interface LoanContractProps {
  application: LoanApplication;
}

const LoanContract: React.FC<LoanContractProps> = ({ application }) => {
  const { firstName, lastName, email, phone, loanAmount, loanTerm, totalRepayment, id, applicationDate } = application;
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(val);
  
  const installments = loanTerm / 30;
  const monthlyAmount = totalRepayment / installments;

  return (
    <div className="bg-white text-black p-8 md:p-12 max-w-4xl mx-auto shadow-2xl font-serif text-sm leading-relaxed">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
        <div>
          <LogoIcon className="h-12 w-auto mb-2 text-black" />
          <p className="text-xs font-bold uppercase">Registered Credit Provider: NCRCP21550</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-black uppercase">Loan Agreement</h1>
          <p className="font-bold">Contract Ref: {id}</p>
          <p>Date: {new Date(applicationDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Parties */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase">1. The Parties</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="font-bold underline mb-1 italic">CREDIT PROVIDER (LENDER):</p>
            <p className="font-bold">Akelihle Capital Pty Ltd</p>
            <p className="text-xs">Reg No: 2025/053404/07</p>
            <p>123 Financial District, Sandton</p>
            <p>Johannesburg, 2196</p>
            <p>Email: loans@akelihlecap.co.za</p>
          </div>
          <div>
            <p className="font-bold underline mb-1 italic">CONSUMER (BORROWER):</p>
            <p className="font-bold">{firstName} {lastName}</p>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
          </div>
        </div>
      </section>

      {/* Loan Details */}
      <section className="mb-6 bg-gray-50 p-4 border border-gray-200">
        <h2 className="text-lg font-bold mb-2 uppercase">2. Financial Particulars</h2>
        <div className="grid grid-cols-2 gap-y-2">
          <p>Principal Loan Amount:</p>
          <p className="font-bold text-right">{formatCurrency(loanAmount)}</p>
          
          <p>Initiation Fee (Once-off):</p>
          <p className="font-bold text-right">{formatCurrency(application.repaymentFee)}</p>
          
          <p>Total Interest (20% flat rate):</p>
          <p className="font-bold text-right">{formatCurrency(application.interestRate * loanAmount)}</p>
          
          <div className="col-span-2 border-t border-gray-300 my-1"></div>
          
          <p className="font-bold">TOTAL REPAYMENT AMOUNT:</p>
          <p className="font-bold text-right text-lg">{formatCurrency(totalRepayment)}</p>
          
          <p>Repayment Term:</p>
          <p className="font-bold text-right">{loanTerm} Days ({installments} Installment/s)</p>
          
          <p className="font-bold text-blue-800">Monthly Installment Amount:</p>
          <p className="font-bold text-right text-blue-800">{formatCurrency(monthlyAmount)}</p>
        </div>
      </section>

      {/* NCA Terms */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase">3. National Credit Act (NCA) Disclosures</h2>
        <div className="space-y-3 text-[11px] text-gray-700">
          <p><strong>3.1 Pre-Agreement Statement:</strong> This document serves as a combined Pre-agreement Statement and Quotation as required by Section 92 of the National Credit Act.</p>
          <p><strong>3.2 Right to Settle:</strong> The Consumer has the right to settle this agreement at any time, with or without advance notice to the Credit Provider. The amount required to settle the agreement is the unpaid balance of the principal plus unpaid interest and all other fees and charges up to the settlement date.</p>
          <p><strong>3.3 Cooling-off Period:</strong> If this agreement was concluded at a location other than the Credit Provider's registered business premises, the Consumer has a right to terminate the agreement within 5 (five) business days after signing, provided written notice is given.</p>
          <p><strong>3.4 Credit Bureau:</strong> Akelihle Capital will report the details of this agreement and your payment performance to registered Credit Bureaus. Defaulting on payments may negatively impact your credit score.</p>
          <p><strong>3.5 Dispute Resolution:</strong> Any disputes may be referred to the National Credit Regulator (NCR) or the National Credit Tribunal. Contact NCR: 0860 627 627.</p>
        </div>
      </section>

      {/* Repayment Schedule */}
      <section className="mb-8">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase">4. Repayment Schedule</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300">Instalment #</th>
              <th className="p-2 border border-gray-300">Estimated Date</th>
              <th className="p-2 border border-gray-300">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: installments }).map((_, i) => {
              const date = new Date(applicationDate);
              date.setDate(date.getDate() + (i + 1) * 30);
              return (
                <tr key={i}>
                  <td className="p-2 border border-gray-300">{i + 1} of {installments}</td>
                  <td className="p-2 border border-gray-300">{date.toLocaleDateString()}</td>
                  <td className="p-2 border border-gray-300 font-bold">{formatCurrency(monthlyAmount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Signatures */}
      <div className="mt-12 grid grid-cols-2 gap-16">
        <div className="border-t border-black pt-2">
          <p className="text-[10px] uppercase font-bold text-gray-900">For and on behalf of Lender</p>
          <div className="mt-4 mb-2">
             <p className="font-serif italic text-blue-900 font-bold text-lg select-none" style={{ fontFamily: '"Great Vibes", cursive, serif' }}>Sibusiso Thabethe</p>
          </div>
          <p className="font-bold text-xs">Managing Director: Sibusiso Thabethe</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-tighter mt-1">Digitally Signed by Akelihle Capital Pty Ltd</p>
        </div>
        <div className="border-t border-black pt-2">
          <p className="text-[10px] uppercase font-bold text-gray-900">Consumer Signature</p>
          <div className="mt-4 mb-2">
             <p className="font-serif italic text-blue-900 font-bold text-lg select-none" style={{ fontFamily: '"Great Vibes", cursive, serif' }}>{firstName} {lastName}</p>
          </div>
          <p className="font-bold text-xs">E-Signed by: {firstName} {lastName}</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-tighter mt-1">Verified via OTP & IP Logged Authentication</p>
        </div>
      </div>
      
      <p className="mt-10 text-[9px] text-gray-400 text-center border-t border-gray-100 pt-4">
        Akelihle Capital Pty Ltd (NCRCP21550) is an authorized Financial Services Provider and a Registered Credit Provider. 
        This document is an electronically signed legal contract binding both parties upon approval.
      </p>
    </div>
  );
};

export default LoanContract;