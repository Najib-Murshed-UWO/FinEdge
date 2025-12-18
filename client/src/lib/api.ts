const API_BASE = "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies for session
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string; role?: string; fullName?: string; phone?: string; address?: string }) =>
    request<{ user: { id: string; username: string; email: string; role: string } }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { username: string; password: string }) =>
    request<{ user: { id: string; username: string; email: string; role: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
    }),

  getCurrentUser: () =>
    request<{ user: { id: string; username: string; email: string; role: string } }>("/auth/me"),
};

// Accounts API
export const accountsAPI = {
  getMyAccounts: () =>
    request<{ accounts: any[] }>("/accounts"),

  getAccount: (id: string) =>
    request<{ account: any }>(`/accounts/${id}`),

  createAccount: (data: { accountType: string; accountName: string; currency?: string; interestRate?: string }) =>
    request<{ account: any }>("/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Transactions API
export const transactionsAPI = {
  getMyTransactions: (limit?: number, offset?: number) =>
    request<{ transactions: any[] }>(`/transactions?limit=${limit || 100}&offset=${offset || 0}`),

  getAccountTransactions: (accountId: string, limit?: number, offset?: number) =>
    request<{ transactions: any[] }>(`/accounts/${accountId}/transactions?limit=${limit || 100}&offset=${offset || 0}`),

  createTransaction: (data: {
    accountId: string;
    toAccountId?: string;
    transactionType: string;
    amount: string;
    description?: string;
    reference?: string;
  }) =>
    request<{ transaction: any }>("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Loans API
export const loansAPI = {
  getMyLoans: () =>
    request<{ loans: any[] }>("/loans"),

  getLoan: (id: string) =>
    request<{ loan: any; emiSchedules: any[] }>(`/loans/${id}`),

  getMyLoanApplications: () =>
    request<{ applications: any[] }>("/loan-applications"),

  getPendingLoanApplications: () =>
    request<{ applications: any[] }>("/loan-applications/pending"),

  getLoanApplication: (id: string) =>
    request<{ application: any; approvals: any[] }>(`/loan-applications/${id}`),

  submitLoanApplication: (data: {
    loanType: string;
    requestedAmount: string;
    purpose?: string;
    employmentDetails?: any;
    financialDocuments?: any;
  }) =>
    request<{ application: any }>("/loan-applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  reviewLoanApplication: (id: string, data: {
    action: "approve" | "reject";
    comments?: string;
    approvedAmount?: number;
    interestRate?: number;
    tenureMonths?: number;
  }) =>
    request<{ application: any; loan?: any }>(`/loan-applications/${id}/review`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  payEMI: (loanId: string, emiId: string, accountId: string) =>
    request<{ message: string }>(`/loans/${loanId}/emi/${emiId}/pay`, {
      method: "POST",
      body: JSON.stringify({ accountId }),
    }),
};

// Notifications API
export const notificationsAPI = {
  getMyNotifications: (limit?: number, offset?: number, unreadOnly?: boolean) =>
    request<{ notifications: any[] }>(`/notifications?limit=${limit || 50}&offset=${offset || 0}${unreadOnly ? "&unreadOnly=true" : ""}`),

  markNotificationAsRead: (id: string) =>
    request<{ notification: any }>(`/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllNotificationsAsRead: () =>
    request<{ message: string }>("/notifications/read-all", {
      method: "PATCH",
    }),
};

// Analytics API
export const analyticsAPI = {
  getCustomerAnalytics: () =>
    request<{
      accounts: any;
      loans: any;
      transactions: any;
      upcomingEMIs: any[];
    }>("/analytics/customer"),

  getBankerAnalytics: () =>
    request<{
      pendingApplications: number;
      totalCustomers: number;
      recentActivity: any;
    }>("/analytics/banker"),

  getAdminAnalytics: () =>
    request<{
      totalCustomers: number;
      recentAuditLogs: any[];
      systemHealth: any;
    }>("/analytics/admin"),
};

