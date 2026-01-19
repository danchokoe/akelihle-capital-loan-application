import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { LoanApplication, ApplicationStatus } from '../types';

const StatusTag: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
  const statusClasses = {
    [ApplicationStatus.Pending]: "bg-neutral-800 text-yellow-300 border border-neutral-700",
    [ApplicationStatus.Approved]: "bg-yellow-400 text-black",
    [ApplicationStatus.Rejected]: "bg-black text-yellow-500 border border-yellow-500",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const StatusChecker: React.FC = () => {
  const [appId, setAppId] = useState('');
  const [result, setResult] = useState<LoanApplication | null | 'not_found'>(null);
  const [loading, setLoading] = useState(false);
  const { findApplication } = useAppContext();

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId.trim()) return;
    
    setLoading(true);
    try {
      const application = await findApplication(appId.trim());
      setResult(application || 'not_found');
    } catch (error) {
      console.error('Error checking status:', error);
      setResult('not_found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-lg border border-neutral-800">
        <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">Check Application Status</h2>
        <form onSubmit={handleCheckStatus} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="Enter your application ID (e.g., AC-12345...)"
            className="flex-grow bg-neutral-800 border border-neutral-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          />
          <button
            type="submit"
            disabled={loading || !appId.trim()}
            className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-8 bg-neutral-900 p-8 rounded-lg shadow-lg border border-neutral-800 animate-fade-in">
          {result === 'not_found' ? (
            <p className="text-center text-yellow-500">Application ID not found. Please check the ID and try again.</p>
          ) : (
            <div>
              <h3 className="text-xl font-bold mb-4">Application Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Application ID:</span>
                  <span className="font-mono text-yellow-400">{result.id}</span>
                </div>
                 <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Applicant Name:</span>
                  <span>{result.firstName} {result.lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Loan Amount:</span>
                  <span>{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(result.loanAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Application Date:</span>
                  <span>{new Date(result.applicationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Status:</span>
                  <StatusTag status={result.status} />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <h4 className="font-semibold mb-2">Application History</h4>
                <ul className="space-y-2 text-sm">
                  {result.auditLogs?.map((log, index) => (
                    <li key={index} className="flex justify-between text-neutral-300">
                      <span>Status set to <span className="font-semibold text-neutral-100">{log.status}</span></span>
                      <span>{new Date(log.date).toLocaleString()}</span>
                    </li>
                  )) || <li className="text-neutral-500 italic">No history available</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusChecker;