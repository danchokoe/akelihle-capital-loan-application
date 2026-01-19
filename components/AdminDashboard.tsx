import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { LoanApplication, ApplicationStatus, EmploymentStatus, LoanTerm, CommunicationLog } from '../types';
import { INTEREST_RATE, REPAYMENT_FEES } from '../constants';
import LoanContract from './LoanContract';

const CommunicationSimulationModal: React.FC<{ 
  application: LoanApplication; 
  status: ApplicationStatus;
  onClose: () => void 
}> = ({ application, status, onClose }) => {
    const { logCommunication } = useAppContext();
    const [step, setStep] = useState<'email' | 'sms' | 'done'>('email');
    const [progress, setProgress] = useState(0);

    const EMAIL_SENDER = 'noreply@akelihlecap.co.za';
    const SMS_SENDER = 'AKELIHLE_CAP';

    useEffect(() => {
        let interval: any;
        if (step === 'email') {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        // Log Email
                        logCommunication(application.id, {
                          type: 'Email',
                          sender: EMAIL_SENDER,
                          recipient: application.email,
                          subject: `Akelihle Capital - Loan Application ${status}`,
                          contentSnippet: status === ApplicationStatus.Approved ? 'Approval notice & Digitally Signed Loan Contract' : 'Application status update',
                          sentAt: new Date().toISOString()
                        });
                        setStep('sms');
                        return 0;
                    }
                    return prev + 10;
                });
            }, 80);
        } else if (step === 'sms') {
             interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        // Log SMS
                        logCommunication(application.id, {
                          type: 'SMS',
                          sender: SMS_SENDER,
                          recipient: application.phone,
                          contentSnippet: `Hi ${application.firstName}, your Akelihle loan app ${application.id} is ${status}. View details in your dashboard.`,
                          sentAt: new Date().toISOString()
                        });
                        setStep('done');
                        return 100;
                    }
                    return prev + 15;
                });
            }, 60);
        }
        return () => clearInterval(interval);
    }, [step, application, status, logCommunication]);

    return (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[70] p-4 backdrop-blur-md">
            <div className="bg-neutral-900 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-yellow-500/20 text-center">
                <div className="mb-8">
                  <div className={`text-4xl mb-4 transition-transform duration-500 ${step === 'done' ? 'scale-110' : 'animate-pulse'}`}>
                    {step === 'email' ? '📧' : step === 'sms' ? '📱' : '🚀'}
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-widest">
                    {step === 'done' ? 'Communications Secured' : 'Sending Notifications'}
                  </h3>
                  <div className="mt-3 flex flex-col items-center gap-1">
                    <p className="text-neutral-500 text-xs">Recipient: <span className="text-neutral-300">{application.firstName} {application.lastName}</span></p>
                    {step === 'email' && <p className="text-[10px] text-neutral-600">From: {EMAIL_SENDER}</p>}
                    {step === 'sms' && <p className="text-[10px] text-neutral-600">Sender ID: {SMS_SENDER}</p>}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-sm bg-neutral-800/50 p-3 rounded">
                    <div className="flex items-center gap-3">
                      <span className={step === 'email' ? 'text-yellow-400' : 'text-neutral-500'}>Email Notification {status === ApplicationStatus.Approved && '& Digital Contract'}</span>
                    </div>
                    <span className="font-bold text-yellow-400">{step === 'email' ? `${progress}%` : (step === 'sms' || step === 'done' ? 'SENT' : 'PENDING')}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm bg-neutral-800/50 p-3 rounded">
                    <div className="flex items-center gap-3">
                      <span className={step === 'sms' ? 'text-yellow-400' : 'text-neutral-500'}>SMS Status Alert</span>
                    </div>
                    <span className="font-bold text-yellow-400">{step === 'sms' ? `${progress}%` : (step === 'done' ? 'SENT' : 'PENDING')}</span>
                  </div>
                </div>

                {step !== 'done' && (
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-6">
                    <div className="bg-yellow-400 h-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
                  </div>
                )}

                {step === 'done' && (
                  <button onClick={onClose} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-lg transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs">
                      Return to Console
                  </button>
                )}
            </div>
        </div>
    );
};

const ContractModal: React.FC<{ application: LoanApplication; onClose: () => void }> = ({ application, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[55] p-4 overflow-y-auto">
            <div className="relative w-full max-w-5xl my-8">
                <button onClick={onClose} className="fixed top-4 right-4 bg-yellow-400 text-black font-bold p-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-[65]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="rounded-lg overflow-hidden">
                    <LoanContract application={application} />
                </div>
                <div className="mt-4 flex justify-center gap-4">
                     <button onClick={() => window.print()} className="bg-neutral-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-neutral-700">Print / Save as PDF</button>
                </div>
            </div>
        </div>
    );
};

const AdminSettings: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { updateAdminPassword } = useAppContext();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            return;
        }
        updateAdminPassword(newPassword);
        setMessage('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
            setMessage('');
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-xl w-full max-md border border-neutral-700">
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Change Admin Password</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-neutral-200">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-200">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
                    </div>
                    {message && <p className={message.includes('successfully') ? 'text-yellow-400' : 'text-yellow-500'}>{message}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded transition-colors">Cancel</button>
                        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-colors">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditApplicationModal: React.FC<{ application: LoanApplication; onClose: () => void }> = ({ application, onClose }) => {
    const { updateApplication } = useAppContext();
    const [formData, setFormData] = useState({
        firstName: application.firstName,
        lastName: application.lastName,
        phone: application.phone,
        loanPurpose: application.loanPurpose,
        employmentStatus: application.employmentStatus,
        monthlyIncome: application.monthlyIncome.toString(),
        amount: application.loanAmount.toString(),
        term: application.loanTerm as LoanTerm,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        const amount = parseFloat(formData.amount);
        const term = Number(formData.term) as LoanTerm;
        const interest = amount * INTEREST_RATE;
        const repaymentFee = REPAYMENT_FEES[term];
        const totalRepayment = amount + interest + repaymentFee;

        updateApplication(application.id, {
            applicant: {
                ...application.applicant,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                loanPurpose: formData.loanPurpose,
                employmentStatus: formData.employmentStatus as EmploymentStatus,
                monthlyIncome: parseFloat(formData.monthlyIncome),
            },
            loanDetails: {
                amount,
                term,
                interest,
                repaymentFee,
                totalRepayment,
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-xl w-full max-w-2xl border border-neutral-700 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-6 text-yellow-400 uppercase tracking-widest">Edit Application {application.id}</h3>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-200">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-200">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-200">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-200">Loan Purpose</label>
                        <textarea name="loanPurpose" value={formData.loanPurpose} onChange={handleChange} rows={2} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-200">Employment Status</label>
                            <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500">
                                <option value="Employed">Employed</option>
                                <option value="Self-Employed">Self-Employed</option>
                                <option value="Unemployed">Unemployed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-200">Monthly Income (ZAR)</label>
                            <input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-200">Loan Amount (ZAR)</label>
                            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-200">Loan Term</label>
                            <select name="term" value={formData.term} onChange={handleChange} className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500">
                                <option value={30}>30 Days</option>
                                <option value={60}>60 Days</option>
                                <option value={90}>90 Days</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-neutral-800">
                        <button type="button" onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-6 rounded transition-all">Cancel</button>
                        <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded transition-all shadow-lg active:scale-95">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminDashboard: React.FC = () => {
  const { applications, updateApplicationStatus, updateApplication, refreshApplications, loading } = useAppContext();
  const [showSettings, setShowSettings] = useState(false);
  const [editingApplication, setEditingApplication] = useState<LoanApplication | null>(null);
  const [viewingContract, setViewingContract] = useState<LoanApplication | null>(null);
  const [communicationPending, setCommunicationPending] = useState<{app: LoanApplication, status: ApplicationStatus} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load applications on mount
  useEffect(() => {
    refreshApplications();
  }, []);
  
  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, status);
      const app = applications.find(a => a.id === id);
      if (app) {
        setCommunicationPending({ app, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);

  const filteredApplications = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return applications.filter(app => {
      const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
      const idMatch = app.id.toLowerCase().includes(term);
      const nameMatch = fullName.includes(term);
      const statusMatch = app.status.toLowerCase().includes(term);
      const emailMatch = app.email.toLowerCase().includes(term);
      const employmentMatch = app.employmentStatus.toLowerCase().includes(term);
      const purposeMatch = (app.loanPurpose || '').toLowerCase().includes(term);
      
      return idMatch || nameMatch || statusMatch || emailMatch || employmentMatch || purposeMatch;
    });
  }, [applications, searchTerm]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-yellow-400 uppercase tracking-tighter italic">Admin Console</h1>
        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search ID, Name, Job..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-xs md:w-64"
            />
          </div>
          <button type="button" onClick={() => setShowSettings(true)} className="bg-neutral-800 text-yellow-400 font-bold py-2 px-6 rounded-lg border border-neutral-700 hover:bg-neutral-700 transition-all text-xs uppercase tracking-widest">
              Settings
          </button>
        </div>
      </div>
      
      {showSettings && <AdminSettings onClose={() => setShowSettings(false)} />}
      {editingApplication && (
          <EditApplicationModal 
            application={editingApplication} 
            onClose={() => setEditingApplication(null)} 
          />
      )}
      {viewingContract && (
          <ContractModal 
            application={viewingContract} 
            onClose={() => setViewingContract(null)} 
          />
      )}
      {communicationPending && (
          <CommunicationSimulationModal 
            application={communicationPending.app} 
            status={communicationPending.status}
            onClose={() => setCommunicationPending(null)} 
          />
      )}
      
      <div className="bg-neutral-900/50 rounded-lg shadow-2xl overflow-x-auto border border-neutral-800">
        <table className="w-full text-xs text-left text-neutral-400 border-collapse">
          <thead className="text-[10px] text-yellow-400 uppercase bg-black/60 border-b border-neutral-800">
            <tr>
              <th scope="col" className="px-6 py-4 font-bold tracking-widest">Ref / Date</th>
              <th scope="col" className="px-6 py-4 font-bold tracking-widest">Applicant</th>
              <th scope="col" className="px-6 py-4 font-bold tracking-widest">Job / Income</th>
              <th scope="col" className="px-6 py-4 font-bold tracking-widest">Loan Info</th>
              <th scope="col" className="px-6 py-4 font-bold tracking-widest">Comm Logs</th>
              <th scope="col" className="px-6 py-4 font-bold tracking-widest">Status</th>
              <th scope="col" className="px-6 py-4 font-bold tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {filteredApplications.length === 0 ? (
                <tr>
                    <td colSpan={7} className="text-center py-20 text-neutral-500 italic">
                      {searchTerm ? `No matching records for "${searchTerm}"` : "Database is empty."}
                    </td>
                </tr>
            ) : (
                [...filteredApplications].reverse().map((app: LoanApplication) => {
                  const months = app.loanTerm / 30;
                  const monthlyDeduction = app.totalRepayment / months;
                  
                  return (
                    <tr key={app.id} className="hover:bg-neutral-800/20 transition-all group">
                      <td className="px-6 py-5">
                        <div className="font-mono text-xs text-yellow-500 font-bold">{app.id}</div>
                        <div className="text-[10px] text-neutral-600 mt-1">{new Date(app.applicationDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-5">
                          <div className="font-bold text-neutral-200">{app.firstName} {app.lastName}</div>
                          <div className="text-[10px] text-neutral-500 mt-1">{app.email}</div>
                          <div className="text-[9px] text-yellow-600/60 mt-0.5 truncate max-w-[150px]">{app.loanPurpose}</div>
                      </td>
                      <td className="px-6 py-5">
                          <div className="text-[10px] uppercase font-bold text-neutral-400">{app.employmentStatus}</div>
                          <div className="text-xs text-neutral-300 mt-1">{formatCurrency(app.monthlyIncome)}</div>
                      </td>
                      <td className="px-6 py-5">
                          <div className="font-bold text-white">{formatCurrency(app.loanAmount)}</div>
                          <div className="text-[10px] text-neutral-500 mt-1">{app.loanTerm} days @ {formatCurrency(monthlyDeduction)}pm</div>
                      </td>
                      <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-1 max-w-[120px]">
                            {app.communicationLogs?.map((log, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-sm" title={`${log.type} sent from ${log.sender} to ${log.recipient} at ${new Date(log.sentAt).toLocaleString()}`}>
                                {log.type === 'Email' ? '📧' : '📱'}
                              </span>
                            )) || <span className="text-[9px] text-neutral-600 italic">None</span>}
                          </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-wider ${
                          app.status === ApplicationStatus.Pending ? 'bg-neutral-800 text-yellow-300 border border-neutral-700' :
                          app.status === ApplicationStatus.Approved ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' :
                          'bg-black text-yellow-700 border border-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            {app.status === ApplicationStatus.Pending ? (
                               <>
                                 <button type="button" onClick={() => handleStatusChange(app.id, ApplicationStatus.Approved)} className="text-[10px] font-bold text-yellow-400 hover:text-white transition-colors uppercase tracking-widest" title="Approve & Send Comm">Approve</button>
                                 <button type="button" onClick={() => handleStatusChange(app.id, ApplicationStatus.Rejected)} className="text-[10px] font-bold text-neutral-600 hover:text-yellow-600 transition-colors uppercase tracking-widest">Reject</button>
                                 <button type="button" onClick={() => setEditingApplication(app)} className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest">Edit</button>
                               </>
                            ) : (
                                <>
                                    <button type="button" onClick={() => setViewingContract(app)} className="text-[10px] font-bold text-yellow-400 hover:underline transition-all uppercase tracking-widest">Contract</button>
                                    <button type="button" onClick={() => setCommunicationPending({app, status: app.status})} className="text-[10px] font-bold text-neutral-600 hover:text-neutral-300 uppercase tracking-widest" title="Resend Notification">Notify</button>
                                </>
                            )}
                          </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center justify-between text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
        <span>Records found: {filteredApplications.length}</span>
        <span>Akelihle Administrative Access Secured</span>
      </div>
    </div>
  );
};

export default AdminDashboard;