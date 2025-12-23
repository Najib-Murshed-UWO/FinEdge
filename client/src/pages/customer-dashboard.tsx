import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/stat-card";
import { Bell, CreditCard, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { AccountsSection } from "@/components/accounts-section";
import { TransactionsSection } from "@/components/transactions-section";
import { LoansSection } from "@/components/loans-section";
import { DashboardCharts } from "@/components/dashboard-charts";

type DashboardTab = "accounts" | "transactions" | "loans";

interface CustomerDashboardProps {
  initialTab?: DashboardTab;
}

// Mock data from examples
const mockAccounts = [
  {
    accountName: "Primary Checking",
    accountNumber: "ACC123456789",
    accountType: "Checking",
    balance: 15234.56,
    accountId: "acc-001",
  },
  {
    accountName: "Savings Account",
    accountNumber: "ACC987654321",
    accountType: "Savings",
    balance: 45000.00,
    accountId: "acc-002",
  },
];

const mockTransactions = [
  {
    id: "TXN001",
    date: "2024-11-18",
    description: "Salary Deposit",
    type: "credit" as const,
    amount: 5000,
    balance: 15234.56,
    category: "Income",
  },
  {
    id: "TXN002",
    date: "2024-11-17",
    description: "Grocery Shopping",
    type: "debit" as const,
    amount: 156.78,
    balance: 10234.56,
    category: "Food & Dining",
  },
  {
    id: "TXN003",
    date: "2024-11-16",
    description: "Electric Bill Payment",
    type: "debit" as const,
    amount: 89.50,
    balance: 10391.34,
    category: "Utilities",
  },
  {
    id: "TXN004",
    date: "2024-11-15",
    description: "Transfer from Savings",
    type: "credit" as const,
    amount: 1000,
    balance: 10480.84,
    category: "Transfer",
  },
  {
    id: "TXN005",
    date: "2024-11-14",
    description: "Restaurant Payment",
    type: "debit" as const,
    amount: 45.20,
    balance: 9480.84,
    category: "Food & Dining",
  },
];

const mockLoans = [
  {
    loanId: "LOAN001",
    loanType: "Home Loan",
    amount: 250000,
    interestRate: 7.5,
    tenure: 240,
    monthlyEMI: 2012.50,
    amountPaid: 50000,
    status: "active" as const,
  },
  {
    loanId: "LOAN002",
    loanType: "Personal Loan",
    amount: 15000,
    interestRate: 12.0,
    tenure: 36,
    monthlyEMI: 498.50,
    amountPaid: 5000,
    status: "active" as const,
  },
];

const mockAnalytics = {
  accounts: {
    total: 2,
    totalBalance: 60234.56,
  },
  transactions: {
    income: 6000,
    expenses: 291.48,
    net: 5708.52,
  },
  upcomingEMIs: [
    { id: "emi-001", dueDate: "2024-12-01", amount: 2012.50 },
    { id: "emi-002", dueDate: "2024-12-05", amount: 498.50 },
  ],
};

const mockNotifications = [
  {
    id: "notif-001",
    title: "Loan Payment Due",
    message: "Your Home Loan EMI of $2,012.50 is due on December 1st",
  },
  {
    id: "notif-002",
    title: "Account Activity",
    message: "Salary deposit of $5,000 has been credited to your account",
  },
];

const mockCurrentUser = {
  id: "user-001",
  username: "John Doe",
  email: "john@example.com",
  role: "customer",
};

export default function CustomerDashboard({ initialTab = "accounts" }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<DashboardTab>(initialTab);

  // Use mock data instead of API calls
  const accounts = mockAccounts;
  const transactions = mockTransactions;
  const loans = mockLoans;
  const analytics = mockAnalytics;
  const unreadNotifications = mockNotifications;
  const currentUser = mockCurrentUser;
  const accountsLoading = false;
  const transactionsLoading = false;
  const loansLoading = false;

  // Transform data for components
  const transformedAccounts = accounts.map((acc) => ({
    accountName: acc.accountName,
    accountNumber: acc.accountNumber,
    accountType: acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1),
    balance: acc.balance,
    accountId: acc.accountId,
  }));

  const transformedTransactions = transactions.map((txn) => ({
    id: txn.id,
    date: txn.date,
    description: txn.description,
    type: txn.type,
    amount: txn.amount,
    balance: txn.balance,
    category: txn.category,
  }));

  const transformedLoans = loans.map((loan) => ({
    loanId: loan.loanId,
    loanType: loan.loanType,
    amount: loan.amount,
    interestRate: loan.interestRate,
    tenure: loan.tenure,
    monthlyEMI: loan.monthlyEMI,
    amountPaid: loan.amountPaid,
    status: loan.status,
  }));
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="customer" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-xl font-semibold flex-1">Dashboard</h1>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  {currentUser ? `Welcome back, ${currentUser.username}!` : "Welcome back!"}
                </h2>
                <p className="text-muted-foreground">Here's an overview of your accounts and recent activity</p>
              </div>

              {analytics && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Total Balance"
                    value={
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(Number(analytics.accounts.totalBalance ?? 0))
                    }
                    icon={CreditCard}
                    description={`${analytics.accounts.total} accounts`}
                  />
                  <StatCard
                    title="Last 30d Income"
                    value={
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(Number(analytics.transactions.income ?? 0))
                    }
                    icon={ArrowDownCircle}
                    description="Deposits & incoming transfers"
                  />
                  <StatCard
                    title="Last 30d Expenses"
                    value={
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(Number(analytics.transactions.expenses ?? 0))
                    }
                    icon={ArrowUpCircle}
                    description="Payments & withdrawals"
                  />
                  <StatCard
                    title="Upcoming EMIs"
                    value={`${(analytics.upcomingEMIs || []).length}`}
                    icon={Bell}
                    description="Next scheduled installments"
                  />
                </div>
              )}

              {unreadNotifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Recent important updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {unreadNotifications.slice(0, 3).map((n: any) => (
                      <div key={n.id} className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{n.title}</span>
                        <span className="text-xs text-muted-foreground">{n.message}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {transformedTransactions.length > 0 && (
                <DashboardCharts transactions={transformedTransactions} />
              )}

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DashboardTab)} className="space-y-6">
                <TabsList data-testid="tabs-dashboard">
                  <TabsTrigger value="accounts" data-testid="tab-accounts">Accounts</TabsTrigger>
                  <TabsTrigger value="transactions" data-testid="tab-transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="loans" data-testid="tab-loans">Loans</TabsTrigger>
                </TabsList>

                <TabsContent value="accounts" className="space-y-6">
                  <AccountsSection
                    accounts={transformedAccounts}
                    recentTransactions={transformedTransactions}
                    accountsLoading={accountsLoading}
                    transactionsLoading={transactionsLoading}
                  />
                </TabsContent>

                <TabsContent value="transactions" className="space-y-6">
                  <TransactionsSection
                    transactions={transformedTransactions}
                    transactionsLoading={transactionsLoading}
                  />
                </TabsContent>

                <TabsContent value="loans" className="space-y-6">
                  <LoansSection loans={transformedLoans} loansLoading={loansLoading} />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
