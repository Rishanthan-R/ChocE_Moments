import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to decode JWT token
  const decodeToken = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('choce_token');
    const savedUser = localStorage.getItem('choce_user_data');
    
    if (savedToken && savedUser) {
      try {
        const decoded = decodeToken(savedToken);
        if (decoded) {
          setUser(JSON.parse(savedUser));
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('choce_token');
          localStorage.removeItem('choce_user_data');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        localStorage.removeItem('choce_token');
        localStorage.removeItem('choce_user_data');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('choce_user_data', JSON.stringify(user));
    } else {
      localStorage.removeItem('choce_user_data');
      localStorage.removeItem('choce_token');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }

      if (data.token) {
        // Store token
        localStorage.setItem('choce_token', data.token);
        
        // Decode token to get user info
        const decoded = decodeToken(data.token);
        if (decoded) {
          const userData: User = {
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            name: `${decoded.firstName} ${decoded.lastName}`,
            role: decoded.role,
            phone: '', // Not in token, will be empty
            address: '', // Not in token, will be empty
          };
          setUser(userData);
          return { success: true };
        }
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please check if the backend server is running.' };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Split name into firstName and lastName
      const nameParts = userData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: userData.email,
          password: userData.password,
          phone: userData.phone || 'NOT GIVEN',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Signup failed' };
      }

      // Auto-login after successful signup
      return await login(userData.email, userData.password);
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error. Please check if the backend server is running.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('choce_user_data');
    localStorage.removeItem('choce_token');
    // Also clear cart on logout
    localStorage.removeItem('choce_cart');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
