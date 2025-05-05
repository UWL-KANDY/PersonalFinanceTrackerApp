
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { renderWithProviders } from '@/test-utils/test-wrapper';
import { mockSuccessfulSignIn, mockFailedSignIn, mockSupabaseClient } from '@/test-utils/supabase-mocks';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useToast
const mockToast = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: mockToast,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the login form correctly', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    renderWithProviders(<LoginForm />);
    
    // Submit form with empty fields
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
      expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    // Mock successful login
    mockSuccessfulSignIn();
    
    renderWithProviders(<LoginForm />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      // Check that Supabase was called with correct values
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      
      // Check toast was shown
      expect(mockToast).toHaveBeenCalledWith({
        title: "Login successful!",
        description: expect.any(String),
      });
      
      // Check navigation
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login error', async () => {
    // Mock login error
    mockFailedSignIn('Invalid login credentials');
    
    renderWithProviders(<LoginForm />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      // Check error toast was shown
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Invalid login credentials',
      });
      
      // Check navigation was not called
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('handles forgot password flow', async () => {
    // Mock password reset
    mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
      data: {},
      error: null
    });
    
    renderWithProviders(<LoginForm />);
    
    // Fill in email
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    
    // Click forgot password
    fireEvent.click(screen.getByText('Forgot password?'));
    
    await waitFor(() => {
      // Check reset password was called
      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(Object)
      );
      
      // Check toast was shown
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Password reset email sent',
        description: expect.any(String),
      });
    });
  });
});
