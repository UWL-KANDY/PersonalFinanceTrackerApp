
import { vi } from 'vitest';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

// Create complete mock User type
export const createMockUser = (overrides = {}): User => ({
  id: 'mock-user-id',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email: 'test@example.com',
  phone: '',
  confirmation_sent_at: null,
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  ...overrides
});

// Create complete mock Session type
export const createMockSession = (userOverrides = {}): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: createMockUser(userOverrides),
});

// Create complete mock AuthError type - modified to avoid protected property error
export const createMockAuthError = (overrides = {}): any => ({
  name: 'AuthApiError',
  message: 'Authentication error',
  status: 400,
  code: 'auth_error',
  // __isAuthError is now just a normal property rather than trying to match the protected property
  ...overrides
});

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { 
        subscription: { 
          id: 'mock-subscription-id',
          callback: vi.fn(),
          unsubscribe: vi.fn() 
        } 
      }
    }),
  },
};

// Helper function to reset all mocks between tests
export const resetSupabaseMocks = () => {
  Object.values(mockSupabaseClient.auth).forEach((mockFn) => {
    if (typeof mockFn.mockReset === 'function') {
      mockFn.mockReset();
    }
  });
};

// Helper functions to generate proper mock responses
export const mockSuccessfulSignIn = () => {
  mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
    data: {
      user: createMockUser(),
      session: createMockSession()
    },
    error: null
  });
};

export const mockFailedSignIn = (errorMessage = 'Invalid login credentials') => {
  mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
    data: { user: null, session: null },
    error: createMockAuthError({ message: errorMessage })
  });
};

export const mockSuccessfulSignUp = () => {
  mockSupabaseClient.auth.signUp.mockResolvedValue({
    data: {
      user: createMockUser(),
      session: null
    },
    error: null
  });
};

export const mockFailedSignUp = (errorMessage = 'Email already registered') => {
  mockSupabaseClient.auth.signUp.mockResolvedValue({
    data: { user: null, session: null },
    error: createMockAuthError({ message: errorMessage })
  });
};

export const mockAuthSession = (exists = true) => {
  if (exists) {
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: createMockSession() },
      error: null
    });
  } else {
    mockSupabaseClient.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });
  }
};

export const mockAuthChange = (event: AuthChangeEvent, session: Session | null) => {
  return (callback: any) => {
    callback(event, session);
  };
};
