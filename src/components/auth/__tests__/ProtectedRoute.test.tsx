
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useSession } from '@/contexts/SessionContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createMockSession } from '@/test-utils/supabase-mocks';

// Mock useSession hook
vi.mock('@/contexts/SessionContext');

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return {
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={ui} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    ),
  };
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    // Mock authenticated session
    (useSession as any).mockReturnValue({
      session: createMockSession(),
      user: createMockSession().user,
      loading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading state when authentication is being checked', () => {
    // Mock loading state
    (useSession as any).mockReturnValue({
      session: null,
      user: null,
      loading: true,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Should show loading spinner instead of content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    // Check for loading indicator (assuming it has a specific class)
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Mock unauthenticated state
    (useSession as any).mockReturnValue({
      session: null,
      user: null,
      loading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Should redirect to login page
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
