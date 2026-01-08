import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('wouter');

const mockUseAuth = vi.mocked(useAuth);
const mockUseLocation = vi.mocked(useLocation);

describe('ProtectedRoute', () => {
  const mockSetLocation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue(['/current', mockSetLocation]);
  });

  it('should show loading spinner when loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
      token: null,
      refreshToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      token: null,
      refreshToken: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(mockSetLocation).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when authenticated', () => {
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
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockSetLocation).not.toHaveBeenCalled();
  });

  it('should allow access when user role matches allowedRoles', () => {
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
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(
      <ProtectedRoute allowedRoles={['banker', 'admin']}>
        <div>Banker Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Banker Content')).toBeInTheDocument();
  });

  it('should redirect when user role does not match allowedRoles', () => {
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
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(
      <ProtectedRoute allowedRoles={['banker', 'admin']}>
        <div>Banker Content</div>
      </ProtectedRoute>,
    );

    expect(mockSetLocation).toHaveBeenCalledWith('/dashboard');
    expect(screen.queryByText('Banker Content')).not.toBeInTheDocument();
  });

  it('should handle case-insensitive role matching', () => {
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
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshAccessToken: vi.fn(),
    });

    render(
      <ProtectedRoute allowedRoles={['admin']}>
        <div>Admin Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});

