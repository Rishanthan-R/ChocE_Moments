import React, { createContext, useContext, useState, useEffect } from 'react';

import { API_BASE_URL } from '../config';

// reCAPTCHA site key - set this from environment or leave empty to disable
const RECAPTCHA_SITE_KEY = '6LeXu1EsAAAAAN8NcAZ7NdNsu1eDI0jelUKiJ9I_'; // Will be set by user when they configure CAPTCHA


interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>;
  logout: () => void;
  getToken: () => string | null;
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

/**
 * Execute reCAPTCHA v3 and get token
 * @param action - The action name for reCAPTCHA scoring
 * @returns Promise<string | null> - The reCAPTCHA token or null if not configured
 */
const executeRecaptcha = async (action: string): Promise<string | null> => {
  if (!RECAPTCHA_SITE_KEY || typeof window === 'undefined') {
    console.log('[CAPTCHA] reCAPTCHA not configured - skipping');
    return null;
  }

  try {
    // Check if grecaptcha is loaded
    if (!(window as any).grecaptcha) {
      console.warn('[CAPTCHA] grecaptcha not loaded');
      return null;
    }

    const token = await (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
    console.log('[CAPTCHA] Token obtained for action:', action);
    return token;
  } catch (error) {
    console.error('[CAPTCHA] Failed to execute reCAPTCHA:', error);
    return null;
  }
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

  // Load reCAPTCHA script on mount (if configured)
  useEffect(() => {
    if (RECAPTCHA_SITE_KEY && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.head.appendChild(script);
      console.log('[CAPTCHA] reCAPTCHA script loaded');
    }
  }, []);

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
      // Get reCAPTCHA token for login
      const recaptchaToken = await executeRecaptcha('login');

      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(recaptchaToken ? { 'x-recaptcha-token': recaptchaToken } : {}),
        },
        body: JSON.stringify({
          email,
          password,
          ...(recaptchaToken ? { recaptchaToken } : {}),
        }),
      });


      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 429) {
          return { success: false, error: 'Too many login attempts. Please try again later.' };
        }
        if (response.status === 423) {
          return { success: false, error: data.message || 'Account temporarily locked. Please try again later.' };
        }
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
            isEmailVerified: decoded.isEmailVerified,
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

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string; requiresVerification?: boolean }> => {
    try {
      // Split name into firstName and lastName
      const nameParts = userData.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

      // Get reCAPTCHA token (if configured)
      const recaptchaToken = await executeRecaptcha('register');

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(recaptchaToken ? { 'x-recaptcha-token': recaptchaToken } : {}),
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: userData.email,
          password: userData.password,
          phone: userData.phone || 'NOT GIVEN',
          address: userData.address || '',
          ...(recaptchaToken ? { recaptchaToken } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 429) {
          return { success: false, error: 'Too many registration attempts. Please try again later.' };
        }
        if (response.status === 409) {
          return { success: false, error: 'An account with this email already exists.' };
        }
        if (response.status === 400 && data.errors) {
          // Validation errors
          const errorMessages = data.errors.map((e: any) => e.message).join('. ');
          return { success: false, error: errorMessages };
        }
        return { success: false, error: data.message || 'Signup failed' };
      }

      // Check if email verification is required
      if (data.requiresVerification) {
        return {
          success: true,
          requiresVerification: true,
          error: 'Account created! Please check your email to verify your account before logging in.'
        };
      }

      // Auto-login after successful signup (if email verification not required)
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

  const getToken = (): string | null => {
    return localStorage.getItem('choce_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        getToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
