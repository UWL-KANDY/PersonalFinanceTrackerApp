
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pqdrtbwcsreoqluaddlc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZHJ0Yndjc3Jlb3FsdWFkZGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTYzMjUsImV4cCI6MjA2MTA5MjMyNX0.7VZfSD-41RBd4oOmkgWJm-bzsUKBqqyezqd2Da_whiY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'finance_flow_auth',
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
});
