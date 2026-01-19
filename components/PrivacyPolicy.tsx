import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 text-neutral-300">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8 uppercase tracking-tight text-center">Privacy & Policy</h1>
      
      <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-yellow-400 mb-4">1. Introduction</h2>
          <p>
            Akelihle Capital Pty Ltd (Reg No: 2025/053404/07), a registered credit provider (NCRCP21550) ("we", "us", "our"), is committed to protecting the privacy and security of your personal information. This policy explains how we collect, use, and protect your data in accordance with the Protection of Personal Information Act (POPIA) and the National Credit Act (NCA).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-yellow-400 mb-4">2. Information We Collect</h2>
          <p className="mb-4">To provide credit services, we collect the following information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal details: Name, Surname, ID Number, Gender, and Contact Information.</li>
            <li>Financial details: Monthly income, employment history, bank account details, and expense declarations.</li>
            <li>Documentation: Copies of ID documents, payslips, and utility bills for verification.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-yellow-400 mb-4">3. Use of Information</h2>
          <p className="mb-4">Your personal information is used exclusively for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Conducting affordability assessments as required by the National Credit Act.</li>
            <li>Verifying your identity and employment status to prevent fraud.</li>
            <li>Processing loan applications and disbursing funds.</li>
            <li>Reporting your credit performance to registered Credit Bureaus.</li>
            <li>Communicating with you regarding your application or account status.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-yellow-400 mb-4">4. Sharing Your Information</h2>
          <p>
            We do not sell your personal data. We only share your information with third parties when necessary, such as Credit Bureaus (for credit checks), regulatory bodies (NCR), or legal authorities when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-yellow-400 mb-4">5. Data Security</h2>
          <p>
            We implement high-level security measures, including data encryption and restricted access controls, to protect your data from unauthorized access, loss, or disclosure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-yellow-400 mb-4">6. Your Rights</h2>
          <p>
            You have the right to access the personal information we hold about you, to request corrections of inaccurate data, and to object to certain processing activities. To exercise these rights, please contact our Information Officer at info@akelihlecap.co.za.
          </p>
        </section>

        <div className="pt-8 border-t border-neutral-800 text-sm text-neutral-500 text-center">
          Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;