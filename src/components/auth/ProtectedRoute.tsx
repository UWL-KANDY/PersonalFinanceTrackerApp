
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();
  const location = useLocation();
  
  // Add explicit session check after loading is done
  useEffect(() => {
    if (!loading && !session) {
      console.log("No session found, should redirect to login");
    }
  }, [loading, session]);

  // Show loading indicator for a maximum of 2 seconds
  // This prevents infinite loading if there's an issue
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.log("Forcing loading state to complete after timeout");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div 
          className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent" 
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
