// Import demo API for AWS Amplify deployment
import { 
  demoAuthAPI, 
  demoApplicationsAPI, 
  demoAdminAPI, 
  shouldUseDemoMode 
} from './demoApi';

// Determine API base URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api'  // Replace with your actual backend URL
  : 'http://localhost:3001/api';

// Check if we should use demo mode (AWS Amplify deployment)
const USE_DEMO_MODE = shouldUseDemoMode();

console.log('API Service initialized:', { USE_DEMO_MODE, NODE_ENV: process.env.NODE_ENV });

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  adminLogin: async (username: string, password: string) => {
    if (USE_DEMO_MODE) {
      return demoAuthAPI.adminLogin(username, password);
    }
    
    const response = await apiRequest('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  applicantSignup: async (email: string, password: string, firstName?: string, lastName?: string) => {
    if (USE_DEMO_MODE) {
      return demoAuthAPI.applicantSignup(email, password, firstName, lastName);
    }
    
    const response = await apiRequest('/auth/applicant/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  applicantLogin: async (email: string, password: string) => {
    if (USE_DEMO_MODE) {
      return demoAuthAPI.applicantLogin(email, password);
    }
    
    const response = await apiRequest('/auth/applicant/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  logout: () => {
    if (USE_DEMO_MODE) {
      return demoAuthAPI.logout();
    }
    
    removeToken();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdminLoggedIn');
  },
};

// Applications API
export const applicationsAPI = {
  submit: async (applicationData: any, files: { [key: string]: File }) => {
    if (USE_DEMO_MODE) {
      return demoApplicationsAPI.submit(applicationData, files);
    }
    
    const formData = new FormData();
    
    // Add application data
    Object.keys(applicationData).forEach(key => {
      formData.append(key, applicationData[key]);
    });
    
    // Add files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { error: errorText || 'Network error' };
      }
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  getById: async (id: string) => {
    if (USE_DEMO_MODE) {
      return demoApplicationsAPI.getById(id);
    }
    return apiRequest(`/applications/${id}`);
  },

  getAll: async () => {
    if (USE_DEMO_MODE) {
      console.log('Using demo mode for getAll');
      return demoApplicationsAPI.getAll();
    }
    console.log('Using real API for getAll');
    return apiRequest('/applications');
  },

  getUserApplications: async () => {
    if (USE_DEMO_MODE) {
      return demoApplicationsAPI.getUserApplications();
    }
    return apiRequest('/applications/user/me');
  },

  updateStatus: async (id: string, status: string) => {
    if (USE_DEMO_MODE) {
      return demoApplicationsAPI.updateStatus(id, status);
    }
    return apiRequest(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getContract: async (id: string) => {
    if (USE_DEMO_MODE) {
      return demoApplicationsAPI.getContract(id);
    }
    
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/applications/${id}/contract`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contract');
    }

    return response.blob();
  },
};

// Admin API
export const adminAPI = {
  updatePassword: async (newPassword: string) => {
    if (USE_DEMO_MODE) {
      return demoAdminAPI.updatePassword(newPassword);
    }
    return apiRequest('/admin/password', {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    });
  },

  getStats: async () => {
    if (USE_DEMO_MODE) {
      return demoAdminAPI.getStats();
    }
    return apiRequest('/admin/stats');
  },

  sendNotification: async (applicationId: string, type: string, message: string) => {
    if (USE_DEMO_MODE) {
      return demoAdminAPI.sendNotification(applicationId, type, message);
    }
    return apiRequest('/admin/notify', {
      method: 'POST',
      body: JSON.stringify({ applicationId, type, message }),
    });
  },
};

export { getToken, setToken, removeToken };