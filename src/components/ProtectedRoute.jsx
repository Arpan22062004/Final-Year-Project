import { Navigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until the authentication state has been determined.
  if (loading) {
    return <Loading message="Checking your session..." />;
  }

  // Redirect unauthenticated users to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content for authenticated users.
  return children;
}