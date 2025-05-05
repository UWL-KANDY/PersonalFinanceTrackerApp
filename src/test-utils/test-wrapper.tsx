
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from '@/contexts/SessionContext';
import { vi } from 'vitest';
import { mockSupabaseClient } from './supabase-mocks';

// Mock hooks and providers
vi.mock('@/contexts/SessionContext', async () => {
  const actual = await vi.importActual<typeof import('@/contexts/SessionContext')>('@/contexts/SessionContext');
  return {
    ...actual,
    useSession: vi.fn().mockReturnValue({
      session: null,
      user: null,
      loading: false,
      signOut: vi.fn(),
    }),
  };
});

vi.mock('@/components/ui/use-toast', async () => {
  return {
    useToast: vi.fn().mockReturnValue({
      toast: vi.fn(),
    }),
  };
});

vi.mock('@/integrations/supabase/client', () => {
  return {
    supabase: mockSupabaseClient,
  };
});

// Create a custom render function with providers
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <SessionProvider>
        {ui}
      </SessionProvider>
    </BrowserRouter>
  );
}
