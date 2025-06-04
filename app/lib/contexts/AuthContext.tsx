import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { isAuthenticated } from '../utils/authUtils';
import type { UserRole } from '../constants';

interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  name?: string;
  bio?: string;
  title?: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

// Provide default values for all properties
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  login: async () => { throw new Error('AuthContext not initialized'); },
  register: async () => { throw new Error('AuthContext not initialized'); },
  logout: async () => { throw new Error('AuthContext not initialized'); },
  checkAuth: async () => { throw new Error('AuthContext not initialized'); },
  updateUser: () => { throw new Error('AuthContext not initialized'); },
  sendVerificationEmail: async () => { throw new Error('AuthContext not initialized'); },
  verifyEmail: async () => { throw new Error('AuthContext not initialized'); },
  requestPasswordReset: async () => { throw new Error('AuthContext not initialized'); },
  resetPassword: async () => { throw new Error('AuthContext not initialized'); },
};

// Create context with default values
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Use useCallback to prevent unnecessary re-renders
  const checkAuth = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      setInitialized(true);
      return;
    }
  
    // If user already set and no error, maybe skip?
    if (user) {
      setLoading(false);
      setInitialized(true);
      return;
    }
  
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user]);

  // Check authentication on mount and when window gains focus
  useEffect(() => {
    checkAuth();
    
    // Also check auth when the window regains focus
    const handleFocus = () => {
      checkAuth();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAuth]);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      const { user } = await authService.login(email, password, rememberMe);
      setUser(user);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await authService.register(username, email, password);
      setUser(user);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user data in state
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Email verification methods
  const sendVerificationEmail = async () => {
    try {
      setLoading(true);
      await authService.sendVerificationEmail();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      setLoading(true);
      await authService.verifyEmail(token);
      // Update the user's email verification status
      if (user) {
        setUser({ ...user, emailVerified: true });
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Password reset methods
  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      await authService.requestPasswordReset(email);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setLoading(true);
      await authService.resetPassword(token, password);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Show a loading state until auth is initialized
  if (!initialized && loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      checkAuth, 
      updateUser,
      sendVerificationEmail,
      verifyEmail,
      requestPasswordReset,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  // Instead of throwing an error, we return the default context
  return context;
} 