import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Simple centralized spinner for auth checks
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-primary"></div>
      </div>
    );
  }

  // 1. Not Logged In? -> Go to Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Logged In, but wrong role? -> Go to Login (or a specific 'Unauthorized' page)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // For now, kick them back to login to switch accounts
    return <Navigate to="/login" replace />;
  }

  // 3. Authorized -> Render the Page
  return children;
};

export default ProtectedRoute;