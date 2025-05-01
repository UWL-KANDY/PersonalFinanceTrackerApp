import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
