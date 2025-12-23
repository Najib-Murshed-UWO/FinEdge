import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountCard } from "@/components/account-card";
import { TransactionTable } from "@/components/transaction-table";
import emptyTransactionsImg from "@assets/generated_images/Empty_transactions_illustration_4c17ba59.png";

interface SimpleAccount {
  accountName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency?: string;
}

interface SimpleTransaction {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  category?: string;
}

interface AccountsSectionProps {
  accounts: SimpleAccount[];
  recentTransactions: SimpleTransaction[];
  accountsLoading: boolean;
  transactionsLoading: boolean;
}

export function AccountsSection({
  accounts,
  recentTransactions,
  accountsLoading,
  transactionsLoading,
}: AccountsSectionProps) {
  return (
    <>
      {accountsLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <AccountCard
                  key={account.accountNumber}
                  {...account}
                  accountId={(account as any).accountId}
                  availableAccounts={accounts.map((acc) => ({
                    id: (acc as any).accountId || acc.accountNumber,
                    accountNumber: acc.accountNumber,
                    accountName: acc.accountName,
                  }))}
                />
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
              ) : recentTransactions.length > 0 ? (
                <TransactionTable transactions={recentTransactions.slice(0, 5)} />
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
    </>
  );
}