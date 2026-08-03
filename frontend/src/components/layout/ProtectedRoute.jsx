import { Navigate } from '@tanstack/react-router';
import PropTypes from 'prop-types';
import { useIsAuthenticated, useCurrentUser } from '@/store/authStore';

/**
 * ProtectedRoute — wraps any page that requires authentication.
 *
 * If no user is logged in, redirects to /login. Ensures Super Admin
 * stays in the platform console, and regular admins stay in the factory
 * modules.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.requiredRole] - e.g. 'SuperAdmin'
 */
export function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Normalize role names (e.g., 'super_admin' and 'SuperAdmin' both become 'superadmin')
  const userRole = user?.role?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
  const reqRole = requiredRole?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';

  const isSuperAdmin = userRole === 'superadmin';

  if (isSuperAdmin) {
    // Super Admin should ONLY be allowed on the Super Admin console
    if (reqRole !== 'superadmin') {
      return <Navigate to="/super-admin" />;
    }
  } else {
    // Regular admins/employees should NOT be allowed on the Super Admin console
    if (reqRole === 'superadmin') {
      return <Navigate to="/" />;
    }
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  requiredRole: PropTypes.string,
};