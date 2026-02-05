import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Header from './components/Header';
import LoanCalculator from './components/LoanCalculator';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import StatusChecker from './components/StatusChecker';
import ApplicantAuth from './components/ApplicantAuth';
import UserDashboard from './components/UserDashboard';
import FAQ from './components/FAQ';
import PrivacyPolicy from './components/PrivacyPolicy';
import Preloader from './components/Preloader';
import DemoBanner from './components/DemoBanner';

export type View = 'home' | 'status' | 'admin-login' | 'admin-dashboard' | 'applicant-auth' | 'user-dashboard' | 'faq' | 'privacy-policy';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(true);
  const { isAdminLoggedIn, currentUser } = useAppContext();

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show preloader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    if (isAdminLoggedIn) {
      return <AdminDashboard />;
    }
    
    switch (currentView) {
      case 'home':
        return <LoanCalculator setView={setCurrentView} />;
      case 'status':
        return <StatusChecker />;
      case 'admin-login':
        return <AdminLogin setView={setCurrentView} />;
      case 'applicant-auth':
        return <ApplicantAuth setView={setCurrentView} />;
      case 'user-dashboard':
        return currentUser ? <UserDashboard setView={setCurrentView} /> : <ApplicantAuth setView={setCurrentView} />;
      case 'faq':
        return <FAQ />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      default:
        return <LoanCalculator setView={setCurrentView} />;
    }
  };

  return (
    <>
      <Preloader isLoading={isLoading} />
      <div className="min-h-screen bg-black text-white font-sans flex flex-col">
        <DemoBanner />
        <Header setView={setCurrentView} currentView={currentView} />
        <main className="container mx-auto px-4 py-12 flex-grow">
          {renderView()}
        </main>
        <footer className="text-center py-10 px-6 text-neutral-500 border-t border-neutral-900 bg-black">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center mb-6">
              <img 
                src="/logo.png" 
                alt="Akelihle Capital" 
                className="h-32 w-auto opacity-80 hover:opacity-100 transition-opacity filter drop-shadow-lg"
              />
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm border-b border-neutral-900 pb-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <h3 className="text-yellow-400 font-bold uppercase tracking-widest text-xs">Contact Us</h3>
              <a href="https://wa.me/27719699412" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                <span className="text-neutral-400">WhatsApp:</span> +27 (071)-969-9412
              </a>
              <a href="mailto:info@akelihlecap.co.za" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                <span className="text-neutral-400">Email:</span> info@akelihlecap.co.za
              </a>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <h3 className="text-yellow-400 font-bold uppercase tracking-widest text-xs">Legal</h3>
              <button onClick={() => setCurrentView('faq')} className="hover:text-yellow-400 transition-colors">Frequently Asked Questions</button>
              <button onClick={() => setCurrentView('privacy-policy')} className="hover:text-yellow-400 transition-colors">Privacy & Cookie Policy</button>
            </div>
          </div>
          
          <p className="text-[11px] leading-relaxed uppercase tracking-wider text-neutral-600 font-medium">
            Akelihle Capital Pty Ltd (Reg No: 2025/053404/07) is a registered credit provider (NCRCP21550). All loans are subject to affordability assessment and verification in accordance with the National Credit Act 34 of 2005. Lending criteria applies.
          </p>
          <div className="h-px w-12 bg-yellow-500/20 mx-auto"></div>
          <div>
            <p className="text-xs">© {new Date().getFullYear()} Akelihle Capital. All rights reserved.</p>
            <p className="mt-4 text-[10px] text-neutral-600 uppercase tracking-widest">
              Crafted by <a href="https://wokeowl.co.za" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-400 transition-colors font-bold">Woke Owl</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;