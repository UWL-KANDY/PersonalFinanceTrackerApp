
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SessionContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextProps>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("SessionProvider: Initializing authentication");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log("User signed in:", currentSession?.user?.id);
          // When user signs in, show welcome toast
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token was refreshed");
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        if (data?.session) {
          console.log("Existing session found:", data.session.user.id);
        } else {
          console.log("No existing session found");
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Signing out user");
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};
