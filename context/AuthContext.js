import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // AuthContext.js
useEffect(() => {
  if (typeof window !== 'undefined') {
    async function loadUserFromLocalStorage() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with your API
          const response = await fetch('http://localhost:5000/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            // If token verification fails, throw an error to trigger catch block
            throw new Error('Token verification failed');
          }
          
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setUser(null);
        // Optionally redirect to login if on a protected route
        if (window.location.pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        // Always set loading to false
        setLoading(false);
      }
    }
    
    loadUserFromLocalStorage();
  }
}, [router]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Use the error message from the server or a default message
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      // Redirect to dashboard or desired page
      router.push('/dashboard');
      
      return { 
        success: true,
        user: data.user
      };
    } catch (error) {
      // Log the error for debugging
      console.error('Login error:', error);
      
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred'
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      // Optionally auto-login or redirect to login
      router.push('/login');
      
      return { 
        success: true,
        message: 'Account created successfully'
      };
    } catch (error) {
      console.error('Signup error:', error);
      
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred'
      };
    }
  };

  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    // Clear user state
    setUser(null);
    // Redirect to login page
    router.push('/login');
  };

  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }
      
      // Update local user state
      setUser(prevUser => ({ ...prevUser, ...updatedData }));
      
      return { 
        success: true,
        message: 'Profile updated successfully',
        user: data.user
      };
    } catch (error) {
      console.error('Profile update error:', error);
      
      return { 
        success: false, 
        error: error.message || 'An unexpected error occurred'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};