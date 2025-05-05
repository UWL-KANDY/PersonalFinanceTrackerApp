
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { renderWithProviders } from '@/test-utils/test-wrapper';
import { mockSuccessfulSignUp, mockFailedSignUp, mockSupabaseClient } from '@/test-utils/supabase-mocks';
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

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the registration form correctly', () => {
    renderWithProviders(<RegisterForm />);
    
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    renderWithProviders(<RegisterForm />);
    
    // Submit form with empty fields
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Full name must be at least 2 characters.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    // Mock successful registration
    mockSuccessfulSignUp();
    
    renderWithProviders(<RegisterForm />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'New User' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'newuser@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      // Check that Supabase was called with correct values
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'New User',
          },
          emailRedirectTo: expect.any(String),
        }
      });
      
      // Check toast was shown
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Registration successful!',
        description: expect.any(String),
      });
      
      // Check navigation
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('handles registration error', async () => {
    // Mock registration error
    mockFailedSignUp('Email already registered');
    
    renderWithProviders(<RegisterForm />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Existing User' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'existing@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => {
      // Check error toast was shown
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Registration failed',
        description: 'Email already registered',
      });
      
      // Check navigation was not called
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
