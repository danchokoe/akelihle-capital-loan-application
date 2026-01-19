import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { EmploymentStatus } from '../types';

interface ApplicationFormProps {
  loanDetails: {
    amount: number;
    term: 30 | 60 | 90;
    interest: number;
    repaymentFee: number;
    totalRepayment: number;
  };
  goBack: () => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// --- Sub-components ---

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  name, label, type = 'text', value, onChange, readOnly = false, required = false, error, placeholder 
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="block text-sm font-medium text-neutral-200">
      {label} {required && <span className="text-yellow-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`mt-1 block w-full bg-neutral-800 border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
        error ? 'border-yellow-600 ring-1 ring-yellow-600' : 'border-neutral-700'
      } ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
    />
    {error && <span className="text-[11px] text-yellow-500 font-semibold mt-1">{error}</span>}
  </div>
);

interface FileFieldProps {
  name: string;
  label: string;
  description: string;
  fileName?: string;
  status: UploadStatus;
  error?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileField: React.FC<FileFieldProps> = ({ 
  name, label, description, fileName, status, error, onFileChange 
}) => (
  <div className={`flex flex-col gap-1 p-4 bg-neutral-950/50 rounded-lg border transition-colors ${error ? 'border-yellow-600 bg-yellow-950/10' : 'border-neutral-800/50'}`}>
    <label htmlFor={name} className="block text-sm font-medium text-neutral-200">
      {label} <span className="text-yellow-500">*</span>
    </label>
    <div className="mt-2 flex items-center gap-4">
      <label className={`cursor-pointer transition-all border text-[10px] font-bold py-2 px-5 rounded uppercase tracking-tighter shrink-0 ${
        status === 'uploading' 
          ? 'bg-neutral-800 border-neutral-800 text-neutral-500 cursor-wait' 
          : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-yellow-400 hover:border-yellow-400'
      }`}>
        {status === 'success' ? 'Change File' : 'Browse'}
        <input 
          type="file" 
          name={name} 
          id={name} 
          className="hidden" 
          onChange={onFileChange} 
          accept=".pdf,.jpg,.jpeg,.png" 
          disabled={status === 'uploading'}
        />
      </label>
      <div className="flex flex-col flex-grow min-w-0">
        <span className={`text-xs truncate ${fileName ? 'text-white font-medium' : 'text-neutral-500 italic'}`}>
          {fileName || 'No file chosen'}
        </span>
        <div className="mt-1 flex items-center gap-2">
          {status === 'uploading' && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
              <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Uploading...</span>
            </div>
          )}
          {status === 'success' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">✓ Uploaded</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">⚠ Failed</span>
            </div>
          )}
        </div>
      </div>
    </div>
    <p className="text-[10px] text-neutral-500 mt-2 pl-1 leading-relaxed">{description}</p>
    {error && <span className="text-[11px] text-yellow-500 font-semibold mt-1 px-1">{error}</span>}
  </div>
);

const ApplicationForm: React.FC<ApplicationFormProps> = ({ loanDetails, goBack }) => {
  const { addApplication, currentUser } = useAppContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    employmentStatus: 'Employed' as EmploymentStatus,
    companyName: '',
    monthlyIncome: '',
    loanPurpose: '',
  });

  const [files, setFiles] = useState({
    idDocument: null as File | null,
    proofOfResidence: null as File | null,
    proofOfSalary: null as File | null,
  });

  const [uploadStatuses, setUploadStatuses] = useState<Record<string, UploadStatus>>({
    idDocument: 'idle',
    proofOfResidence: 'idle',
    proofOfSalary: 'idle',
  });

  const [confirmations, setConfirmations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadStatuses(prev => ({ ...prev, [fieldName]: 'uploading' }));
      
      setTimeout(() => {
        if (file.size > 5 * 1024 * 1024) {
           setUploadStatuses(prev => ({ ...prev, [fieldName]: 'error' }));
           setErrors(prev => ({ ...prev, [fieldName]: `File is too large (max 5MB)` }));
        } else {
           setFiles(prev => ({ ...prev, [fieldName]: file }));
           setUploadStatuses(prev => ({ ...prev, [fieldName]: 'success' }));
           setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[fieldName];
              return newErrors;
           });
        }
      }, 1500);
    }
  };

  const validateSAHandle = (phone: string) => {
    const saPhoneRegex = /^((\+27)|0)[1-9][0-9]{8}$/;
    return saPhoneRegex.test(phone.replace(/\s/g, ''));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isSubmitting) return;
    
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!validateSAHandle(formData.phone)) {
      newErrors.phone = 'Please enter a valid South African phone number.';
    }

    if (!formData.monthlyIncome.trim() || Number(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Please enter a valid monthly income.';
    }

    if (!formData.loanPurpose.trim()) {
      newErrors.loanPurpose = 'Please state the purpose of the loan.';
    }

    if (uploadStatuses.idDocument !== 'success') newErrors.idDocument = 'Please upload your ID document.';
    if (uploadStatuses.proofOfResidence !== 'success') newErrors.proofOfResidence = 'Please upload proof of residence.';
    if (uploadStatuses.proofOfSalary !== 'success') newErrors.proofOfSalary = 'Please upload your salary slip.';

    if (!confirmations) {
      newErrors.confirmations = 'You must agree to the disclosures to submit.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: currentUser.email,
        phone: formData.phone,
        employmentStatus: formData.employmentStatus.toUpperCase(),
        loanPurpose: formData.loanPurpose,
        companyName: formData.companyName,
        monthlyIncome: Number(formData.monthlyIncome),
        loanAmount: loanDetails.amount,
        loanTerm: loanDetails.term,
        interestRate: loanDetails.interest,
        repaymentFee: loanDetails.repaymentFee,
        totalRepayment: loanDetails.totalRepayment,
      };

      const fileData = {
        idDocument: files.idDocument!,
        proofOfResidence: files.proofOfResidence!,
        proofOfSalary: files.proofOfSalary!,
      };

      console.log('🚀 ApplicationForm: Submitting application');
      console.log('📋 Application data:', applicationData);
      console.log('📁 Files:', Object.keys(fileData).map(key => `${key}: ${fileData[key].name} (${fileData[key].type})`));
      console.log('👤 Current user:', currentUser);
      
      await addApplication(applicationData, fileData);
      console.log('✅ Application submitted successfully');
      setSubmitted(true);
    } catch (error) {
      console.error('Application submission error:', error);
      setErrors({ submit: `Failed to submit application: ${error instanceof Error ? error.message : 'Please try again.'}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center bg-neutral-900 p-8 rounded-lg shadow-lg border border-neutral-800">
        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-black">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 uppercase tracking-tighter italic">Application Stored!</h2>
        <p className="text-neutral-200 mb-6 text-sm">Your application has been securely recorded. You can now track its progress and view your contract from the dashboard.</p>
        <button onClick={goBack} className="w-full bg-yellow-400 text-black font-black py-4 rounded-lg hover:bg-yellow-500 transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95">
          Go to My Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-neutral-900 p-8 rounded-lg shadow-lg border border-neutral-800">
       <button onClick={goBack} className="text-yellow-400 hover:text-yellow-300 mb-4 transition-colors font-bold text-sm" disabled={isSubmitting}>&larr; Back to Calculator</button>
      <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400 uppercase tracking-widest">Loan Application</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400 border-b border-neutral-800 pb-2">1. Personal Information</h3>
            <InputField name="email" label="Email Address" type="email" value={currentUser?.email || ''} readOnly={true} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} required error={errors.firstName} />
                <InputField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} required error={errors.lastName} />
            </div>
            <InputField name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required error={errors.phone} placeholder="e.g. 071 123 4567" />
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400 border-b border-neutral-800 pb-2">2. Financial & Loan Purpose</h3>
            <div>
              <label htmlFor="loanPurpose" className="block text-sm font-medium text-neutral-200">
                  Loan Purpose <span className="text-yellow-500">*</span>
              </label>
              <textarea
                  name="loanPurpose"
                  id="loanPurpose"
                  rows={2}
                  value={formData.loanPurpose}
                  onChange={handleChange}
                  placeholder="Tell us what you need the loan for..."
                  className={`mt-1 block w-full bg-neutral-800 border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                    errors.loanPurpose ? 'border-yellow-600 ring-1 ring-yellow-600' : 'border-neutral-700'
                  }`}
                  disabled={isSubmitting}
              />
              {errors.loanPurpose && <span className="text-[11px] text-yellow-500 font-semibold mt-1 block">{errors.loanPurpose}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="employmentStatus" className="block text-sm font-medium text-neutral-200">
                        Employment Status <span className="text-yellow-500">*</span>
                    </label>
                    <select
                        name="employmentStatus"
                        id="employmentStatus"
                        value={formData.employmentStatus}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        disabled={isSubmitting}
                    >
                        <option value="Employed">Employed</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Unemployed">Unemployed</option>
                    </select>
                </div>
                <InputField name="monthlyIncome" label="Monthly Income (ZAR)" type="number" value={formData.monthlyIncome} onChange={handleChange} required error={errors.monthlyIncome} />
            </div>
            <InputField name="companyName" label="Company Name (Optional)" value={formData.companyName} onChange={handleChange} />
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400 border-b border-neutral-800 pb-2">3. Required Documents</h3>
            <div className="grid grid-cols-1 gap-4">
                <FileField 
                  name="idDocument" 
                  label="ID Document" 
                  description="Upload a clear copy of your ID (PDF or image)"
                  fileName={files.idDocument?.name}
                  status={uploadStatuses.idDocument}
                  error={errors.idDocument}
                  onFileChange={handleFileChange}
                />
                <FileField 
                  name="proofOfResidence" 
                  label="Proof of Residence" 
                  description="Upload a utility bill or bank statement (not older than 3 months)"
                  fileName={files.proofOfResidence?.name} 
                  status={uploadStatuses.proofOfResidence}
                  error={errors.proofOfResidence}
                  onFileChange={handleFileChange}
                />
                <FileField 
                  name="proofOfSalary" 
                  label="Proof of Salary" 
                  description="Upload your most recent salary slip (PDF or image)"
                  fileName={files.proofOfSalary?.name} 
                  status={uploadStatuses.proofOfSalary}
                  error={errors.proofOfSalary}
                  onFileChange={handleFileChange}
                />
            </div>
        </div>

        <div className={`bg-neutral-950 p-6 rounded-lg border transition-colors space-y-4 ${errors.confirmations ? 'border-yellow-600 bg-yellow-950/10' : 'border-neutral-800'}`}>
            <p className="text-sm font-semibold text-yellow-400">By submitting this application, I confirm that:</p>
            <ul className="text-xs text-neutral-300 space-y-2 list-disc pl-5">
              <li>All information provided is true and accurate</li>
              <li>I understand the loan terms and repayment obligations</li>
              <li>I consent to a credit and affordability assessment</li>
              <li>I have read the National Credit Act disclosures</li>
            </ul>
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={confirmations}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setConfirmations(e.target.checked);
                    if (e.target.checked && errors.confirmations) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.confirmations;
                        return newErrors;
                      });
                    }
                  }}
                  className="w-5 h-5 accent-yellow-400 rounded border-neutral-700 bg-neutral-800 focus:ring-yellow-500"
                />
                <span className="text-sm text-neutral-200 group-hover:text-white transition-colors">I agree to the above confirmations and disclosures.</span>
              </label>
              {errors.confirmations && <span className="text-[11px] text-yellow-500 font-semibold mt-2 block">{errors.confirmations}</span>}
            </div>
        </div>
        
        <div className="pt-6">
            <button 
              type="submit" 
              className={`w-full bg-yellow-400 text-black font-black py-4 rounded-lg transition-all duration-300 shadow-lg active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-3 ${(!confirmations || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500'}`}
              disabled={(!confirmations || isSubmitting)}
            >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Securing Record...</span>
                  </>
                ) : 'Submit Application'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;