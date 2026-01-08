import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/pages/register';
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

describe('RegisterPage', () => {
  const mockSetLocation = vi.fn();
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue(['/register', mockSetLocation]);
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      token: null,
      refreshToken: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });
  });

  it('should render registration form', () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should handle successful registration', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(undefined);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
        }),
      );
    });
  });

  it('should handle registration error', async () => {
    const user = userEvent.setup();
    const error = new Error('Username already exists');
    mockRegister.mockRejectedValue(error);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/username/i), 'existinguser');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();

    render(<RegisterPage />);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    // Form validation should prevent submission
    await waitFor(() => {
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  it('should redirect authenticated users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'CUSTOMER',
      },
      isLoading: false,
      token: 'test-token',
      refreshToken: 'refresh-token',
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(<RegisterPage />);

    expect(mockSetLocation).toHaveBeenCalledWith('/dashboard');
  });
});

