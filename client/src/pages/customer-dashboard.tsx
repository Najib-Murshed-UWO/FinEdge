import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AccountCard } from "@/components/account-card";
import { LoanCard } from "@/components/loan-card";
import { TransactionTable } from "@/components/transaction-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { accountsAPI, transactionsAPI, loansAPI } from "@/lib/api";
import emptyTransactionsImg from "@assets/generated_images/Empty_transactions_illustration_4c17ba59.png";
import emptyLoansImg from "@assets/generated_images/Empty_loans_illustration_9d895a63.png";

export default function CustomerDashboard() {
  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountsAPI.getMyAccounts(),
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsAPI.getMyTransactions(50),
  });

  const { data: loansData, isLoading: loansLoading } = useQuery({
    queryKey: ["loans"],
    queryFn: () => loansAPI.getMyLoans(),
  });

  const accounts = accountsData?.accounts || [];
  const transactions = transactionsData?.transactions || [];
  const loans = loansData?.loans || [];

  // Transform data for components
  const transformedAccounts = accounts.map((acc: any) => ({
    accountName: acc.accountName,
    accountNumber: acc.accountNumber,
    accountType: acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1),
    balance: parseFloat(acc.balance),
  }));

  const transformedTransactions = transactions.map((txn: any) => ({
    id: txn.id,
    date: new Date(txn.createdAt).toISOString().split("T")[0],
    description: txn.description || "Transaction",
    type: (txn.transactionType === "deposit" || txn.transactionType === "transfer") ? "credit" as const : "debit" as const,
    amount: parseFloat(txn.amount),
    balance: parseFloat(txn.balanceAfter),
    category: txn.transactionType.charAt(0).toUpperCase() + txn.transactionType.slice(1),
  }));

  const transformedLoans = loans.map((loan: any) => ({
    loanId: loan.loanNumber,
    loanType: loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1) + " Loan",
    amount: parseFloat(loan.principalAmount),
    interestRate: parseFloat(loan.interestRate),
    tenure: loan.tenureMonths,
    monthlyEMI: parseFloat(loan.monthlyEMI),
    amountPaid: parseFloat(loan.amountPaid),
    status: loan.status === "active" ? "active" as const : "closed" as const,
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
                <h2 className="text-2xl font-semibold mb-1">Welcome back, John!</h2>
                <p className="text-muted-foreground">Here's an overview of your accounts and recent activity</p>
              </div>

              <Tabs defaultValue="accounts" className="space-y-6">
                <TabsList data-testid="tabs-dashboard">
                  <TabsTrigger value="accounts" data-testid="tab-accounts">Accounts</TabsTrigger>
                  <TabsTrigger value="transactions" data-testid="tab-transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="loans" data-testid="tab-loans">Loans</TabsTrigger>
                </TabsList>

                <TabsContent value="accounts" className="space-y-6">
                  {accountsLoading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      <Skeleton className="h-32" />
                      <Skeleton className="h-32" />
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 md:grid-cols-2">
                        {transformedAccounts.length > 0 ? (
                          transformedAccounts.map((account) => (
                            <AccountCard key={account.accountNumber} {...account} />
                          ))
                        ) : (
                          <Card className="md:col-span-2">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                              <p className="text-muted-foreground text-center">No accounts found</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Transactions</CardTitle>
                          <CardDescription>Your latest account activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {transactionsLoading ? (
                            <Skeleton className="h-64" />
                          ) : transformedTransactions.length > 0 ? (
                            <TransactionTable transactions={transformedTransactions.slice(0, 5)} />
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                              <img src={emptyTransactionsImg} alt="" className="w-48 h-48 mb-4 opacity-50" />
                              <p className="text-muted-foreground text-center">No transactions yet</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="transactions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Transactions</CardTitle>
                      <CardDescription>Complete transaction history for all accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {transactionsLoading ? (
                        <Skeleton className="h-64" />
                      ) : transformedTransactions.length > 0 ? (
                        <TransactionTable transactions={transformedTransactions} />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <img src={emptyTransactionsImg} alt="" className="w-48 h-48 mb-4 opacity-50" />
                          <p className="text-muted-foreground text-center">No transactions yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="loans" className="space-y-6">
                  {loansLoading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      <Skeleton className="h-48" />
                      <Skeleton className="h-48" />
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {transformedLoans.length > 0 ? (
                        transformedLoans.map((loan) => (
                          <LoanCard key={loan.loanId} {...loan} />
                        ))
                      ) : (
                        <Card className="md:col-span-2">
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <img src={emptyLoansImg} alt="" className="w-48 h-48 mb-4 opacity-50" />
                            <p className="text-muted-foreground text-center">No active loans</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
