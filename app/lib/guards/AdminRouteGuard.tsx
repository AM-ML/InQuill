import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteGuardProps {
  children: ReactNode;
}

/**
 * Route guard component that protects admin routes.
 * Uses local role check to ensure only admin/owner roles can access protected routes
 */
export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Helper function to check admin access from user role
  const hasAdminAccess = (user: any | null) => {
    // No user means no access
    if (!user || !user.role) return false;
    
    // Case insensitive comparison for admin/owner roles
    const normalizedRole = user.role.toLowerCase();
    return normalizedRole === 'admin' || normalizedRole === 'owner';
  };

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !hasAdminAccess(user)) {
      navigate('/', { replace: true });
      console.log('Non-admin user redirected to home page', user);
    }
  }, [user, loading, navigate]);

  // While loading auth state, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user doesn't have admin access, redirect to home page
  if (!hasAdminAccess(user)) {
    return <Navigate to="/" replace />;
  }

  // If user has admin access, allow access to the route
  return <>{children}</>;
} 