const API_URL = 'http://localhost:5000/api'; // Your backend URL

export const api = {
  request: async (endpoint, method = 'GET', body = null, includeToken = true) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(includeToken && token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    };
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Helper function for authentication-related requests
export const authApi = {
  signup: (name, email, password) =>
    api.request('/auth/signup', 'POST', { name, email, password }, false),
  
  login: (email, password) =>
    api.request('/auth/login', 'POST', { email, password }, false),
  
  forgotPassword: (email) =>
    api.request('/auth/forgot-password', 'POST', { email }, false),
  
  resetPassword: (token, password) =>
    api.request('/auth/reset-password', 'POST', { token, password }, false),
  
  validateResetToken: (token) =>
    api.request(`/auth/validate-reset-token?token=${token}`, 'GET', null, false),
  
  // New method for email verification
  verifyEmail: (token) =>
    api.request(`/auth/verify-email?token=${token}`, 'GET', null, false),
  
  // New method to resend verification email
  resendVerificationEmail: (email) =>
    api.request('/auth/resend-verification-email', 'POST', { email }, false),
  
  getProfile: () =>
    api.request('/auth/me'),
  
  updateProfile: (name) =>
    api.request('/auth/update-profile', 'PUT', { name }),
  
  changePassword: (currentPassword, newPassword) =>
    api.request('/auth/change-password', 'PUT', { currentPassword, newPassword })
};