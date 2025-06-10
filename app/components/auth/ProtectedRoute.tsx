import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/contexts/AuthContext';
import { isAuthenticated } from '../../lib/utils/authUtils';
import type { UserRole } from '../../lib/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { user, loading, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If we have a token but no user, try to fetch the user data
    if (isAuthenticated() && !user && !loading) {
      checkAuth();
    }
  }, [user, loading, checkAuth]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If we have a token but no user yet, show loading instead of redirecting
  if (isAuthenticated() && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If no user and no token, redirect to login
  if (!user) {
    return <Navigate to="/auth"  />;
  }

  // Check role-based access with case insensitivity
  if (allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(userRole)) {
      return <Navigate to="/" />;
    }
  }

  // User is authenticated and authorized
  return <>{children}</>;
} 