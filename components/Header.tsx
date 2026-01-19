
import React from 'react';
import { View } from '../App';
import { useAppContext } from '../contexts/AppContext';

interface HeaderProps {
  setView: (view: View) => void;
  currentView: View;
}

interface NavLinkProps {
  view: View;
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ view, children, currentView, setView }) => {
  const isActive = currentView === view;
  return (
     <button
      onClick={() => setView(view)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-yellow-400 text-black'
          : 'text-neutral-200 hover:bg-neutral-800 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ setView, currentView }) => {
  const { isAdminLoggedIn, adminLogout, currentUser, applicantLogout } = useAppContext();

  const handleAdminLogout = () => {
    adminLogout();
    setView('home');
  };

  const handleApplicantLogout = () => {
    applicantLogout();
    setView('home');
  };
  
  const renderNavLinks = () => {
    if (isAdminLoggedIn) {
      return (
        <>
          <NavLink view="admin-dashboard" currentView={currentView} setView={setView}>Dashboard</NavLink>
          <button onClick={handleAdminLogout} className="px-4 py-2 rounded-md text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white">Logout</button>
        </>
      );
    }
    if (currentUser) {
       return (
        <>
          <NavLink view="home" currentView={currentView} setView={setView}>New Loan</NavLink>
          <NavLink view="user-dashboard" currentView={currentView} setView={setView}>My Dashboard</NavLink>
          <NavLink view="faq" currentView={currentView} setView={setView}>FAQ</NavLink>
          <button onClick={handleApplicantLogout} className="px-4 py-2 rounded-md text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white">Logout</button>
        </>
      );
    }
    return (
       <>
          <NavLink view="home" currentView={currentView} setView={setView}>Apply</NavLink>
          <NavLink view="faq" currentView={currentView} setView={setView}>FAQ</NavLink>
          <NavLink view="status" currentView={currentView} setView={setView}>Check Status</NavLink>
          <NavLink view="applicant-auth" currentView={currentView} setView={setView}>Login / Sign Up</NavLink>
          <button onClick={() => setView('admin-login')} className="text-xs text-neutral-400 hover:text-yellow-400">Admin</button>
       </>
    );
  }

  return (
    <header className="bg-neutral-900 border-b border-neutral-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Brand Identity - Grouped on the Left */}
          <div className="flex items-center gap-4">
            <button onClick={() => setView(currentUser ? 'user-dashboard' : 'home')} className="flex-shrink-0 transition-transform active:scale-95 flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Akelihle Capital" 
                className="h-20 w-auto filter brightness-110 drop-shadow-lg"
              />
              <div className="text-yellow-400 font-black text-2xl tracking-tighter uppercase italic hidden sm:block">
                Akelihle Capital
              </div>
            </button>
          </div>
          
          {/* Navigation - Grouped on the Right */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-2">
                {renderNavLinks()}
              </div>
            </div>
            {/* Mobile/Compact View indicator or label could go here, but keeping nav links for now */}
            <div className="block lg:hidden">
                {/* For mobile simplicity, we show the login status or a simplified menu if needed */}
                <div className="flex space-x-2">
                   {currentUser ? (
                       <NavLink view="user-dashboard" currentView={currentView} setView={setView}>Dashboard</NavLink>
                   ) : (
                       <NavLink view="applicant-auth" currentView={currentView} setView={setView}>Login</NavLink>
                   )}
                </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
