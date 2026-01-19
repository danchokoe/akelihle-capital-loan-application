
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { View } from '../App';
import { ApplicationStatus, LoanApplication } from '../types';
import LoanContract from './LoanContract';

interface UserDashboardProps {
  setView: (view: View) => void;
}

const StatusTag: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const baseClasses = "px-3 py-1 text-[10px] font-bold uppercase rounded-sm tracking-wider";
  const statusClasses = {
    [ApplicationStatus.Pending]: "bg-neutral-800 text-yellow-300 border border-neutral-700",
    [ApplicationStatus.Approved]: "bg-yellow-400 text-black",
    [ApplicationStatus.Rejected]: "bg-black text-yellow-600 border border-yellow-600",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ContractModal: React.FC<{ application: LoanApplication; onClose: () => void }> = ({ application, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-4 overflow-y-auto backdrop-blur-md">
            <div className="relative w-full max-w-5xl my-8">
                <div className="flex justify-between items-center mb-4 text-white">
                    <h3 className="text-xl font-bold uppercase tracking-widest text-yellow-400">Your Loan Agreement</h3>
                    <button onClick={onClose} className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg shadow-xl hover:scale-105 transition-all">Close</button>
                </div>
                <div className="rounded-xl overflow-hidden shadow-2xl">
                    <LoanContract application={application} />
                </div>
                <div className="mt-6 flex justify-center">
                     <button onClick={() => window.print()} className="bg-white/10 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/20 transition-all border border-white/20">Download / Print Contract (PDF)</button>
                </div>
            </div>
        </div>
    );
};

const UserDashboard: React.FC<UserDashboardProps> = ({ setView }) => {
  const { currentUser, applications, getUserApplications, loading } = useAppContext();
  const [viewingContract, setViewingContract] = useState<LoanApplication | null>(null);
  
  // Load user applications on mount
  useEffect(() => {
    if (currentUser) {
      getUserApplications();
    }
  }, [currentUser]);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-6">
        <div>
            <h1 className="text-4xl font-black text-yellow-400 uppercase tracking-tighter italic">My Dashboard</h1>
            <p className="text-neutral-500 text-sm mt-1">Logged in as <span className="text-neutral-200 font-medium">{currentUser?.email}</span></p>
        </div>
        <button 
          onClick={() => setView('home')} 
          className="bg-yellow-400 text-black font-bold py-3 px-10 rounded-sm hover:bg-yellow-500 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs"
        >
            New Loan Application
        </button>
      </div>

      {viewingContract && (
          <ContractModal 
            application={viewingContract} 
            onClose={() => setViewingContract(null)} 
          />
      )}

      <div className="bg-neutral-900/50 rounded-lg border border-neutral-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-widest">Application History</h2>
            <span className="text-[10px] text-neutral-500 uppercase font-bold">{applications.length} Record(s)</span>
        </div>
        
        {loading ? (
          <div className="px-6 py-20 text-center text-neutral-500">
            Loading applications...
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-800">
                  <th className="px-6 py-4 font-bold">Ref / Date</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Purpose</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-neutral-800/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-mono text-xs text-yellow-400 font-bold">{app.id}</div>
                      <div className="text-[10px] text-neutral-500 mt-1">{new Date(app.applicationDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-white">{formatCurrency(app.loanAmount)}</div>
                      <div className="text-[10px] text-neutral-500 mt-1">{app.loanTerm} Days / {formatCurrency(app.totalRepayment / (app.loanTerm / 30))} pm</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs text-neutral-300 max-w-xs truncate italic" title={app.loanPurpose}>
                        {app.loanPurpose || "Short-term funding"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusTag status={app.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      {app.status === ApplicationStatus.Approved ? (
                        <button 
                          onClick={() => setViewingContract(app)}
                          className="text-[10px] font-bold text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-sm hover:bg-yellow-400 hover:text-black transition-all uppercase tracking-tighter"
                        >
                          View Contract
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-600 uppercase font-bold italic">Processing</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24 px-6">
            <div className="bg-neutral-800/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-600 border border-neutral-700">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-200 uppercase tracking-tight">No Loan History</h3>
            <p className="text-neutral-500 mt-2 max-w-sm mx-auto text-sm">You haven't submitted any loan applications yet. Start by using our calculator to find a plan that works for you.</p>
            <button 
              onClick={() => setView('home')} 
              className="mt-8 bg-neutral-800 hover:bg-neutral-700 text-yellow-400 font-bold py-3 px-8 rounded-sm border border-neutral-700 transition-all uppercase tracking-widest text-[10px]"
            >
              Get Started Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
