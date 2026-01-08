import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { ReactNode } from 'react';

// Mock the API
vi.mock('@/lib/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

// Mock fetch
global.fetch = vi.fn();

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should provide initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('should login successfully', async () => {
    const mockResponse = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      tokenType: 'Bearer',
      user: {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'CUSTOMER',
      },
    };

    vi.mocked(authAPI.login).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('testuser', 'password123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockResponse.user);
      expect(result.current.token).toBe(mockResponse.accessToken);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'finedge_access_token',
        mockResponse.accessToken,
      );
    });
  });

  it('should handle login error', async () => {
    const error = new Error('Invalid credentials');
    vi.mocked(authAPI.login).mockRejectedValue(error);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login('testuser', 'wrongpassword');
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should register successfully', async () => {
    const mockResponse = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      tokenType: 'Bearer',
      user: {
        id: 'user-123',
        username: 'newuser',
        email: 'new@example.com',
        role: 'CUSTOMER',
      },
    };

    vi.mocked(authAPI.register).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockResponse.user);
      expect(authAPI.register).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });
    });
  });

  it('should logout successfully', async () => {
    // First login
    const mockResponse = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      tokenType: 'Bearer',
      user: {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'CUSTOMER',
      },
    };

    vi.mocked(authAPI.login).mockResolvedValue(mockResponse);
    vi.mocked(authAPI.logout).mockResolvedValue({ message: 'Logged out' });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    await act(async () => {
      await result.current.login('testuser', 'password123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Then logout
    await act(async () => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('finedge_access_token');
    });
  });

  it('should restore auth state from localStorage', async () => {
    const mockUser = {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'CUSTOMER',
    };

    localStorage.setItem('finedge_access_token', 'stored-token');
    localStorage.setItem('finedge_refresh_token', 'stored-refresh-token');
    localStorage.setItem('finedge_user', JSON.stringify(mockUser));

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ user: mockUser }), { status: 200 }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 },
    );

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('stored-token');
  });

  it('should throw error when useAuth is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});

