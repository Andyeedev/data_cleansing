import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export const ProtectedRoute = ({
  children,
  requiredRoles,
  requiredPermissions,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles if required
  if (requiredRoles && user) {
    const hasRequiredRole = requiredRoles.some((role) =>
      user.roles.includes(role)
    );
    if (!hasRequiredRole) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  // Check permissions if required
  if (requiredPermissions && user) {
    const hasRequiredPermission = requiredPermissions.some((permission) =>
      user.permissions.includes(permission)
    );
    if (!hasRequiredPermission) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  return <>{children}</>;
};
