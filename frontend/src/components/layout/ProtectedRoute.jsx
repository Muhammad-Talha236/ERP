import { Navigate } from '@tanstack/react-router';
import PropTypes from 'prop-types';
import { useIsAuthenticated, useCurrentUser } from '@/store/authStore';

/**
 * ProtectedRoute — wraps any page that requires authentication.
 *
 * If no user is logged in, redirects to /login. If a role
 * restriction is specified and the current user doesn't have it,
 * redirects to a safe default (Dashboard) rather than showing the
 * page — this is what keeps regular Admins out of /super-admin.
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

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  requiredRole: PropTypes.string,
};