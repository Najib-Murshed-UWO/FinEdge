import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authAPI, accountsAPI, transactionsAPI } from '@/lib/api';

// Mock fetch
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('authAPI', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        tokenType: 'Bearer',
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'CUSTOMER',
        },
      };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await authAPI.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password123',
        }),
        credentials: 'include',
      });
    });

    it('should register successfully', async () => {
      const mockResponse = {
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        tokenType: 'Bearer',
        user: {
          id: 'user-123',
          username: 'newuser',
          email: 'new@example.com',
          role: 'CUSTOMER',
        },
      };

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const result = await authAPI.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
        }),
        credentials: 'include',
      });
    });

    it('should handle login error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({ message: 'Invalid credentials' }),
          { status: 401 },
        ),
      );

      await expect(
        authAPI.login({
          username: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow();
    });

    it('should include Authorization header when token exists', async () => {
      localStorage.setItem('finedge_access_token', 'test-token');

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ user: {} }), { status: 200 }),
      );

      await authAPI.getCurrentUser();

      expect(fetch).toHaveBeenCalledWith(
        '/api/auth/me',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        }),
      );
    });

    it('should refresh token on 401 error', async () => {
      localStorage.setItem('finedge_access_token', 'expired-token');
      localStorage.setItem('finedge_refresh_token', 'refresh-token');

      // First call returns 401
      vi.mocked(fetch)
        .mockResolvedValueOnce(
          new Response(JSON.stringify({}), { status: 401 }),
        )
        // Refresh token call
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              accessToken: 'new-token',
              refreshToken: 'new-refresh-token',
            }),
            { status: 200 },
          ),
        )
        // Retry original call
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ user: {} }), { status: 200 }),
        );

      await authAPI.getCurrentUser();

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'finedge_access_token',
        'new-token',
      );
    });
  });

  describe('accountsAPI', () => {
    it('should get user accounts', async () => {
      const mockAccounts = [
        { id: 'acc-1', accountNumber: 'ACC001', balance: 1000 },
        { id: 'acc-2', accountNumber: 'ACC002', balance: 2000 },
      ];

      localStorage.setItem('finedge_access_token', 'test-token');

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ accounts: mockAccounts }), {
          status: 200,
        }),
      );

      const result = await accountsAPI.getMyAccounts();

      expect(result.accounts).toEqual(mockAccounts);
      expect(fetch).toHaveBeenCalledWith(
        '/api/accounts',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        }),
      );
    });

    it('should create account', async () => {
      const mockAccount = {
        id: 'acc-1',
        accountNumber: 'ACC001',
        accountType: 'SAVINGS',
      };

      localStorage.setItem('finedge_access_token', 'test-token');

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ account: mockAccount }), {
          status: 200,
        }),
      );

      const result = await accountsAPI.createAccount({
        accountType: 'SAVINGS',
        accountName: 'My Savings',
      });

      expect(result.account).toEqual(mockAccount);
      expect(fetch).toHaveBeenCalledWith(
        '/api/accounts',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            accountType: 'SAVINGS',
            accountName: 'My Savings',
          }),
        }),
      );
    });
  });

  describe('transactionsAPI', () => {
    it('should get user transactions', async () => {
      const mockTransactions = [
        { id: 'txn-1', amount: 100, type: 'DEPOSIT' },
        { id: 'txn-2', amount: 50, type: 'WITHDRAWAL' },
      ];

      localStorage.setItem('finedge_access_token', 'test-token');

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ transactions: mockTransactions }), {
          status: 200,
        }),
      );

      const result = await transactionsAPI.getMyTransactions(10, 0);

      expect(result.transactions).toEqual(mockTransactions);
      expect(fetch).toHaveBeenCalledWith(
        '/api/transactions?limit=10&offset=0',
        expect.anything(),
      );
    });

    it('should create transaction', async () => {
      const mockTransaction = {
        id: 'txn-1',
        amount: 100,
        type: 'DEPOSIT',
        status: 'COMPLETED',
      };

      localStorage.setItem('finedge_access_token', 'test-token');

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ transaction: mockTransaction }), {
          status: 200,
        }),
      );

      const result = await transactionsAPI.createTransaction({
        accountId: 'acc-1',
        transactionType: 'DEPOSIT',
        amount: '100',
        description: 'Test deposit',
      });

      expect(result.transaction).toEqual(mockTransaction);
      expect(fetch).toHaveBeenCalledWith(
        '/api/transactions',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            accountId: 'acc-1',
            transactionType: 'DEPOSIT',
            amount: '100',
            description: 'Test deposit',
          }),
        }),
      );
    });
  });
});

