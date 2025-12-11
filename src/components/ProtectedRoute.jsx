import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Protects routes based on user role and cargo
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {string[]} props.allowedRoles - Array of allowed roles (e.g., ['CUSTOMER', 'ADMIN'])
 * @param {string[]} props.allowedCargos - Array of allowed cargos for EMPLOYEE role (e.g., ['VETERINARIAN', 'CASHIER'])
 * @param {boolean} props.allowPublic - Allow access for non-authenticated users
 */
export default function ProtectedRoute({
    children,
    allowedRoles = [],
    allowedCargos = [],
    allowPublic = false
}) {
    const { user, isAuthenticated, loading } = useAuth();

    // Wait for auth state to load
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    // If route allows public access and user is not authenticated, allow
    if (allowPublic && !isAuthenticated) {
        return children;
    }

    // If user is not authenticated and route doesn't allow public, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If no roles specified, only authentication is required
    if (allowedRoles.length === 0 && allowedCargos.length === 0) {
        return children;
    }

    // Check role
    const hasRole = allowedRoles.length === 0 || allowedRoles.includes(user.role);

    // Check cargo (only for EMPLOYEE role)
    const hasCargo = allowedCargos.length === 0 ||
        (user.role === 'EMPLOYEE' && allowedCargos.includes(user.cargo));

    // Allow if user has required role and cargo
    if (hasRole && (allowedCargos.length === 0 || hasCargo)) {
        return children;
    }

    // Redirect based on user role
    if (user.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
    } else if (user.role === 'EMPLOYEE') {
        return <Navigate to="/employee" replace />;
    } else if (user.role === 'CUSTOMER') {
        return <Navigate to="/" replace />;
    }

    // Fallback to login
    return <Navigate to="/login" replace />;
}
