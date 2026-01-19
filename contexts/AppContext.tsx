import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoanApplication, ApplicationStatus, User, CommunicationLog } from '../types';
import { authAPI, applicationsAPI, getToken } from '../services/api';

interface AppContextType {
  // Application Management
  applications: LoanApplication[];
  addApplication: (application: Omit<LoanApplication, 'id' | 'applicationDate' | 'auditLog' | 'status' | 'communicationLogs'>, files: { [key: string]: File }) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  updateApplication: (id: string, updatedApp: Partial<LoanApplication>) => void;
  findApplication: (id: string) => Promise<LoanApplication | undefined>;
  getUserApplications: () => Promise<void>;
  logCommunication: (id: string, log: CommunicationLog) => void;
  refreshApplications: () => Promise<void>;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  adminUsername: string;
  updateAdminPassword: (newPass: string) => Promise<void>;

  // User Auth
  users: User[];
  currentUser: User | null;
  applicantLogin: (email: string, pass: string) => Promise<boolean>;
  applicantSignup: (email: string, pass: string) => Promise<User | 'exists'>;
  applicantLogout: () => void;

  // Loading states
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State Hooks
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const adminUsername = 'admin';

  // Check authentication status on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Try to decode token to determine user type
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.type === 'admin') {
          setIsAdminLoggedIn(true);
        } else if (payload.type === 'user') {
          setCurrentUser({ id: payload.id, email: payload.email, password: '' });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        authAPI.logout();
      }
    }
  }, []);

  // --- Application Methods ---
  const addApplication = async (appData: Omit<LoanApplication, 'id' | 'applicationDate' | 'auditLog' | 'status' | 'communicationLogs'>, files: { [key: string]: File }) => {
    try {
      setLoading(true);
      const result = await applicationsAPI.submit(appData, files);
      
      // Refresh applications after successful submission
      if (currentUser) {
        await getUserApplications();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: ApplicationStatus) => {
    try {
      setLoading(true);
      await applicationsAPI.updateStatus(id, status);
      // Refresh applications after status update
      await refreshApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = (id: string, updatedApp: Partial<LoanApplication>) => {
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, ...updatedApp } : app)
    );
  };

  const findApplication = async (id: string): Promise<LoanApplication | undefined> => {
    try {
      const response = await applicationsAPI.getById(id);
      return response;
    } catch (error) {
      console.error('Error finding application:', error);
      return undefined;
    }
  };

  const getUserApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getUserApplications();
      setApplications(response.applications || []);
    } catch (error) {
      console.error('Error fetching user applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshApplications = async () => {
    try {
      setLoading(true);
      if (isAdminLoggedIn) {
        const response = await applicationsAPI.getAll();
        setApplications(response.applications || []);
      } else if (currentUser) {
        await getUserApplications();
      }
    } catch (error) {
      console.error('Error refreshing applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const logCommunication = (id: string, log: CommunicationLog) => {
    // This is handled by the backend now, but we keep the interface for compatibility
    console.log('Communication logged:', { id, log });
  };

  // --- Admin Methods ---
  const adminLogin = async (password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await authAPI.adminLogin(adminUsername, password);
      setIsAdminLoggedIn(true);
      await refreshApplications();
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    authAPI.logout();
    setIsAdminLoggedIn(false);
    setApplications([]);
  };

  const updateAdminPassword = async (newPass: string) => {
    try {
      setLoading(true);
      await authAPI.adminLogin(adminUsername, newPass);
      console.log('Admin password updated successfully');
    } catch (error) {
      console.error('Error updating admin password:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // --- User Methods ---
  const applicantLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authAPI.applicantLogin(email, pass);
      setCurrentUser(response.user);
      await getUserApplications();
      return true;
    } catch (error) {
      console.error('Applicant login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const applicantSignup = async (email: string, pass: string): Promise<User | 'exists'> => {
    try {
      setLoading(true);
      const response = await authAPI.applicantSignup(email, pass);
      setCurrentUser(response.user);
      return response.user;
    } catch (error: any) {
      console.error('Applicant signup error:', error);
      if (error.message.includes('already exists')) {
        return 'exists';
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const applicantLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setApplications([]);
  };

  return (
    <AppContext.Provider value={{
      // Application Management
      applications,
      addApplication,
      updateApplicationStatus,
      updateApplication,
      findApplication,
      getUserApplications,
      logCommunication,
      refreshApplications,

      // Admin Auth
      isAdminLoggedIn,
      adminLogin,
      adminLogout,
      adminUsername,
      updateAdminPassword,

      // User Auth
      users,
      currentUser,
      applicantLogin,
      applicantSignup,
      applicantLogout,

      // Loading states
      loading,
      setLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};