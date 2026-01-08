import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/pages/login';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('wouter');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const mockUseAuth = vi.mocked(useAuth);
const mockUseLocation = vi.mocked(useLocation);

describe('LoginPage', () => {
  const mockSetLocation = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue(['/login', mockSetLocation]);
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      token: null,
      refreshToken: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });
  });

  it('should render login form', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  it('should handle login error', async () => {
    const user = userEvent.setup();
    const error = new Error('Invalid credentials');
    mockLogin.mockRejectedValue(error);

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it('should redirect authenticated admin users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'user-123',
        username: 'admin',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
      isLoading: false,
      token: 'test-token',
      refreshToken: 'refresh-token',
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(<LoginPage />);

    expect(mockSetLocation).toHaveBeenCalledWith('/admin/dashboard');
  });

  it('should redirect authenticated banker users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'user-123',
        username: 'banker',
        email: 'banker@example.com',
        role: 'BANKER',
      },
      isLoading: false,
      token: 'test-token',
      refreshToken: 'refresh-token',
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(<LoginPage />);

    expect(mockSetLocation).toHaveBeenCalledWith('/banker/dashboard');
  });

  it('should redirect authenticated customer users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'user-123',
        username: 'customer',
        email: 'customer@example.com',
        role: 'CUSTOMER',
      },
      isLoading: false,
      token: 'test-token',
      refreshToken: 'refresh-token',
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(<LoginPage />);

    expect(mockSetLocation).toHaveBeenCalledWith('/dashboard');
  });

  it('should disable submit button while loading', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Button should be disabled while loading
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});

