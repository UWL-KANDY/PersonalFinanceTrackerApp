
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const location = useLocation();

  if (session) {
    // If user is logged in, redirect to dashboard
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
