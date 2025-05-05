
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom'; // Add explicit import for fireEvent
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { 
  mockSupabaseClient, 
  mockAuthSession, 
  createMockUser, 
  createMockSession 
} from '@/test-utils/supabase-mocks';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

// Mock useToast
const mockToast = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: mockToast,
  }),
}));

// Test component that consumes SessionContext
const TestConsumer = () => {
  const { session, user, loading, signOut } = useSession();
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="session">{session ? 'Has Session' : 'No Session'}</div>
      <div data-testid="user">{user ? user.email : 'No User'}</div>
      <button onClick={signOut} data-testid="sign-out">Sign Out</button>
    </div>
  );
};

describe('SessionContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides loading state initially', () => {
    // Mock getSession to take time to resolve
    vi.spyOn(mockSupabaseClient.auth, 'getSession').mockImplementation(
      () => new Promise(() => {})
    );
    
    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>
    );
    
    expect(screen.getByTestId('loading').textContent).toBe('Loading');
  });

  it('updates session state when a session exists', async () => {
    // Mock existing session
    const mockSession = createMockSession();
    
    vi.spyOn(mockSupabaseClient.auth, 'getSession').mockResolvedValue({
      data: { session: mockSession },
      error: null
    });
    
    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
      expect(screen.getByTestId('session').textContent).toBe('Has Session');
      expect(screen.getByTestId('user').textContent).toBe('test@example.com');
    });
  });

  it('updates session state when no session exists', async () => {
    // Mock no session
    vi.spyOn(mockSupabaseClient.auth, 'getSession').mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('Not Loading');
      expect(screen.getByTestId('session').textContent).toBe('No Session');
      expect(screen.getByTestId('user').textContent).toBe('No User');
    });
  });

  it('handles sign out', async () => {
    // Mock successful sign out
    vi.spyOn(mockSupabaseClient.auth, 'signOut').mockResolvedValue({
      error: null
    });
    
    // Start with session
    vi.spyOn(mockSupabaseClient.auth, 'getSession').mockResolvedValue({
      data: { session: createMockSession() },
      error: null
    });
    
    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>
    );
    
    // Wait for initial session to load
    await waitFor(() => {
      expect(screen.getByTestId('session').textContent).toBe('Has Session');
    });
    
    // Perform sign out
    await act(async () => {
      fireEvent.click(screen.getByTestId('sign-out'));
    });
    
    // Check sign out was called
    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    
    // Check toast was shown
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Signed out',
      description: expect.any(String),
    });
  });

  it('handles auth state changes', async () => {
    // Mock initial no session
    vi.spyOn(mockSupabaseClient.auth, 'getSession').mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    // Setup mock for auth state change
    let authChangeCallback: any;
    
    vi.spyOn(mockSupabaseClient.auth, 'onAuthStateChange').mockImplementation((callback) => {
      authChangeCallback = callback;
      return {
        data: { 
          subscription: { 
            id: 'mock-subscription-id',
            callback: vi.fn(),
            unsubscribe: vi.fn() 
          } 
        }
      };
    });
    
    render(
      <SessionProvider>
        <TestConsumer />
      </SessionProvider>
    );
    
    // Wait for initial state
    await waitFor(() => {
      expect(screen.getByTestId('session').textContent).toBe('No Session');
    });
    
    // Simulate auth state change event (sign in)
    act(() => {
      authChangeCallback('SIGNED_IN', createMockSession());
    });
    
    // Check state updated
    await waitFor(() => {
      expect(screen.getByTestId('session').textContent).toBe('Has Session');
      expect(screen.getByTestId('user').textContent).toBe('test@example.com');
    });
    
    // Check toast was shown for sign in
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Welcome back!',
      description: expect.any(String),
    });
  });
});
