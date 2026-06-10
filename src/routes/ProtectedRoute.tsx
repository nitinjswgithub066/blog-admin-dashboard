import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './ProtectedRoute.module.css';

/**
 * ProtectedRoute — wraps all dashboard routes.
 * If not authenticated, redirects to /auth/login.
 * Shows a loading state while checking session.
 */
const ProtectedRoute = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        Verifying session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
