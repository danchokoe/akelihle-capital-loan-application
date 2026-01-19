const API_BASE_URL = 'http://localhost:3001/api';

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
    const response = await apiRequest('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  applicantSignup: async (email: string, password: string) => {
    const response = await apiRequest('/auth/applicant/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  applicantLogin: async (email: string, password: string) => {
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
    removeToken();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdminLoggedIn');
  },
};

// Applications API
export const applicationsAPI = {
  submit: async (applicationData: any, files: { [key: string]: File }) => {
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
    return apiRequest(`/applications/${id}`);
  },

  getAll: async () => {
    return apiRequest('/applications');
  },

  getUserApplications: async () => {
    return apiRequest('/applications/user/me');
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getContract: async (id: string) => {
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
    return apiRequest('/admin/password', {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    });
  },

  getStats: async () => {
    return apiRequest('/admin/stats');
  },
};

export { getToken, setToken, removeToken };