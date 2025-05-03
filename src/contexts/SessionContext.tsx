
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SessionContextProps {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextProps>({
  session: null,
  user: null,
  signOut: async () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN') {
          // When user signs in, extend the session duration
          if (session) {
            try {
              // Refresh the session to extend it
              await supabase.auth.refreshSession(session);
              
              toast({
                title: "Welcome back!",
                description: "You have successfully signed in.",
              });
            } catch (error) {
              console.error("Failed to refresh session:", error);
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <SessionContext.Provider value={{ session, user, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};
